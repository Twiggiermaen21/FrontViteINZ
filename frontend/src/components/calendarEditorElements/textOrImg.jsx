import React from "react";
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
  monthImages,
  imageScales,
  fontFamilies,
  fontWeights,
  setIsImageMode,
  setImageScales,
  setMonthImages,
  setFontSettings,
 
}) => {
  return (
    <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4  space-y-4">
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

      {/* Tryb tekst/obraz */}

      {!isImageMode ? (
        <>
          {/* Tekstowy tryb — czcionka, kolor, tekst */}
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

          <div>
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

          <div>
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
        </>
      ) : (
        <>
          {/* Tryb obraz */}
          <h3 className="text-base font-semibold text-[#d2e4e2] mb-2">
            Wgraj własną grafikę
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(index, e, setMonthImages, setImageScales)
            }
            className="block w-full text-sm rounded-lg bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] cursor-pointer 
              file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium 
              file:bg-gradient-to-r file:from-[#6d8f91] file:to-[#afe5e6] file:text-[#1e1f1f] hover:file:opacity-90 mb-2"
          />

          {/* Pasek do skalowania */}
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.01"
            value={imageScales}
            onChange={(e) =>
              handleImageScaleChange(index, e.target.value, setImageScales)
            }
            className="w-full mt-2 accent-[#6d8f91]"
          />
        </>
      )}
    </div>
  );
};

export default MonthEditor;
