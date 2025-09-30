import { FastAverageColor } from "fast-average-color";

export const extractColorsFromImage = async (imgUrl, setBgColor, setGradientEndColor) => {
  const fac = new FastAverageColor();
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imgUrl;

  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        const color = await fac.getColorAsync(img);
        const hex = color.hex;

        // Funkcja pomocnicza do rozjaśniania/przyciemniania
        const adjustBrightness = (hex, percent) => {
          const num = parseInt(hex.slice(1), 16);
          const r = Math.min(255, Math.max(0, (num >> 16) + percent))
            .toString(16)
            .padStart(2, "0");
          const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent))
            .toString(16)
            .padStart(2, "0");
          const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent))
            .toString(16)
            .padStart(2, "0");
          return `#${r}${g}${b}`;
        };

        const secondary = adjustBrightness(hex, -40);

        setBgColor(hex);
        setGradientEndColor(secondary);

        resolve({ primary: hex, secondary });
      } catch (err) {
        console.error("Błąd przy pobieraniu koloru:", err);
        reject(err);
      }
    };
    img.onerror = reject;
  });
};
