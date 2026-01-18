import { extractColorsFromImage } from "../../utils/extractColorsFromImage";

const GradientSettings = ({
  image,
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
    <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4 space-y-2">
      <h2 className="text-base font-semibold text-[#d2e4e2]">
        Ustawienia gradientu
      </h2>

      {/* Automatyczne pobieranie kolorów */}
      {image && (
        <button
          onClick={() =>
            extractColorsFromImage(image.url, setBgColor, setGradientEndColor)
          }
          className="w-full px-4 py-2 rounded-lg text-sm font-medium
            bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f]
            hover:opacity-90 transition-colors"
        >
          Dobierz kolory z grafiki
        </button>
      )}

      {/* Kolor początkowy */}
      <div className="flex gap-4">
        <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
          Kolor początkowy
        </label>
        <input
          type="color"
          value={bgColor?? "#ffffff"}
          onChange={(e) => setBgColor(e.target.value)}
          className="w-full h-12 rounded-lg cursor-pointer bg-transparent border border-[#374b4b] hover:border-[#6d8f91] transition-colors"
        />
      

      {/* Kolor końcowy */}
      
        <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
          Kolor końcowy
        </label>
        <input
          type="color"
          value={gradientEndColor?? "#ffffff"}
          onChange={(e) => setGradientEndColor(e.target.value)}
          className="w-full h-12 rounded-lg cursor-pointer bg-transparent border border-[#374b4b] hover:border-[#6d8f91] transition-colors"
        />
      </div>

      {/* Motyw gradientu */}
      <div>
        <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
          Motyw gradientu
        </label>
        <select
          value={gradientTheme}
          onChange={(e) => setGradientTheme(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] transition-colors"
        >
          <option value="classic">Klasyczny (z kolorów)</option>
          <option value="aurora">Aurora</option>
          <option value="liquid">Liquid</option>
          <option value="mesh">Mesh</option>
          <option value="waves">Waves</option>
        </select>
      </div>

      {/* Wariant (tylko dla classic) */}
      {gradientTheme === "classic" && (
        <div>
          <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
            Wariant
          </label>
          <select
            value={gradientVariant}
            onChange={(e) => setGradientVariant(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] transition-colors"
          >
            <option value="diagonal">Diagonalny (↘)</option>
            <option value="vertical">Pionowy (↓)</option>
            <option value="horizontal">Poziomy (→)</option>
            <option value="radial">Radialny (okrągły)</option>
          </select>
        </div>
      )}

      {/* Intensywność */}
      <div>
        <label className="block text-sm font-medium text-[#d2e4e2] mb-1">
          Intensywność przejścia
        </label>
        <select
          value={gradientStrength}
          onChange={(e) => setGradientStrength(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] transition-colors"
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
