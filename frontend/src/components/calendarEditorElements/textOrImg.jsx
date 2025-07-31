import React from "react";

const MonthEditor = ({
  month,
  index,
  isImageMode,
  toggleImageMode,
  fontSettings,
  handleFontSettingChange,
  monthTexts,
  handleMonthTextChange,
  monthImages,
  handleImageChange,
  imageScales,
  handleImageScaleChange,
  fontFamilies,
  fontWeights,
}) => {
  return (
    <div key={month} className="mt-2 border p-4 rounded shadow">
      <h3 className="font-bold mb-2">{month}</h3>

      <label className="inline-flex items-center space-x-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={isImageMode}
          onChange={() => toggleImageMode(index)}
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
                handleFontSettingChange(index, "fontFamily", e.target.value)
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
                handleFontSettingChange(index, "fontWeight", e.target.value)
              }
            >
              {fontWeights.map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Kolor tekstu</label>
            <input
              type="color"
              className="h-[36px] w-[50px] p-0 border rounded"
              value={fontSettings.fontColor}
              onChange={(e) =>
                handleFontSettingChange(index, "fontColor", e.target.value)
              }
            />
          </div>

          <textarea
            className="w-full border rounded p-2"
            value={monthTexts}
            onChange={(e) => handleMonthTextChange(index, e.target.value)}
            rows={3}
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
            onChange={(e) => handleImageChange(index, e)}
            className="mb-2"
          />

          {monthImages && (
            <div
              className="border rounded overflow-hidden relative"
              style={{ width: 300, height: 85 }}
            >
              <img
                src={monthImages}
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
              onChange={(e) => handleImageScaleChange(index, e.target.value)}
              className="w-full mt-2"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MonthEditor;
