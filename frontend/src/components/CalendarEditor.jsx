import { useState, useEffect,useRef } from "react";

import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { FastAverageColor } from "fast-average-color";
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
  if (style === "style1" || style === "style2") {
    if (!image) {
      alert("Brakuje grafiki nagłówka.");
      return;
    }

    // wygeneruj CSS tła na podstawie stylu
    let backgroundCss = "";

    if (style === "style1") {
      backgroundCss = `background-color: ${bgColor};`;
    }

    if (style === "style2") {
      if (gradientTheme === "classic") {
        const direction = {
          diagonal: "to bottom right",
          vertical: "to bottom",
          horizontal: "to right",
          radial: "radial",
        }[gradientVariant] || "to bottom";

        const strengthMap = {
          soft: "60%",
          medium: "40%",
          hard: "20%",
        };

        const strength = strengthMap[gradientStrength] || "40%";

        if (gradientVariant === "radial") {
          backgroundCss = `background: radial-gradient(circle, ${bgColor} ${strength}, ${gradientEndColor});`;
        } else {
          backgroundCss = `background: linear-gradient(${direction}, ${bgColor} ${strength}, ${gradientEndColor});`;
        }
      } else {
        backgroundCss = `background: var(--gradient-${gradientTheme}); /* specjalny motyw */`;
      }
    }

    alert(`🔗 Link do nagłówka:\n${image}\n\n🎨 CSS dla tła:\n${backgroundCss}`);
    console.log("Nagłówek:", image);
    console.log("Tło (CSS):", backgroundCss);
  }

  if (style === "style3") {
    if (!image || !backgroundImage) {
      alert("Brakuje obrazów do eksportu");
      return;
    }

    alert(`🔗 Linki do obrazów:\nNagłówek: ${image}\nTło: ${backgroundImage}`);
    console.log("Obrazy kalendarza:", { naglowek: image, tlo: backgroundImage });
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

  const handleImageSelect = (imgUrl) => {
    setImage(imgUrl);
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
        background: `url(${backgroundImage}) center/cover no-repeat`,
        color: "white",
      };
    }

    return { background: "#ffffff" };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-4 p-4">
      {/* Sidebar options */}
      <div className="lg:col-span-2 space-y-4 ">

        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-4">Styl kalendarza</h2>
          <div className="space-y-2">
            <button
              className={`w-full px-4 py-2 border rounded ${style === "style1" ? "bg-black text-white" : "bg-white text-black"
                }`}
              onClick={() => setStyle("style1")}
            >
              Grafika + kolor
            </button>
            <button
              className={`w-full px-4 py-2 border rounded ${style === "style2" ? "bg-black text-white" : "bg-white text-black"
                }`}
              onClick={() => setStyle("style2")}
            >
              Rozciągnięty gradient
            </button>
            <button
              className={`w-full px-4 py-2 border rounded ${style === "style3" ? "bg-black text-white" : "bg-white text-black"
                }`}
              onClick={() => setStyle("style3")}
            >
              Grafika na całym tle
            </button>
          </div>
        </div>

        {/* Opcje dla stylu 1: kolor + grafika */}

        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Galeria grafik</h2>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {images.map((img) => (
              <img
                key={img.id || img.url}
                src={img.url}
                alt="Grafika AI"
                className="cursor-pointer object-cover h-20 w-full border rounded hover:opacity-70"
                onClick={() => handleImageSelect(img.url)}
              />
            ))}
          </div>
        </div>

        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Wgraj własną grafikę</h2>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded"
          />
        </div>

      </div>

      <div className="lg:col-span-2 ">

        {style === "style1" && (
          <>
            <div className="border rounded p-4">
              <h2 className="text-lg font-semibold mb-2">Kolor tła</h2>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 border rounded"
              />
              {image && (
                <button
                  onClick={() => extractColorsFromImage(image)}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Dobierz automatycznie kolory z grafiki
                </button>
              )}
            </div>
          </>
        )}
        {/* Opcje dla gradientu */}
        {style === "style2" && (
          <div className="border rounded p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Ustawienia gradientu</h2>
            {image && (
              <button
                onClick={() => extractColorsFromImage(image)}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Dobierz automatycznie kolory z grafiki
              </button>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Kolor początkowy</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kolor końcowy</label>
              <input
                type="color"
                value={gradientEndColor}
                onChange={(e) => setGradientEndColor(e.target.value)}
                className="w-full h-10 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Wariant</label>
              <select
                value={gradientVariant}
                onChange={(e) => setGradientVariant(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="diagonal">Diagonalny (↘)</option>
                <option value="vertical">Pionowy (↓)</option>
                <option value="horizontal">Poziomy (→)</option>
                <option value="radial">Radialny (okrągły)</option>
              </select>
            </div>

            <div >
              <label className="block text-sm font-medium text-gray-700">Motyw gradientu</label>
              <select
                value={gradientTheme}
                onChange={(e) => setGradientTheme(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="classic">Klasyczny (z kolorów)</option>
                <option value="aurora">Aurora</option>
                <option value="liquid">Liquid</option>
                <option value="mesh">Mesh</option>
                <option value="waves">Waves</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Intensywność przejścia</label>
              <select
                value={gradientStrength}
                onChange={(e) => setGradientStrength(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="soft">Miękki</option>
                <option value="medium">Średni</option>
                <option value="hard">Mocny</option>
              </select>
            </div>
          </div>
        )}

        {/* Opcje dla stylu 3: tylko grafika */}
        {style === "style3" && (
          <div className="border rounded p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Tło kalendarza</h2>

            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {images.map((img) => (
                <img
                  key={img.id || img.url}
                  src={img.url}
                  alt="Grafika tła"
                  className={`cursor-pointer object-cover h-20 w-full border rounded ${backgroundImage === img.url ? "ring-2 ring-blue-500" : ""
                    }`}
                  onClick={() => setBackgroundImage(img.url)}
                />
              ))}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mt-2 mb-1">Wgraj własną grafikę tła</h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setBackgroundImage(URL.createObjectURL(file));
                  }
                }}
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}

      </div>
      <div className="lg:col-span-1 ">


      </div>
      {/* Preview area */}
      <div className="lg:col-span-2">
        <div className="border rounded w-[372px] h-[972px] mx-auto bg-white overflow-hidden shadow">
          {/* Header */}
          <div ref={headerRef} className="h-[252px] bg-gray-200 flex items-center justify-center">
            {image ? (
              <img src={image} alt="Nagłówek" className="w-full h-full object-cover" />
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
