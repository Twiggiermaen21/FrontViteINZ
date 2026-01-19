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
const [isSaving, setIsSaving] = useState(false);
  const headerRef = useRef();
  const bottomRef = useRef();

  const [yearActive, setYearActive] = useState(false);
  const [yearText, setYearText] = useState("2025");
  const [yearColor, setYearColor] = useState("#ffffff");
  const [yearFontSize, setYearFontSize] = useState(32);
  const [yearPosition, setYearPosition] = useState({
    coords: { x: 50, y: 20 },
  });
  const [xLimits, setXLimits] = useState({ min: 40, max: 252 });
  const [yLimits, setYLimits] = useState({ min: 20, max: 178 });
  const [monthTexts, setMonthTexts] = useState(["", "", ""]);
  const months = ["Grudzień", "Styczeń", "Luty"];
  const [fontSettings, setFontSettings] = useState(
    months.map(() => ({
      fontFamily: "Arial",
      fontWeight: "400",
      fontColor: "#333333",
      fontSize: 14,
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
  
  // ROZDZIELONE STANY ŁADOWANIA
  const [loading, setLoading] = useState(false);
  const [loadingBg, setLoadingBg] = useState(false);
  
  const [calendarName, setCalendarName] = useState("");

  const handleMonthTextChange = (index, value) => {
    const newTexts = [...monthTexts];
    newTexts[index] = value;
    setMonthTexts(newTexts);
  };

  const handleSaveCalendar = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const formData = new FormData();
    formData.append("name", calendarName);
setIsSaving(true);
    if (image !== null) {
      if (imageFromDisk) {
        formData.append("imageFromDisk", "true");
        formData.append("top_image", image);
      } else {
        formData.append("imageFromDisk", "false");
        formData.append("top_image", image.id);
      }
    }

    if (style === "style1") {
      formData.append("bottom_type", "color");
      formData.append("bottom_color", bgColor);
    }

    if (style === "style2") {
      if (gradientTheme === "classic") {
        const direction = {
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

    if (style === "style3" && backgroundImage) {
      formData.append("bottom_type", "image");
      formData.append("bottom_image", backgroundImage.id);
    }

    if (yearActive) {
      formData.append("yearColor", yearColor);
      formData.append("yearFontSize", yearFontSize);
      formData.append("yearFontFamily", yearFontFamily);
      formData.append("yearFontWeight", yearFontWeight);
      formData.append("yearPositionX", yearPosition.coords.x);
      formData.append("yearPositionY", yearPosition.coords.y);
      formData.append("yearText", yearText);
    }

    for (let i = 0; i < months.length; i++) {
      const fieldName = `field${i + 1}`;
      if (isImageMode[i]) {
        formData.append(fieldName, JSON.stringify({
          image: "true",
          scale: imageScales[i],
          positionX: positions[i].x,
          positionY: positions[i].y,
        }));
        formData.append(`${fieldName}_image`, monthImages[i]);
      } else {
        formData.append(fieldName, JSON.stringify({
          text: monthTexts[i],
          font: fontSettings[i],
        }));
      }
    }

    try {
      const response = await axios.post(`${apiUrl}/calendars/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ Kalendarz zapisany:", response.data);
      alert("✅ Kalendarz został zapisany!");
    } catch (error) {
      console.error("❌ Błąd zapisu:", error.response?.data || error.message);
      alert("❌ Nie udało się zapisać kalendarza.");
    }finally {
        setIsSaving(false); // Odblokowujemy przycisk niezależnie od wyniku (success/error)
    }
  };

  const fetchImages = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    try {
      const res = await axios.get(`${apiUrl}/generate/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: page, page_size: 12 },
      });
      setImages((prev) => [...prev, ...res.data.results]);
      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania obrazów:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchImagesBackground = async () => {
    if (!hasMoreBackground || loadingBg) return;
    setLoadingBg(true); // UŻYCIE loadingBg
    const token = localStorage.getItem(ACCESS_TOKEN);
    try {
      const res = await axios.get(`${apiUrl}/generate/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageBackground, page_size: 12 },
      });
      setImagesBackground((prev) => [...prev, ...res.data.results]);
      setHasMoreBackground(!!res.data.next);
      setPageBackground((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania obrazów tła:", err);
    } finally {
      setLoadingBg(false); // UŻYCIE loadingBg
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


console.log("Settings fontowe:", fontSettings);

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
    // Przyciski blokuje się, jeśli nazwa jest pusta LUB trwa zapis
    disabled={!calendarName.trim() || isSaving}
    className={`mt-2 w-full px-6 py-2 rounded-lg text-sm font-semibold shadow transition-all duration-200 flex items-center justify-center
        ${!calendarName.trim() || isSaving
            ? "bg-[#3b3c3c] text-[#8a8a8a] cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
        }`}
>
    {isSaving ? (
        <>
            <div className="w-4 h-4 mr-2 border-2 border-t-white border-b-gray-400 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            Zapisywanie...
        </>
    ) : (
        "Zapisz kalendarz"
    )}
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
        {style === "style3" && (
          <BackgroundImg
            images={imagesBackground}
            fetchImages={fetchImagesBackground}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            hasMore={hasMoreBackground}
            loading={loadingBg} // PRZEKAZANIE loadingBg
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
          fontFamilies={fontFamilies}
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
            fontSettings={fontSettings}
            monthImages={monthImages[index]}
            imageScales={imageScales[index]}
            fontFamilies={fontFamilies}
            fontWeights={fontWeights}
            setIsImageMode={setIsImageMode}
            setImageScales={setImageScales}
            setMonthImages={setMonthImages}
            setFontSettings={setFontSettings}
          />
        ))}
      </div>

      <div className="lg:col-span-4 justify-center flex mt-4">
        <div className=" w-[292px] mx-auto rounded-4xl shadow-lg ">
          <div className=" rounded overflow-hidden shadow ">
            <div
              ref={headerRef}
              className="relative w-full bg-gray-200 flex items-center justify-center"
              style={{ height: "198px", width: "100%" }}
            >
              {image ? (
                <>
                  <img
                    src={imageFromDisk ? URL.createObjectURL(image) : image.url}
                    alt="Nagłówek"
                    className="w-full h-full object-cover"
                  />
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

            <div
              ref={bottomRef}
              className="w-full flex flex-col items-center overflow-hidden"
              style={{
                height: "602px",
                width: "292px",
                ...getBottomSectionBackground({
                  style,
                  bgColor,
                  gradientEndColor,
                  gradientTheme,
                  gradientStrength,
                  gradientVariant,
                  backgroundImage,
                }),
              }}
            >
              {months.map((month, index) => (
                <Fragment key={month}>
                  <div
                    className="bg-white shadow-sm flex flex-col items-center border border-gray-200"
                    style={{
                      height: "132px",
                      width: "273px",
                      marginTop: "4px",
                    }}
                  >
                    <h3 className="text-[12px] font-bold text-blue-700 uppercase mt-1">
                      {month}
                    </h3>
                    <div className="w-full flex-grow text-[10px] text-gray-400 flex items-center justify-center">
                      [Siatka dni]
                    </div>
                  </div>

                  <div
                    className="w-full flex items-center px-2 justify-center overflow-hidden"
                    style={{ height: "65px" }}
                  >
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
                        setFontSettings={setFontSettings}
                        fontSettings={fontSettings}
                        index={index}
                        onChange={handleMonthTextChange}
                        placeholder="Wpisz tekst reklamowy..."
                        maxChars={100}
                      />
                    )}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}