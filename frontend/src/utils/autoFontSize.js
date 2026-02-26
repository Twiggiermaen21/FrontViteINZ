import { useEffect, useRef } from "react";

function useAutoFontSize(text, index, setFontSettings, currentFontSettings, minFont = 100, maxFont = 450) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const currentSize = currentFontSettings?.fontSize || maxFont;
    let newFontSize = maxFont;

    const checkFits = (size) => {
      el.style.fontSize = `${size}px`;
    
      const fitsVertical = el.scrollHeight <= el.clientHeight + 2;
      const fitsHorizontal = el.scrollWidth <= el.clientWidth + 2;

      return fitsVertical && fitsHorizontal;
    };

    while (newFontSize > minFont && !checkFits(newFontSize)) {
      newFontSize -= 5; 
    }

  
    el.style.fontSize = `${newFontSize}px`;

    if (currentFontSettings && currentSize !== newFontSize) {
        setFontSettings(prevSettings => {
            const newSettings = [...prevSettings];
            if (!newSettings[index]) return prevSettings;

            if (newSettings[index].fontSize === newFontSize) return prevSettings;

            newSettings[index] = {
                ...newSettings[index],
                fontSize: newFontSize
            };
            return newSettings;
        });
    }

  }, [text, minFont, maxFont, index, setFontSettings, currentFontSettings?.fontSize, currentFontSettings?.fontFamily, currentFontSettings?.fontWeight]); 

  return [ref, currentFontSettings?.fontSize || maxFont];
}

export default useAutoFontSize;