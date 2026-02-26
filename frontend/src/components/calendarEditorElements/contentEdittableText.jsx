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
  scale = 1, 
}) => {
  const currentSettings = fontSettings[index] || {};
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

  const basePadding = getPaddingTopFromText(value);
  const scaledPadding = basePadding * scale;

  return (
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
        className="w-full h-full resize-none text-center bg-transparent focus:outline-none overflow-hidden"
        style={{
          fontSize: `${fontSize}px`, 
          fontFamily: currentSettings.fontFamily,
          fontWeight: currentSettings.fontWeight,
          color: currentSettings.fontColor,
          padding: 0,
          paddingTop: `${scaledPadding}px`, 
          display: "block",
          outline: "none" 
        }}
        onFocus={(e) => e.target.style.outline = `${2 * scale}px solid #60a5fa`}
        onBlur={(e) => e.target.style.outline = "none"}
      />
    </div>
  );
};

export default LimitedTextarea;