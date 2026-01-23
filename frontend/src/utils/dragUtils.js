// Pomocnicza funkcja clamp (bez zmian)
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const handleMouseDown = (e, {
  yearPosition,
  setYearPosition,
  setDragging,
  dragStartPos,
  zoom = 1 // Domyślnie 1, ale przekażemy tu 0.08
}) => {
  e.preventDefault();
  e.stopPropagation(); // Ważne, żeby nie kolidowało z innymi eventami
  setDragging(true);

  // Pobieramy aktualną pozycję startową (zakładamy, że yearPosition trzyma poprawne dane)
  // Nie używamy tu getBoundingClientRect do ustalania pozycji, bo przy zoomie to bywa mylące.
  // Ufamy współrzędnym, które mamy w stanie.
  const startX = yearPosition.coords.x;
  const startY = yearPosition.coords.y;

  dragStartPos.current = {
    mouseX: e.clientX,
    mouseY: e.clientY,
    elemX: startX,
    elemY: startY,
  };
};

export const handleMouseMove = (e, {
  dragging,
  dragStartPos,
  setYearPosition,
  zoom = 1,           // Ważne: Przekazujemy zoom (0.08)
  containerRef,       // Potrzebne do granic (headerRef)
  spanRef             // Potrzebne do granic (spanRef)
}) => {
  if (!dragging) return;

  // 1. Obliczamy przesunięcie uwzględniając ZOOM
  // Dzielenie przez zoom "naprawia" powolne przesuwanie
  const deltaX = (e.clientX - dragStartPos.current.mouseX) / zoom;
  const deltaY = (e.clientY - dragStartPos.current.mouseY) / zoom;

  let newX = dragStartPos.current.elemX + deltaX;
  let newY = dragStartPos.current.elemY + deltaY;

  // 2. Dynamiczne obliczanie granic (żeby nie wyjść poza obszar)
  if (containerRef?.current && spanRef?.current) {
    const containerW = containerRef.current.offsetWidth; // np. 3661
    const containerH = containerRef.current.offsetHeight; // np. 2480
    
    const elemW = spanRef.current.offsetWidth;
    const elemH = spanRef.current.offsetHeight;

    // Granice: od 0 do (SzerokośćKontenera - SzerokośćElementu)
    const maxX = containerW - elemW;
    const maxY = containerH - elemH;

    newX = clamp(newX, 0, maxX);
    newY = clamp(newY, 0, maxY);
  }

  // 3. Aktualizacja stanu
  setYearPosition((prev) => ({
    ...prev,
    coords: {
      x: newX,
      y: newY,
    },
  }));
};

export const handleMouseUp = (setDragging) => {
  setDragging(false);
};