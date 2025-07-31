import { useEffect, useRef, useState } from "react";


function useAutoFontSize(text, minFont = 10, maxFont = 30) {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(maxFont);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parentWidth = el.offsetWidth;
    const parentHeight = el.offsetHeight;

    let newFontSize = maxFont;

    const testFont = (size) => {
      el.style.fontSize = `${size}px`;
      return el.scrollHeight <= parentHeight && el.scrollWidth <= parentWidth;
    };

    while (newFontSize > minFont && !testFont(newFontSize)) {
      newFontSize--;
    }

    setFontSize(newFontSize);
  }, [text, minFont, maxFont]);

  return [ref, fontSize];
}

export default useAutoFontSize;
