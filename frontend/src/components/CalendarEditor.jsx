import { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { FastAverageColor } from "fast-average-color";
import StyleSidebar from "./calendarEditorElements/stylesBar";
import ImgColor from "./calendarEditorElements/imgAndColor";
import GradientSettings from "./calendarEditorElements/imgAndFade";
import BackgroundImg from "./calendarEditorElements/imgAndImg";
import YearText from "./calendarEditorElements/yearText";
import LimitedTextarea from "./calendarEditorElements/contentEdittableText";
import ImageEditor from "./calendarEditorElements/ImageEditor";
import MonthEditor from "./calendarEditorElements/textOrImg";
import { getYearPositionStyles } from "../utils/getYearPositionStyles";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";

const fontFamilies = [
  "Arial",
  "Courier New",
  "Georgia",
  "Tahoma",
  "Verdana",
  "Roboto",
];
const fontWeights = ["300", "400", "500", "600", "700", "bold", "normal"];
const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

export default function CalendarEditor() {
  const [style, setStyle] = useState("style1");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
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
  const [monthImages, setMonthImages] = useState(() => months.map(() => null));
  const [isImageMode, setIsImageMode] = useState(() => months.map(() => false));
  const [imageScales, setImageScales] = useState(() => months.map(() => 1));
  const [positions, setPositions] = useState(() =>
    months.map(() => ({ x: 0, y: 0 }))
  );

  const [yearFontWeight, setYearFontWeight] = useState("bold");
  const [yearFontFamily, setYearFontFamily] = useState("Arial");
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });
  const spanRef = useRef(null);
  const toggleImageMode = (index) => {
    setIsImageMode((prev) => {
      const newMode = [...prev];
      newMode[index] = !newMode[index];
      return newMode;
    });
  };

  const handleImageChange = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setMonthImages((prev) => {
        const newImgs = [...prev];
        newImgs[index] = url;
        return newImgs;
      });
      setImageScales((prev) => {
        const newScales = [...prev];
        newScales[index] = 1;
        return newScales;
      });
    }
  };

  const handleImageScaleChange = (index, value) => {
    setImageScales((prev) => {
      const newScales = [...prev];
      newScales[index] = parseFloat(value);
      return newScales;
    });
  };

  const extractColorsFromImage = async (imgUrl) => {
    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          const color = await fac.getColorAsync(img);
          const hex = color.hex;

          // Wygeneruj drugi kolor (jaśniejszy lub ciemniejszy)
          const adjustBrightness = (hex, percent) => {
            const num = parseInt(hex.slice(1), 16);
            const r = Math.min(255, Math.max(0, (num >> 16) + percent))
              .toString(16)
              .padStart(2, "0");
            const g = Math.min(
              255,
              Math.max(0, ((num >> 8) & 0x00ff) + percent)
            )
              .toString(16)
              .padStart(2, "0");
            const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
              .toString(16)
              .padStart(2, "0");
            return `#${r}${g}${b}`;
          };

          const secondary = adjustBrightness(hex, -40);

          setBgColor(hex);
          setGradientEndColor(secondary);

          resolve();
        } catch (err) {
          console.error("Błąd przy pobieraniu koloru:", err);
          reject(err);
        }
      };
      img.onerror = reject;
    });
  };

  const handleMonthTextChange = (index, value) => {
    const newTexts = [...monthTexts];
    newTexts[index] = value;
    setMonthTexts(newTexts);
  };

  const handleFontSettingChange = (index, field, value) => {
    const updated = [...fontSettings];
    updated[index] = { ...updated[index], [field]: value };
    setFontSettings(updated);
  };

  const handleSaveCalendar = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    let data = {};
    if (image !== null) {
      data.top_image = image.id;
    }

    if (style === "style1") {
      data.bottom_type = "color";
      data.bottom_color = bgColor;
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

        data.bottom_type = "gradient";
        data.gradient_start_color = bgColor;
        data.gradient_end_color = gradientEndColor;
        data.gradient_direction = direction;
        data.gradient_strength = gradientStrength;
        data.gradient_theme = gradientTheme;
      } else {
        data.bottom_type = "theme-gradient";
        data.gradient_theme = gradientTheme;
        data.gradient_start_color = bgColor;
        data.gradient_end_color = gradientEndColor;
      }
    }

    if (style === "style3") {
      data.bottom_type = "image";
      data.bottom_image = backgroundImage.id;
    }

    if (yearActive) {
      data.yearColor = yearColor;
      data.yearFontSize = yearFontSize;
      data.yearFontFamily = yearFontFamily;
      data.yearFontWeight = yearFontWeight;
      data.yearPositionX = yearPosition.coords.x;
      data.yearPositionY = yearPosition.coords.y;
      data.yearText = yearText;
    }

    console.log("text", monthTexts);
    console.log("font", fontSettings);
    console.log("img", monthImages);
    console.log("mode", isImageMode);
    console.log("scale", imageScales);

    data.field1 = [];
    data.field2 = [];
    data.field3 = [];

    for (let i = 0; i < months.length; i++) {
      const fieldName = `field${i + 1}`; // field1, field2, field3...

      if (!data[fieldName]) {
        data[fieldName] = []; // upewniamy się, że istnieje
      }

      if (isImageMode[i]) {
        data[fieldName].push({
          image: monthImages[i],
          scale: imageScales[i],
          positionX: positions[i].x,
          positionY: positions[i].y,
        });
      } else {
        data[fieldName].push({
          text: monthTexts[i],
          font: fontSettings[i],
        });
      }
    }

    try {
      const response = axios.post(`${apiUrl}/calendars/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Utworzono kalendarz:", data);
      alert("✅ Kalendarz został zapisany!");
    } catch (error) {
      console.error("❌ Błąd zapisu:", error.response?.data || error.message);
      alert("❌ Nie udało się zapisać kalendarza. Sprawdź dane.");
    }
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);

    let startX, startY;

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    if (yearPosition.coords) {
      startX = clamp(yearPosition.coords.x, xLimits.min, xLimits.max);
      startY = clamp(yearPosition.coords.y, yLimits.min, yLimits.max);
    } else {
      // Zamiana preset na konkretne coords
      const rect = spanRef.current.getBoundingClientRect();
      const parentRect = spanRef.current.parentElement.getBoundingClientRect();

      startX = rect.left - parentRect.left + rect.width / 2;
      startY = rect.top - parentRect.top + rect.height / 2;

      // Ograniczenie wartości do zakresu
      startX = clamp(startX, xLimits.min, xLimits.max);
      startY = clamp(startY, yLimits.min, yLimits.max);

      setYearPosition({ coords: { x: startX, y: startY } });
    }

    dragStartPos.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: startX,
      elemY: startY,
    };
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging) return;

      const deltaX = e.clientX - dragStartPos.current.mouseX;
      const deltaY = e.clientY - dragStartPos.current.mouseY;

      const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

      setYearPosition((prev) => ({
        ...prev,
        coords: {
          x: clamp(
            dragStartPos.current.elemX + deltaX,
            xLimits.min,
            xLimits.max
          ),
          y: clamp(
            dragStartPos.current.elemY + deltaY,
            yLimits.min,
            yLimits.max
          ),
        },
      }));
    };

    const onMouseUp = () => {
      if (dragging) setDragging(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, xLimits, yLimits, setYearPosition]);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    axios
      .get(`${apiUrl}/generate/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setImages(res.data))
      .catch((err) => console.error("Błąd podczas pobierania obrazów:", err));
  }, []);

  const handleImageSelect = (img) => {
    setImage(img);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-14 gap-4 p-4">
      <div className="lg:col-span-3 space-y-4">
        <StyleSidebar
          style={style}
          setStyle={setStyle}
          images={images}
          handleImageSelect={handleImageSelect}
          handleFileUpload={handleFileUpload}
        />
        <div className="border rounded p-4 justify-center items-center flex">
          <button
            onClick={handleSaveCalendar}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm shadow"
          >
            Zapisz kalendarz
          </button>
        </div>
      </div>
      <div className="lg:col-span-3 space-y-4 ">
        {style === "style1" && (
          <ImgColor
            bgColor={bgColor}
            setBgColor={setBgColor}
            image={image}
            extractColorsFromImage={extractColorsFromImage}
          />
        )}
        {/* Opcje dla gradientu */}
        {style === "style2" && (
          <GradientSettings
            image={image}
            extractColorsFromImage={extractColorsFromImage}
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
            images={images}
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
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
      <div className="lg:col-span-3 space-y-4 ">
        {months.map((month, index) => (
          <MonthEditor
            key={month}
            month={month}
            index={index}
            isImageMode={isImageMode[index]}
            toggleImageMode={toggleImageMode}
            fontSettings={fontSettings[index]}
            handleFontSettingChange={handleFontSettingChange}
            monthTexts={monthTexts[index]}
            handleMonthTextChange={handleMonthTextChange}
            monthImages={monthImages[index]}
            handleImageChange={handleImageChange}
            imageScales={imageScales[index]}
            handleImageScaleChange={handleImageScaleChange}
            fontFamilies={fontFamilies}
            fontWeights={fontWeights}
          />
        ))}
      </div>
      <div className="lg:col-span-1" />

      {/* Preview area */}
      <div className="lg:col-span-3">
        <div className="border rounded w-[372px] h-[972px] mx-auto bg-white overflow-hidden shadow">
          {/* Header */}
          <div
            ref={headerRef}
            className="relative h-[252px] bg-gray-200 flex items-center justify-center"
          >
            {image ? (
              <>
                <img
                  src={image.url}
                  alt="Nagłówek"
                  className="w-full h-full object-cover"
                />
                {/* Tekst z rokiem */}
                {yearActive && (
                  <span
                    ref={spanRef}
                    onMouseDown={onMouseDown}
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
            className="h-[720px] px-3 py-4 flex flex-col  items-center text-center"
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
                  <div className="w-full h-[85px] text-sm text-gray-600 flex items-center justify-center">
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
  );
}
