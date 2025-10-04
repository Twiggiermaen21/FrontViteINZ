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
  monthTexts,
  handleMonthTextChange,
  monthImages,
  imageScales,
  fontFamilies,
  fontWeights,
  setIsImageMode,
  setImageScales,
  setMonthImages,
  setFontSettings,
  setMonthTexts,
}) => {
  return (
    <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4 sm:m-4 space-y-4">
      <h3 className="text-base font-semibold text-[#d2e4e2]">{month}</h3>

      {/* Tryb tekst/obraz */}
      <label className="flex items-center gap-2 cursor-pointer text-[#d2e4e2]">
        <input
          type="checkbox"
          checked={isImageMode}
          onChange={() => toggleImageMode(index, setIsImageMode)}
          className="h-5 w-5 text-[#6d8f91] border-[#374b4b] rounded focus:ring-[#6d8f91]"
        />
        <span>{isImageMode ? "Tryb: Zdjęcie" : "Tryb: Tekst"}</span>
      </label>

      {!isImageMode ? (
        <>
          {/* Czcionka */}
          <div>
            <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
              Rodzaj czcionki
            </label>
            <select
              className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91]"
              value={fontSettings.fontFamily}
              onChange={(e) =>
                handleMonthTextChange(
                  index,
                  e.target.value,
                  monthTexts,
                  setMonthTexts
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

          {/* Grubość czcionki */}
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

          {/* Kolor tekstu */}
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

          {/* Tekst miesiąca */}
          <textarea
            className="w-full rounded-lg p-2 bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b]"
            value={monthTexts[index]}
            onChange={(e) => handleMonthTextChange(index, e.target.value)}
            rows={1}
            maxLength={1000}
            placeholder="Wpisz tekst..."
            style={{
              fontFamily: fontSettings.fontFamily,
              fontWeight: fontSettings.fontWeight,
              color: fontSettings.fontColor,
            }}
          />
        </>
      ) : (
        <>
          {/* Wybór obrazu */}
          <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
            Wybierz zdjęcie
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(index, e, setMonthImages, setImageScales)
            }
            className="w-full rounded-lg text-sm cursor-pointer border border-[#374b4b] hover:border-[#6d8f91] mb-2"
          />

          {/* Podgląd obrazu */}
          {monthImages[index] && (
            <div className="border rounded overflow-hidden relative w-full h-20">
              <img
                src={URL.createObjectURL(monthImages[index])}
                alt={`Zdjęcie ${month}`}
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{
                  transform: `scale(${imageScales[index] || 1})`,
                  transition: "transform 0.2s",
                }}
              />
            </div>
          )}

          {/* Skalowanie */}
          {monthImages[index] && (
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.01"
              value={imageScales[index] || 1}
              onChange={(e) =>
                handleImageScaleChange(index, e.target.value, setImageScales)
              }
              className="w-full mt-2 accent-[#6d8f91]"
            />
          )}
        </>
      )}
    </div>
  );
};

export default MonthEditor;
