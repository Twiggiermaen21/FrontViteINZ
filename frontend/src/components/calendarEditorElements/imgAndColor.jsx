import React from "react";
import { extractColorsFromImage } from "../../utils/extractColorsFromImage"

const ImgColor = ({ bgColor, setBgColor, image, setGradientEndColor }) => {
  return (
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
          onClick={() => extractColorsFromImage(image.url, setBgColor, setGradientEndColor)}
          className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Dobierz automatycznie kolory z grafiki
        </button>
      )}
    </div>
  );
};

export default ImgColor;
