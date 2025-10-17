import { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import { ACCESS_TOKEN, fontFamilies, fontWeights } from "../constants";
import StyleSidebar from "../components/calendarEditorElements/stylesBar";
import ImgColor from "../components/calendarEditorElements/imgAndColor";
import GradientSettings from "../components/calendarEditorElements/imgAndFade";
import BackgroundImg from "../components/calendarEditorElements/imgAndImg";
import YearText from "../components/calendarEditorElements/yearText";
import LimitedTextarea from "../components/calendarEditorElements/contentEdittableText";
import ImageEditor from "../components/calendarEditorElements/ImageEditor";
import MonthEditor from "../components/calendarEditorElements/textOrImg";
import { getYearPositionStyles } from "../utils/getYearPositionStyles";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";
import {
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
} from "../utils/dragUtils";
const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

export default function CreateCalendar() {
  const [style, setStyle] = useState("style1");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [imagesBackground, setImagesBackground] = useState([]);
  const [gradientVariant, setGradientVariant] = useState("diagonal");
  const [gradientEndColor, setGradientEndColor] = useState("#ffffff");
  const [gradientStrength, setGradientStrength] = useState("medium");
  const [gradientTheme, setGradientTheme] = useState("classic");
  const [backgroundImage, setBackgroundImage] = useState(null);
  
  const headerRef = useRef();
  const bottomRef = useRef();

  const [yearActive, setYearActive] = useState(false);
  const [yearText, setYearText] = useState("2025");
  const [yearColor, setYearColor] = useState("#ffffff");
  const [yearFontSize, setYearFontSize] = useState(32);
  const [yearPosition, setYearPosition] = useState({
    coords: { x: 50, y: 20 },
  });
  const [xLimits, setXLimits] = useState({ min: 50, max: 325 });
  const [yLimits, setYLimits] = useState({ min: 20, max: 235 });
  const [monthTexts, setMonthTexts] = useState(["", "", ""]);
  const months = ["Grudzień", "Styczeń", "Luty"];
  const [fontSettings, setFontSettings] = useState(
    months.map(() => ({
      fontFamily: "Arial",
      fontWeight: "400",
      fontColor: "#333333",
    }))
  );
  const [monthImages, setMonthImages] = useState(() => months.map(() => ""));
  const [isImageMode, setIsImageMode] = useState(() => months.map(() => false));
  const [imageScales, setImageScales] = useState(() => months.map(() => 1));
  const [positions, setPositions] = useState(() =>
    months.map(() => ({ x: 0, y: 0 }))
  );
  const [imageFromDisk, setImageFromDisk] = useState(false);
  const [yearFontWeight, setYearFontWeight] = useState("bold");
  const [yearFontFamily, setYearFontFamily] = useState("Arial");
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });
  const spanRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [page, setPage] = useState(1);
  const [pageBackground, setPageBackground] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreBackground, setHasMoreBackground] = useState(true);
  const [loading, setLoading] = useState(false);
  const [calendarName, setCalendarName] = useState("");

  const handleMonthTextChange = (index, value) => {
    const newTexts = [...monthTexts];
    newTexts[index] = value;
    setMonthTexts(newTexts);
  };




  const handleSaveCalendar = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    // Zamiast zwykłego obiektu robimy FormData
    const formData = new FormData();
    formData.append("name", calendarName);
    // ----- TOP IMAGE -----
    if (image !== null) {
      if (imageFromDisk) {
        formData.append("imageFromDisk", "true");
        formData.append("top_image", image); // raw plik
      } else {
        formData.append("imageFromDisk", "false");
        formData.append("top_image", image.id); // tylko ID obrazka
      }
    }

    // ----- STYLE -----
    if (style === "style1") {
      formData.append("bottom_type", "color");
      formData.append("bottom_color", bgColor);
    }

    if (style === "style2") {
      if (gradientTheme === "classic") {
        const direction =
          {
            diagonal: "to bottom right",
            vertical: "to bottom",
            horizontal: "to right",
            radial: "radial",
          }[gradientVariant] || "to bottom";

        formData.append("bottom_type", "gradient");
        formData.append("gradient_start_color", bgColor);
        formData.append("gradient_end_color", gradientEndColor);
        formData.append("gradient_direction", direction);
        formData.append("gradient_strength", gradientStrength);
        formData.append("gradient_theme", gradientTheme);
      } else {
        formData.append("bottom_type", "theme-gradient");
        formData.append("gradient_theme", gradientTheme);
        formData.append("gradient_start_color", bgColor);
        formData.append("gradient_end_color", gradientEndColor);
      }
    }

    if (style === "style3") {
      formData.append("bottom_type", "image");
      formData.append("bottom_image", backgroundImage.id);
    }

    // ----- YEAR -----
    if (yearActive) {
      formData.append("yearColor", yearColor);
      formData.append("yearFontSize", yearFontSize);
      formData.append("yearFontFamily", yearFontFamily);
      formData.append("yearFontWeight", yearFontWeight);
      formData.append("yearPositionX", yearPosition.coords.x);
      formData.append("yearPositionY", yearPosition.coords.y);
      formData.append("yearText", yearText);
    }
    // ----- MIESIĄCE -----
    for (let i = 0; i < months.length; i++) {
      const fieldName = `field${i + 1}`; // field1, field2...

      if (isImageMode[i]) {
        formData.append(
          fieldName,
          JSON.stringify({
            image: "true",
            scale: imageScales[i],
            positionX: positions[i].x,
            positionY: positions[i].y,
          })
        );

        formData.append(`${fieldName}_image`, monthImages[i]);
      } else {
        formData.append(
          fieldName,
          JSON.stringify({
            text: monthTexts[i],
            font: fontSettings[i],
          })
        );
      }
    }

    // ----- REQUEST -----
    try {
      const response = await axios.post(`${apiUrl}/calendars/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Utworzono kalendarz:", response.data);
      alert("✅ Kalendarz został zapisany!");
    } catch (error) {
      console.error("❌ Błąd zapisu:", error.response?.data || error.message);
      alert("❌ Nie udało się zapisać kalendarza. Sprawdź dane.");
    }
  };

  const fetchImages = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/generate/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page:page, page_size: 12 }, // backend musi obsługiwać paginację
      });

      setImages((prev) => [...prev, ...res.data.results]);
      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania obrazów:", err);
      if (err.response?.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 500); // odświeży po 0.5 sekundy
      }
    } finally {
      setLoading(false);
    }
  };


    const fetchImagesBackground = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/generate/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageBackground, page_size: 12 }, // backend musi obsługiwać paginację
      });

      setImagesBackground((prev) => [...prev, ...res.data.results]);
      setHasMoreBackground(!!res.data.next);
      setPageBackground((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania obrazów:", err);
      if (err.response?.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 500); // odświeży po 0.5 sekundy
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchImages();
    fetchImagesBackground();
  }, []);

  useEffect(() => {
    const onMove = (e) =>
      handleMouseMove(e, {
        dragging,
        dragStartPos,
        xLimits,
        yLimits,
        setYearPosition,
      });

    const onUp = () => handleMouseUp(setDragging);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, xLimits, yLimits]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-14 gap-6 px-4">
      <div className="lg:col-span-3 space-y-2 ">
        <StyleSidebar
          style={style}
          setStyle={setStyle}
          images={images}
          loading={loading}
          hasMore={hasMore}
          fetchImages={fetchImages}
          setImage={setImage}
          setDimensions={setDimensions}
          setImageFromDisk={setImageFromDisk}
        />
        <div className="bg-[#2a2b2b] rounded-3xl p-5 shadow-lg mt-4">
  <label className="block text-sm font-medium text-[#d2e4e2] mb-2">
    Wpisz nazwę kalendarza
  </label>

  <input
    type="text"
    value={calendarName}
    onChange={(e) => setCalendarName(e.target.value)}
    placeholder="np. Kalendarz firmowy 2025"
    className="w-full h-12 rounded-lg px-3 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] focus:border-[#6d8f91] focus:outline-none transition-colors"
  />

  <button
    onClick={handleSaveCalendar}
    disabled={!calendarName.trim()}
    className={`mt-4 w-full px-6 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-200
      ${
        calendarName.trim()
          ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
          : "bg-[#3b3c3c] text-[#8a8a8a] cursor-not-allowed"
      }`}
  >
    Zapisz kalendarz
  </button>
</div>
      </div>

      <div className="lg:col-span-3 space-y-2 ">
        {style === "style1" && (
          <ImgColor
            bgColor={bgColor}
            setBgColor={setBgColor}
            image={image}
            setGradientEndColor={setGradientEndColor}
          />
        )}
        {/* Opcje dla gradientu */}
        {style === "style2" && (
          <GradientSettings
            image={image}
            bgColor={bgColor}
            setBgColor={setBgColor}
            gradientEndColor={gradientEndColor}
            setGradientEndColor={setGradientEndColor}
            gradientVariant={gradientVariant}
            setGradientVariant={setGradientVariant}
            gradientTheme={gradientTheme}
            setGradientTheme={setGradientTheme}
            gradientStrength={gradientStrength}
            setGradientStrength={setGradientStrength}
          />
        )}

        {/* Opcje dla stylu 3: tylko grafika */}
        {style === "style3" && (
          <BackgroundImg
            images={imagesBackground}
            fetchImages={fetchImagesBackground}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            hasMore={hasMoreBackground}
            loading={loading}
          />
        )}

        <YearText
          yearText={yearText}
          setYearText={setYearText}
          yearColor={yearColor}
          setYearColor={setYearColor}
          yearFontSize={yearFontSize}
          setYearFontSize={setYearFontSize}
          yearFontFamily={yearFontFamily}
          setYearFontFamily={setYearFontFamily}
          yearFontWeight={yearFontWeight}
          setYearFontWeight={setYearFontWeight}
          yearPosition={yearPosition}
          setYearPosition={setYearPosition}
          setYearActive={setYearActive}
          yearActive={yearActive}
          dragging={dragging}
          setXLimits={setXLimits}
          setYLimits={setYLimits}
          xLimits={xLimits}
          yLimits={yLimits}
        />
      </div>
      <div className="lg:col-span-3 space-y-2 ">
        {months.map((month, index) => (
          <MonthEditor
            key={month}
            month={month}
            index={index}
            isImageMode={isImageMode[index]}
            // toggleImageMode={toggleImageMode}
            fontSettings={fontSettings}
            // handleFontSettingChange={handleFontSettingChange}
            monthTexts={monthTexts[index]}
            handleMonthTextChange={handleMonthTextChange}
            monthImages={monthImages[index]}
            imageScales={imageScales[index]}
            fontFamilies={fontFamilies}
            fontWeights={fontWeights}
            setIsImageMode={setIsImageMode}
            setImageScales={setImageScales}
            setMonthImages={setMonthImages}
            setFontSettings={setFontSettings}
            setMonthTexts={setMonthTexts}
          />
        ))}
      </div>

      {/* Preview area */}
      <div className="lg:col-span-4  mt-4">
        <div className=" bg-[#2a2b2b]  rounded-4xl shadow-lg  p-6">
          <div className=" rounded overflow-hidden shadow   ">
            {/* Header */}
            <div
              ref={headerRef}
              className="relative h-[162px] bg-gray-200 flex items-center justify-center"
            >
              {image ? (
                <>
                  <img
                    src={imageFromDisk ? URL.createObjectURL(image) : image.url}
                    alt="Nagłówek"
                    className="w-full h-full object-cover"
                  />
                  {/* Tekst z rokiem */}
                  {yearActive && (
                    <span
                      ref={spanRef}
                      onMouseDown={(e) =>
                        handleMouseDown(e, {
                          yearPosition,
                          setYearPosition,
                          spanRef,
                          xLimits,
                          yLimits,
                          setDragging,
                          dragStartPos,
                        })
                      }
                      style={{
                        position: "absolute",
                        color: yearColor,
                        fontSize: `${yearFontSize}px`,
                        fontWeight: yearFontWeight,
                        fontFamily: yearFontFamily,
                        cursor: "move",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        pointerEvents: "auto",
                        ...getYearPositionStyles(yearPosition),
                      }}
                    >
                      {yearText}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-500">Brak grafiki nagłówka</span>
              )}
            </div>

            {/* Bottom */}
            <div
              ref={bottomRef}
              className="h-[620px] p-2 flex flex-col  items-center text-center"
              style={getBottomSectionBackground({
                style,
                bgColor,
                gradientEndColor,
                gradientTheme,
                gradientStrength,
                gradientVariant,
                backgroundImage,
              })}
            >
              {months.map((month, index) => (
                <Fragment key={month}>
                  <div className="w-full border rounded bg-white shadow p-2 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide mb-1">
                      {month}
                    </h3>
                    <div className="w-full h-[60px] text-sm text-gray-600 flex items-center justify-center">
                      [Siatka dni dla {month}]
                    </div>
                  </div>
                  {isImageMode[index] ? (
                    <ImageEditor
                      imageSrc={monthImages[index]}
                      setImageSrc={(newValue) =>
                        setMonthImages((prev) =>
                          prev.map((img, i) => (i === index ? newValue : img))
                        )
                      }
                      imageScale={imageScales[index]}
                      setImageScale={(newValue) =>
                        setImageScales((prev) =>
                          prev.map((s, i) => (i === index ? newValue : s))
                        )
                      }
                      position={positions[index]}
                      setPosition={(newValue) =>
                        setPositions((prev) =>
                          prev.map((p, i) => (i === index ? newValue : p))
                        )
                      }
                    />
                  ) : (
                    <LimitedTextarea
                      value={monthTexts[index]}
                      index={index}
                      onChange={handleMonthTextChange}
                      placeholder="Wpisz tekst pod miesiącem..."
                      fontFamily={fontSettings[index].fontFamily}
                      fontWeight={fontSettings[index].fontWeight}
                      fontColor={fontSettings[index].fontColor}
                      maxChars={1000}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
