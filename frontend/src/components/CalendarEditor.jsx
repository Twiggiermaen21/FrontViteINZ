import { useState, useEffect, useRef } from "react";

import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { FastAverageColor } from "fast-average-color";
import StyleSidebar from "./calendarEditorElements/stylesBar";
import ImgColor from "./calendarEditorElements/imgAndColor";
import GradientSettings from "./calendarEditorElements/imgAndFade";
import BackgroundImg from "./calendarEditorElements/imgAndImg";
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
      <div className="lg:col-span-2 ">
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
      </div>
      <div className="lg:col-span-1"/>


   
      {/* Preview area */}
      <div className="lg:col-span-2">
        <div className="border rounded w-[372px] h-[972px] mx-auto bg-white overflow-hidden shadow">
          {/* Header */}
          <div ref={headerRef} className="h-[252px] bg-gray-200 flex items-center justify-center">
            {image ? (
              <img src={image.url} alt="Nagłówek" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">Brak grafiki nagłówka</span>
            )}
          </div>

          {/* Bottom */}
          <div ref={bottomRef}
            className="h-[720px] px-3 py-4 flex flex-col gap-28 items-center text-center"
            style={getBottomSectionBackground()}
          >
            {["Grudzień", "Styczeń", "Luty"].map((month) => (
              <div
                key={month}
                className="w-full border rounded bg-white shadow p-2 flex flex-col items-center"
              >
                <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide mb-1">
                  {month}
                </h3>
                <div className="w-full h-[85px] text-sm text-gray-600 flex items-center justify-center">
                  [Siatka dni dla {month}]
                </div>
              </div>
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
