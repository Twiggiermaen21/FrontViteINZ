import { useEffect, useRef } from "react";

// ZMIANA: Domyślne wartości zwiększone ~12-krotnie pod wymiar 3661px
function useAutoFontSize(text, index, setFontSettings, currentFontSettings, minFont = 100, maxFont = 450) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // POPRAWKA: Ujednolicenie nazwy - w stanie masz 'fontSize', a nie 'size'
    const currentSize = currentFontSettings?.fontSize || maxFont;

    // Zawsze zaczynamy próbkowanie od maksymalnej czcionki
    let newFontSize = maxFont;

    const checkFits = (size) => {
      el.style.fontSize = `${size}px`;
      
      // Sprawdzamy, czy tekst mieści się w kontenerze
      // +2px marginesu błędu przy tak dużych rozdzielczościach jest bezpieczniejsze
      const fitsVertical = el.scrollHeight <= el.clientHeight + 2;
      const fitsHorizontal = el.scrollWidth <= el.clientWidth + 2;

      return fitsVertical && fitsHorizontal;
    };

    // Pętla zmniejszająca
    while (newFontSize > minFont && !checkFits(newFontSize)) {
      // Przy dużych czcionkach (300px) zmniejszanie o 1px trwa wieki. 
      // Przyspieszamy, skacząc o 5px, a gdy jesteśmy blisko, można by precyzyjniej, 
      // ale 5px przy druku to niewiele.
      newFontSize -= 5; 
    }

    // Aplikujemy końcowy styl
    el.style.fontSize = `${newFontSize}px`;

    // Aktualizacja stanu globalnego
    if (currentFontSettings && currentSize !== newFontSize) {
        setFontSettings(prevSettings => {
            const newSettings = [...prevSettings];
            if (!newSettings[index]) return prevSettings;

            // Zapobiegamy pętli nieskończonej - aktualizujemy tylko jeśli zmiana jest istotna
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