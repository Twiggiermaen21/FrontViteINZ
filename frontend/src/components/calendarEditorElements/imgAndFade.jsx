import React from "react";

const GradientSettings = ({
  image,
  extractColorsFromImage,
  bgColor,
  setBgColor,
  gradientEndColor,
  setGradientEndColor,
  gradientVariant,
  setGradientVariant,
  gradientTheme,
  setGradientTheme,
  gradientStrength,
  setGradientStrength,
}) => {
  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Ustawienia gradientu</h2>

      {image && (
        <button
          onClick={() => extractColorsFromImage(image.url)}
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

      <div>
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
  );
};

export default GradientSettings;
