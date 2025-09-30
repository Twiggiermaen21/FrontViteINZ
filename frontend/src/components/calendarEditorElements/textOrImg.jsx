import React from "react";
import {
  toggleImageMode,
  handleImageChange,
  handleImageScaleChange,
  handleMonthTextChange,
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
  setMonthTexts
}) => {
  return (
    <div key={month} className="border p-4 rounded shadow">
      <h3 className="font-bold mb-2">{month}</h3>

      <label className="inline-flex items-center space-x-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={isImageMode}
          onChange={() => toggleImageMode(index, setIsImageMode)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <span>{isImageMode ? "Tryb: Zdjęcie" : "Tryb: Tekst"}</span>
      </label>

      {!isImageMode ? (
        <>
          <div className="mb-2">
            <label className="block text-gray-700">Rodzaj czcionki</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={fontSettings.fontFamily}
              onChange={(e) =>
                handleMonthTextChange(index, e.target.value, monthTexts, setMonthTexts)
              }
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Grubość</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={fontSettings.fontWeight}
              onChange={(e) =>
  handleFontSettingChange(index, "fontWeight", e.target.value, fontSettings, setFontSettings)
}
            >
              {fontWeights.map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <label className="text-gray-700 block">Kolor tekstu</label>
            <input
              type="color"
              value={fontSettings.fontColor}
              onChange={(e) =>
  handleFontSettingChange(index, "fontColor", e.target.value, fontSettings, setFontSettings)
}
              className=" p-0 border rounded bg-gray-100 cursor-pointer"
            />
          </div>

          <textarea
            className="w-full border rounded p-2"
            value={monthTexts}
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
        <div>
          <label className="block mb-2 text-gray-700">Wybierz zdjęcie</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(index, e, setMonthImages, setImageScales)
            }
            className="mb-2"
          />

          {monthImages && (
            <div
              className="border rounded overflow-hidden relative"
              style={{ width: 300, height: 85 }}
            >
              <img
                src={URL.createObjectURL(monthImages)}
                alt={`Zdjęcie ${month}`}
                style={{
                  width: "100%",
                  height: "auto",
                  transform: `scale(${imageScales || 1})`,
                  transition: "transform 0.2s",
                  userSelect: "none",
                }}
                draggable={false}
              />
            </div>
          )}

          {monthImages && (
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.01"
              value={imageScales || 1}
              onChange={(e) =>
                handleImageScaleChange(index, e.target.value, setImageScales)
              }
              className="w-full mt-2"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MonthEditor;
