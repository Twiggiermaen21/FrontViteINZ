import React from "react";
import { extractColorsFromImage } from "../../utils/extractColorsFromImage";

const ImgColor = ({ bgColor, setBgColor, image, setGradientEndColor }) => {
  return (
    <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4">
      <h2 className="text-base font-semibold text-[#d2e4e2] mb-4">
        Kolor tła
      </h2>

      {/* Wybór koloru */}
      <input
        type="color"
        value={bgColor ?? "#ffffff"}
        onChange={(e) => setBgColor(e.target.value)}
        className="w-full h-12 rounded-lg cursor-pointer bg-transparent border border-[#374b4b] hover:border-[#6d8f91] transition-colors"
      />

      {/* Automatyczne dopasowanie kolorów */}
      {image && (
        <button
          onClick={() =>
            extractColorsFromImage(image.url, setBgColor, setGradientEndColor)
          }
          className="mt-4 w-full px-4 py-2 rounded-lg text-sm font-medium
            bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f]
            hover:opacity-90 transition-colors"
        >
          Dobierz automatycznie z grafiki
        </button>
      )}
    </div>
  );
};

export default ImgColor;
