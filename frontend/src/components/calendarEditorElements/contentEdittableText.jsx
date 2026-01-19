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
}) => {
  // Bezpieczne pobieranie ustawień dla danego indeksu
  const currentSettings = fontSettings[index] || {};
  
  
  const [ref, fontSize] = useAutoFontSize(
    value, 
    index, 
    setFontSettings, 
    currentSettings // Przekazujemy cały obiekt ustawień dla tego pola
  );

  const handleTextChange = (e) => {
    let val = e.target.value;

    if (val.length > maxChars) {
      val = val.slice(0, maxChars);
    }

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

    if (e.key === "Enter" && lines.length >= 2) {
      e.preventDefault();
    }

    const isControlKey = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
    ].includes(e.key);

    if (!isControlKey && val.length >= maxChars) {
      e.preventDefault();
    }
  };
  
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    const combined = (value + pasted).slice(0, maxChars).split("\n");

    if (combined.length > 2) {
      e.preventDefault();
      const allowed = combined.slice(0, 2).join("\n").slice(0, maxChars);
      onChange(index, allowed);
    }
  };
  
  return (
    <div className="relative w-full my-2">
      <textarea
        ref={ref}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        rows={2}
        maxLength={maxChars}
        // overflow-hidden ukrywa pasek przewijania, bo skrypt i tak dopasuje tekst
        className="w-full h-[60px] resize-none text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-hidden"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: currentSettings.fontFamily,
          fontWeight: currentSettings.fontWeight,
          color: currentSettings.fontColor,
          lineHeight: "1.2",
          padding: 0,
          paddingTop: getPaddingTopFromText(value),
          display: "block",
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default LimitedTextarea;