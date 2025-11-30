
import useAutoFontSize from "../../utils/autoFontSize";
import { getPaddingTopFromText } from "../../utils/textPadding";
const LimitedTextarea = ({
  value,
  onChange,
  placeholder = "",
  index = 0,
  maxChars = 1000,
  fontFamily = "inherit",    // np. 'Arial', 'Courier New', 'Roboto'
  fontWeight = "normal",     // np. 'bold', '300', '500'
  fontColor = "#333333",     // dowolny kolor CSS (hex, rgb, nazwany)
}) => {
  const [ref, fontSize] = useAutoFontSize(value);

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
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
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
    <div className="relative w-full " style={{ aspectRatio: ' 11.8 / 1.2' }}>
      <textarea
        ref={ref}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        rows={2}
        maxLength={maxChars}
        className="w-full h-[60px] resize-none italic text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          color: fontColor,
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
