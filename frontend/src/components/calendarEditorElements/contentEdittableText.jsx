import useAutoFontSize from "../../utils/autoFontSize";
import { getPaddingTopFromText } from "../../utils/textPadding";

const LimitedTextarea = ({
  value,
  setFontSettings,
  fontSettings,
  onChange,
  placeholder = "",
  index = 0,
  maxChars = 1000,
  scale = 1, // NOWOŚĆ: Parametr skali (dla wersji print będzie to ok. 12.5)
}) => {
  const currentSettings = fontSettings[index] || {};

  // Zakładam, że useAutoFontSize dostosowuje się do szerokości kontenera.
  // Jeśli hook ma sztywne limity (np. max 40px), trzeba będzie zajrzeć też do niego.
  const [ref, fontSize] = useAutoFontSize(
    value,
    index,
    setFontSettings,
    currentSettings
  );

  const handleTextChange = (e) => {
    let val = e.target.value;
    if (val.length > maxChars) val = val.slice(0, maxChars);

    const lines = val.split("\n");
    if (lines.length <= 2) {
      onChange(index, val);
    } else {
      const trimmed = lines.slice(0, 2).join("\n");
      onChange(index, trimmed);
    }
  };

  const handleKeyDown = (e) => {
    const val = e.currentTarget.value;
    const lines = val.split("\n");
    if (e.key === "Enter" && lines.length >= 2) e.preventDefault();
    
    const isControlKey = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
    ].includes(e.key);

    if (!isControlKey && val.length >= maxChars) e.preventDefault();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const combined = (value + pasted).slice(0, maxChars).split("\n");
    const allowed = combined.slice(0, 2).join("\n").slice(0, maxChars);
    onChange(index, allowed);
  };

  // Obliczamy padding i skalujemy go
  const basePadding = getPaddingTopFromText(value);
  const scaledPadding = basePadding * scale;

  return (
    // ZMIANA: Usunięto sztywne my-2, teraz div wypełnia rodzica (h-full)
    <div className="relative w-full h-full flex flex-col justify-center">
      <textarea
        ref={ref}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        rows={2}
        maxLength={maxChars}
        placeholder={placeholder}
        // ZMIANA: 
        // 1. h-full zamiast h-[65px]
        // 2. focus:ring powiększony (np. ring-[20px]), żeby był widoczny przy zoom 0.08
        //    (można użyć stylu inline dla ring, jeśli Tailwind nie łapie dynamicznych wartości)
        className="w-full h-full resize-none text-center bg-transparent focus:outline-none overflow-hidden"
        style={{
          // Jeśli fontSize z hooka jest mały, tu można go przemnożyć: 
          // fontSize: `${fontSize * scale}px`, (zależnie jak działa Twój hook)
          fontSize: `${fontSize}px`, 
          fontFamily: currentSettings.fontFamily,
          fontWeight: currentSettings.fontWeight,
          color: currentSettings.fontColor,
          // lineHeight: "1.2",
          padding: 0,
          paddingTop: `${scaledPadding}px`, // Zastosowanie skali do paddingu
          display: "block",
          outline: "none" // Reset domyślnego
        }}
        // Opcjonalnie: Grubszy border przy focusie za pomocą stylów inline, 
        // bo Tailwindowe ring-2 zniknie przy zoomie
        onFocus={(e) => e.target.style.outline = `${2 * scale}px solid #60a5fa`}
        onBlur={(e) => e.target.style.outline = "none"}
      />
    </div>
  );
};

export default LimitedTextarea;