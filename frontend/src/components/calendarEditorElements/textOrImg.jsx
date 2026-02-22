import React, { useRef } from "react";
import {
  toggleImageMode,
  handleImageChange,
  handleImageScaleChange,
  handleFontSettingChange,
} from "../../utils/monthHandlers";

const MonthEditor = ({
  month,
  index,
  isImageMode,
  fontSettings,
  monthImages, // To jest pojedynczy obrazek dla tego miesiąca (z propsów rodzica)
  imageScales,
  fontFamilies,
  fontWeights,
  setIsImageMode,
  setImageScales,
  setMonthImages,
  setFontSettings,
}) => {
  const fileInputRef = useRef(null);

  // Funkcja usuwająca obrazek i resetująca input
  const handleRemoveImage = () => {
    // 1. Reset w stanie (tablica obrazów)
    setMonthImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });

    // 2. Reset skali
    setImageScales((prev) => {
      const newScales = [...prev];
      newScales[index] = 1;
      return newScales;
    });

    // 3. Reset inputu pliku (żeby można było wybrać ten sam plik ponownie)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4 space-y-4">
      <h3 className="flex items-center gap-3 text-base font-semibold mb-2 text-[#d2e4e2]">
        <div
          onClick={() => toggleImageMode(index, setIsImageMode)}
          className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
            isImageMode ? "bg-[#6d8f91]" : "bg-[#374b4b]"
          }`}
        >
          <div
            className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-[10px] font-bold text-[#374b4b] ${
              isImageMode ? "translate-x-6" : "translate-x-[2px]"
            }`}
          >
            {isImageMode ? "🖼️" : "T"}
          </div>
        </div>

        <span className="text-lg font-bold tracking-wide">{month}</span>
      </h3>

      {/* Logic for content based on mode */}
      {!isImageMode ? (
        <>
          {/* --- TRYB TEKSTOWY --- */}
          <div>
            <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
              Rodzaj czcionki
            </label>
            <select
              className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91]"
              value={fontSettings.fontFamily}
              onChange={(e) =>
                handleFontSettingChange(
                  index,
                  "fontFamily",
                  e.target.value,
                  fontSettings,
                  setFontSettings
                )
              }
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
                Grubość czcionki
              </label>
              <select
                className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91]"
                value={fontSettings.fontWeight}
                onChange={(e) =>
                  handleFontSettingChange(
                    index,
                    "fontWeight",
                    e.target.value,
                    fontSettings,
                    setFontSettings
                  )
                }
              >
                {fontWeights.map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
                Kolor tekstu
              </label>
              <input
                type="color"
                value={fontSettings.fontColor}
                onChange={(e) =>
                  handleFontSettingChange(
                    index,
                    "fontColor",
                    e.target.value,
                    fontSettings,
                    setFontSettings
                  )
                }
                className="w-full h-10 rounded-lg cursor-pointer border border-[#374b4b] hover:border-[#6d8f91]"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* --- TRYB OBRAZKOWY --- */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold text-[#d2e4e2]">
              Wgraj własną grafikę
            </h3>
            
            {/* PRZYCISK USUWANIA (X) */}
            {/* Wyświetla się tylko, gdy istnieje obrazek (monthImages nie jest null) */}
            {monthImages && (
              <button
                onClick={handleRemoveImage}
                title="Usuń grafikę"
                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef} // Dodany ref do resetowania
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(index, e, setMonthImages, setImageScales)
            }
            className="block w-full text-sm rounded-lg bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] cursor-pointer 
              file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium 
              file:bg-gradient-to-r file:from-[#6d8f91] file:to-[#afe5e6] file:text-[#1e1f1f] hover:file:opacity-90 mb-2"
          />

          {/* Pasek do skalowania - pokazujemy tylko gdy jest obrazek */}
          {monthImages && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Skala</span>
                <span>{(imageScales || 1).toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.01"
                value={imageScales || 1}
                onChange={(e) =>
                  handleImageScaleChange(index, e.target.value, setImageScales)
                }
                className="w-full accent-[#6d8f91]"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MonthEditor;