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
  const [gradientTheme, setGradientTheme] = useState("classic");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const headerRef = useRef();
  const bottomRef = useRef();

  const [yearActive, setYearActive] = useState(false);
  const [yearText, setYearText] = useState("2026");
  const [yearColor, setYearColor] = useState("#ffffff");
  const [yearFontSize, setYearFontSize] = useState(400);
  const [yearPosition, setYearPosition] = useState({
    coords: { x: 600, y: 300 },
  });
  const [xLimits, setXLimits] = useState({ min: 0, max: 3661 });
  const [yLimits, setYLimits] = useState({ min: 0, max: 2480 });

  const [monthTexts, setMonthTexts] = useState(["", "", ""]);
  const months = ["Grudzień", "Styczeń", "Luty"];

  // 4. Ustawienia czcionek dla Pasków Reklamowych
  // Pasek ma teraz 768px wysokości, więc czcionka 14px byłaby niewidoczna.
  // Ustawiamy ok. 180-200px na start.
  const [fontSettings, setFontSettings] = useState(
    months.map(() => ({
      fontFamily: "Arial",
      fontWeight: "400",
      fontColor: "#333333",
      fontSize: 200, // Startowa wielkość tekstu reklamowego
    })),
  );

  const [monthImages, setMonthImages] = useState(() => months.map(() => ""));
  const [isImageMode, setIsImageMode] = useState(() => months.map(() => false));
  const [imageScales, setImageScales] = useState(() => months.map(() => 1));
  const [positions, setPositions] = useState(() =>
    months.map(() => ({ x: 0, y: 0 })),
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
        formData.append(
          fieldName,
          JSON.stringify({
            image: "true",
            scale: imageScales[i],
            positionX: positions[i].x,
            positionY: positions[i].y,
          }),
        );
        formData.append(`${fieldName}_image`, monthImages[i]);
      } else {
        formData.append(
          fieldName,
          JSON.stringify({
            text: monthTexts[i],
            font: fontSettings[i],
          }),
        );
      }
    }

    try {
      const response = await axios.post(`${apiUrl}/calendars/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      alert("✅ Kalendarz został zapisany!");
    } catch (error) {
      console.error("❌ Błąd zapisu:", error.response?.data || error.message);
      alert("❌ Nie udało się zapisać kalendarza.");
    } finally {
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
    const onMouseMove = (e) => {
      handleMouseMove(e, {
        dragging,
        dragStartPos,
        setYearPosition,
        zoom: 0.08, // <--- PRZEKAZUJEMY ZOOM
        containerRef: headerRef, // <--- PRZEKAZUJEMY REF KONTENERA (ten co ma 3661px szerokości)
        spanRef: spanRef, // <--- PRZEKAZUJEMY REF NAPISU
      });
    };

    const onMouseUp = () => {
      handleMouseUp(setDragging);
    };

    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, setYearPosition]); // Zależności useEffecta

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
          </label>ww
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
        ${
          !calendarName.trim() || isSaving
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
        {/* KONTENER SKALUJĄCY */}
        <div
          className="mx-auto rounded-4xl shadow-lg origin-top"
          style={{ zoom: "0.08" }}
        >
          <div
            className="rounded overflow-hidden shadow bg-white"
            style={{ width: "3661px" }}
          >
            {/* --- GŁÓWKA (21 cm = 2480 px) --- */}
            <div
              ref={headerRef}
              className="relative w-full bg-gray-200 flex items-center justify-center overflow-hidden"
              style={{ height: "2480px", width: "3661px" }}
            >
              {image ? (
                <>
                  <img
                    src={imageFromDisk ? URL.createObjectURL(image) : image.url}
                    alt="Nagłówek"
                    className="w-full h-full object-cover"
                    draggable={false} // Ważne: blokuje domyślne przeciąganie obrazka przeglądarki
                  />
                  {yearActive && (
                    <span
                      ref={spanRef}
                      onMouseDown={(e) =>
                        handleMouseDown(e, {
                          yearPosition,
                          setYearPosition,
                          spanRef,
                          xLimits, // Upewnij się, że xLimits są ustawione na 0-3661 (z YearText)
                          yLimits, // Upewnij się, że yLimits są ustawione na 0-2480 (z YearText)
                          setDragging,
                          dragStartPos,
                          zoom: 0.08, // Przekazujemy zoom, aby przesuwanie myszką działało płynnie
                        })
                      }
                      style={{
                        position: "absolute",
                        // ZMIANA 1: Używamy bezpośrednio współrzędnych z edytora (są już w dużej skali)
                        left: `${yearPosition.coords.x}px`,
                        top: `${yearPosition.coords.y}px`,

                        // ZMIANA 2: Usuwamy mnożnik * 12.5. Edytor YearText zwraca już duże wartości (100-1000px)
                        fontSize: `${yearFontSize}px`,

                        color: yearColor,
                        fontWeight: yearFontWeight,
                        fontFamily: yearFontFamily,
                        cursor: "move",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                        lineHeight: 1, // Zapobiega dziwnym odstępom przy dużych fontach

                        // Opcjonalnie: Jeśli preset to 'center', można dodać translate,
                        // ale przy swobodnym przesuwaniu (custom) lepiej zostawić top-left anchor.
                        // Jeśli Twoje presety w YearText ustawiają X na środek, to tekst zacznie się od środka.
                        // Aby go wycentrować idealnie względem punktu X, można dodać warunek, ale
                        // dla prostoty drag&drop najlepiej zostawić standardowe pozycjonowanie.
                      }}
                    >
                      {yearText}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-500" style={{ fontSize: "100px" }}>
                  Brak grafiki nagłówka
                </span>
              )}
            </div>

            {/* --- PLECKI / DÓŁ --- */}
            <div
              ref={bottomRef}
              className="w-full flex flex-col items-center overflow-hidden"
              style={{
                height: "7087px",
                width: "3661px",
                ...getBottomSectionBackground({
                  style,
                  bgColor,
                  gradientEndColor,
                  gradientTheme,
                  gradientVariant,
                  backgroundImage,
                }),
              }}
            >
              {months.map((month, index) => (
                <Fragment key={month}>
                  {/* --- KALENDARIUM (Siatka dni) --- */}
                  <div
                    className="bg-white shadow-sm flex flex-col items-center border border-gray-200"
                    style={{
                      height: "1594px",
                      width: "3425px",
                      // ZMIANA: Symetryczne odstępy góra/dół
                      marginTop: "25px",
                      marginBottom: "25px",
                      borderWidth: "5px",
                    }}
                  >
                    <h3
                      className="font-bold text-blue-700 uppercase mt-4"
                      style={{ fontSize: "150px", marginTop: "40px" }}
                    >
                      {month}
                    </h3>
                    <div
                      className="w-full flex-grow text-gray-400 flex items-center justify-center"
                      style={{ fontSize: "100px" }}
                    >
                      [Siatka dni]
                    </div>
                  </div>

                  {/* --- PASEK REKLAMOWY --- */}
                  <div
                    className="w-full flex items-center justify-center px-28 overflow-hidden"
                    style={{ height: "768px" }}
                  >
                    {isImageMode[index] ? (
                      <ImageEditor
                        imageSrc={monthImages[index]}
                        setImageSrc={(newValue) =>
                          setMonthImages((prev) =>
                            prev.map((img, i) =>
                              i === index ? newValue : img,
                            ),
                          )
                        }
                        imageScale={imageScales[index]}
                        setImageScale={(newValue) =>
                          setImageScales((prev) =>
                            prev.map((s, i) => (i === index ? newValue : s)),
                          )
                        }
                        position={positions[index]}
                        setPosition={(newValue) =>
                          setPositions((prev) =>
                            prev.map((p, i) => (i === index ? newValue : p)),
                          )
                        }
                        containerZoom={0.08}
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
                        scale={12.5}
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
