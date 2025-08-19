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
import { getYearPositionStyles } from '../utils/getYearPositionStyles';

const fontFamilies = ["Arial", "Courier New", "Georgia", "Tahoma", "Verdana", "Roboto"];
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
  const [yearPosition, setYearPosition] = useState({ preset: "center", coords: null });
  const [monthTexts, setMonthTexts] = useState(["", "", ""]);
  const months = ["Grudzień", "Styczeń", "Luty"];
  const [fontSettings, setFontSettings] = useState(months.map(() => ({ fontFamily: "Arial", fontWeight: "400", fontColor: "#333333", })));
  const [monthImages, setMonthImages] = useState(Array(months.length).fill(null));
  const [isImageMode, setIsImageMode] = useState(() => months.map(() => false));
  const [imageScales, setImageScales] = useState(() => months.map(() => 1));
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
            const r = Math.min(255, Math.max(0, ((num >> 16) + percent))).toString(16).padStart(2, "0");
            const g = Math.min(255, Math.max(0, (((num >> 8) & 0x00FF) + percent))).toString(16).padStart(2, "0");
            const b = Math.min(255, Math.max(0, ((num & 0x0000FF) + percent))).toString(16).padStart(2, "0");
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

    const topImageId = image.id
    let bottomImageId = null;
    if (backgroundImage !== null) {
      bottomImageId = backgroundImage.id
    }


    let data = {
      top_image: topImageId,
      bottom_type: "",
      bottom_color: null,
      gradient_start_color: bgColor,
      gradient_end_color: gradientEndColor,
      gradient_direction: null,
      gradient_theme: null,
      bottom_image: bottomImageId,
    };

    if (style === "style1") {
      data.bottom_type = "color";
      data.bottom_color = bgColor;
    }

    if (style === "style2") {
      if (gradientTheme === "classic") {
        const direction = {
          diagonal: "to bottom right",
          vertical: "to bottom",
          horizontal: "to right",
          radial: "radial",
        }[gradientVariant] || "to bottom";

        data.bottom_type = "gradient";
        data.gradient_start_color = bgColor;
        data.gradient_end_color = gradientEndColor;
        data.gradient_direction = direction;
      } else {
        data.bottom_type = "theme-gradient";
        data.gradient_theme = gradientTheme;
      }
    }

    if (style === "style3") {
      data.bottom_type = "image";
      data.bottom_image = bottomImageId;
    }

    if (yearActive) {
      data.yearColor = yearColor;
      data.yearFontSize = yearFontSize;
      data.yearFontFamily = yearFontFamily;
      data.yearFontWeight = yearFontWeight;
      data.yearPosition = yearPosition;
      data.yearText = yearText;
    }

    

    try {
      // const response = axios.post(`${apiUrl}/calendars/`, data, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

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

    if (yearPosition.coords) {
      startX = yearPosition.coords.x;
      startY = yearPosition.coords.y;
    } else {
      // Zamiana preset na konkretne coords
      const rect = spanRef.current.getBoundingClientRect();
      const parentRect = spanRef.current.parentElement.getBoundingClientRect();

      startX = rect.left - parentRect.left + rect.width / 2;
      startY = rect.top - parentRect.top + rect.height / 2;

      setYearPosition({ preset: null, coords: { x: startX, y: startY } });
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

      setYearPosition({
        preset: null,
        coords: {
          x: dragStartPos.current.elemX + deltaX,
          y: dragStartPos.current.elemY + deltaY,
        },
      });
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
  }, [dragging]);


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

  const getBottomSectionBackground = () => {
    if (style === "style1") {
      return { background: bgColor };
    }

    if (style === "style2") {
      if (gradientTheme !== "classic") {
        // Predefiniowane stylizacje
        const themes = {
          aurora: {
            background: `radial-gradient(circle at 30% 30%, ${bgColor}, ${gradientEndColor}, ${bgColor})`,
            color: "white",
          },
          liquid: {
            background: `linear-gradient(135deg, ${bgColor} 0%, ${gradientEndColor} 100%)`,
            color: "white",
          },
          mesh: {
            background: `linear-gradient(120deg, ${bgColor} 0%, ${gradientEndColor} 100%)`,
            color: "white",
          },
          waves: {
            background: `repeating-linear-gradient(135deg, ${bgColor}, ${gradientEndColor} 20%, ${bgColor} 40%)`,
            color: "white",
          },
        };

        return themes[gradientTheme] || { background: bgColor };
      }

      // klasyczny gradient
      let blendMap = {
        soft: "66",
        medium: "99",
        hard: "cc",
      };

      const alphaHex = blendMap[gradientStrength] || "99";
      const blendedEnd = gradientEndColor + alphaHex;

      let gradientStyle;
      switch (gradientVariant) {
        case "vertical":
          gradientStyle = `linear-gradient(to bottom, ${bgColor}, ${blendedEnd})`;
          break;
        case "horizontal":
          gradientStyle = `linear-gradient(to right, ${bgColor}, ${blendedEnd})`;
          break;
        case "radial":
          gradientStyle = `radial-gradient(circle, ${bgColor}, ${blendedEnd})`;
          break;
        case "diagonal":
        default:
          gradientStyle = `linear-gradient(to bottom right, ${bgColor}, ${blendedEnd})`;
          break;
      }

      return { background: gradientStyle };
    }


    if (style === "style3" && backgroundImage) {
      return {
        background: `url(${backgroundImage.url}) center/cover no-repeat`,
        color: "white",
      };
    }

    return { background: "#ffffff" };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-4 p-4">
      {/* Sidebar options */}
      <StyleSidebar
        style={style}
        setStyle={setStyle}
        images={images}
        handleImageSelect={handleImageSelect}
        handleFileUpload={handleFileUpload}
      />
      <div className="lg:col-span-2 space-y-4 ">
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
        />
        <div className="mt-4 space-y-3">
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
      </div>
      <div className="lg:col-span-1" />



      {/* Preview area */}
      <div className="lg:col-span-2">
        <div className="border rounded w-[372px] h-[972px] mx-auto bg-white overflow-hidden shadow">
          {/* Header */}
          <div ref={headerRef} className="relative h-[252px] bg-gray-200 flex items-center justify-center">
            {image ? (
              <>
                <img src={image.url} alt="Nagłówek" className="w-full h-full object-cover" />
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
          <div ref={bottomRef}
            className="h-[720px] px-3 py-4 flex flex-col  items-center text-center"
            style={getBottomSectionBackground()}
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
      <div className="text-center mt-4">
        <button
          onClick={handleSaveCalendar}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm shadow"
        >
          Zapisz kalendarz
        </button>
      </div>
    </div>
  );
}
