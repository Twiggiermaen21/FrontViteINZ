import { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { FastAverageColor } from "fast-average-color";
import StyleSidebar from "./calendarEditorElements/stylesBar";
import ImgColor from "./calendarEditorElements/imgAndColor";
import GradientSettings from "./calendarEditorElements/imgAndFade";
import BackgroundImg from "./calendarEditorElements/imgAndImg";
import YearText from "./calendarEditorElements/yearText";

function useAutoFontSize(text, maxFontSize = 30, minFontSize = 12) {
  const [fontSize, setFontSize] = useState(maxFontSize);
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const lineCount = (text.match(/\n/g) || []).length + 1;
    const length = text.length;

    let calculatedFontSize = maxFontSize;

    if (lineCount > 1 || length > 40) {
      calculatedFontSize = Math.max(minFontSize, maxFontSize - lineCount * 2 - Math.floor(length / 50));
    }

    setFontSize(calculatedFontSize);
  }, [text, maxFontSize, minFontSize]);

  return [ref, fontSize];
}


export default function CalendarEditor() {
  const [style, setStyle] = useState("style1");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [gradientVariant, setGradientVariant] = useState("diagonal");
  const [gradientEndColor, setGradientEndColor] = useState("#ffffff");
  const [gradientStrength, setGradientStrength] = useState("medium"); // 'soft', 'medium', 'hard'
  const [gradientTheme, setGradientTheme] = useState("classic");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const headerRef = useRef();
  const bottomRef = useRef();
  const apiUrl = `${import.meta.env.VITE_API_URL}/api`;
  const [yearText, setYearText] = useState("2025");
  const [yearColor, setYearColor] = useState("#ffffff");
  const [yearFontSize, setYearFontSize] = useState(32);
  const [yearPosition, setYearPosition] = useState({
    preset: "center",
    coords: null, // null oznacza, że używamy preset
  });
  const [monthTexts, setMonthTexts] = useState(["", "", ""]);
  const months = ["Grudzień", "Styczeń", "Luty"];

  const [yearFontWeight, setYearFontWeight] = useState("bold");
  const [yearFontFamily, setYearFontFamily] = useState("Arial");
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
  function getYearPositionStyles(position) {
    if (position.coords) {
      return {
        left: position.coords.x,
        top: position.coords.y,
        transform: "translate(-50%, -50%)",
      };
    }

    switch (position.preset) {
      case "top-left":
        return { top: "10px", left: "10px" };
      case "top-center":
        return { top: "10px", left: "50%", transform: "translateX(-50%)" };
      case "top-right":
        return { top: "10px", right: "10px" };
      case "center-left":
        return { top: "50%", left: "10px", transform: "translateY(-50%)" };
      case "center":
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
      case "center-right":
        return { top: "50%", right: "10px", transform: "translateY(-50%)" };
      case "bottom-left":
        return { bottom: "10px", left: "10px" };
      case "bottom-center":
        return { bottom: "10px", left: "50%", transform: "translateX(-50%)" };
      case "bottom-right":
        return { bottom: "10px", right: "10px" };
      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  }
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });
  const spanRef = useRef(null);

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
        />
        <div className="mt-4 space-y-3">
          {months.map((month, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">
                Tekst pod miesiącem {month}
              </label>
              <input
                type="text"
                value={monthTexts[index]}
                onChange={(e) => handleMonthTextChange(index, e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder={`Tekst pod ${month}`}
              />
            </div>
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
                <div>
                {(() => {
                  const [ref, fontSize] = useAutoFontSize(monthTexts[index]);

                  return (
                    <textarea
                      ref={ref}
                      value={monthTexts[index]}
                      onChange={(e) => {
                        const val = e.target.value;
                        const lines = val.split("\n");

                        // Pozwól maksymalnie 2 linie
                        if (lines.length <= 2) {
                          handleMonthTextChange(index, val);
                        } else {
                          // Jeśli użytkownik próbuje wpisać 3+ linię - ignoruj zmianę
                          // (możesz też np. wyświetlić alert lub inny feedback)
                        }
                      }}
                      rows={2} // wymuszamy 2 linie
                      className="w-full h-[60px] resize-none italic text-center text-gray-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                      style={{
                        fontSize: `${fontSize}px`,
                        lineHeight: "1.2",
                        overflow: "hidden", // ukrywa scroll
                        paddingTop: "1px",
                        paddingBottom: "16px",
                      }}
                      placeholder="Wpisz tekst pod miesiącem..."
                    />
                  );
                })()}
                </div>
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
