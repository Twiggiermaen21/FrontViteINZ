import { useEffect, useRef } from "react";

function useAutoFontSize(text, index, setFontSettings, currentFontSettings, minFont = 10, maxFont = 30) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pobieramy aktualny stan z obiektu (bezpiecznie)
    const currentSize = currentFontSettings?.size || maxFont;

    let newFontSize = maxFont;

    // Funkcja sprawdzająca czy tekst się mieści
    const checkFits = (size) => {
      el.style.fontSize = `${size}px`;
      
      // Sprawdzamy, czy pojawia się scroll pionowy (scrollHeight > clientHeight)
      // lub poziomy (scrollWidth > clientWidth)
      // Dodajemy 1px marginesu błędu dla przeglądarek
      const fitsVertical = el.scrollHeight <= el.clientHeight + 1;
      const fitsHorizontal = el.scrollWidth <= el.clientWidth + 1;

      return fitsVertical && fitsHorizontal;
    };

    // Pętla: zmniejszaj czcionkę, dopóki tekst się nie mieści (czyli dopóki jest scroll)
    // LUB dopóki nie osiągniemy minFont
    while (newFontSize > minFont && !checkFits(newFontSize)) {
      newFontSize--;
    }

    // Przywracamy styl na taki, jaki ma być wyrenderowany (żeby uniknąć migania przed update'm stanu)
    el.style.fontSize = `${newFontSize}px`;

    // Aktualizacja stanu tylko jeśli rozmiar się zmienił
    if (currentFontSettings && currentSize !== newFontSize) {
        setFontSettings(prevSettings => {
            const newSettings = [...prevSettings];
            if (!newSettings[index]) return prevSettings;

            newSettings[index] = {
                ...newSettings[index],
                fontSize: newFontSize
            };
            return newSettings;
        });
    }

  }, [text, minFont, maxFont, index, setFontSettings, currentFontSettings?.size, currentFontSettings?.fontFamily, currentFontSettings?.fontWeight]); 
  // Dodałem zależności do font family/weight, bo zmiana czcionki (np. na grubszą) też może wywołać scroll

  return [ref, currentFontSettings?.size || maxFont];
}

export default useAutoFontSize;