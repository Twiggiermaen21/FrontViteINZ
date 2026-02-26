export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const handleMouseDown = (e, {
  yearPosition,
  setYearPosition,
  setDragging,
  dragStartPos,
  zoom = 1 
}) => {
  e.preventDefault();
  e.stopPropagation(); 
  setDragging(true);

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
  zoom = 1,          
  containerRef,       
  spanRef             
}) => {
  if (!dragging) return;

  const deltaX = (e.clientX - dragStartPos.current.mouseX) / zoom;
  const deltaY = (e.clientY - dragStartPos.current.mouseY) / zoom;

  let newX = dragStartPos.current.elemX + deltaX;
  let newY = dragStartPos.current.elemY + deltaY;

  if (containerRef?.current && spanRef?.current) {
    const containerW = containerRef.current.offsetWidth; 
    const containerH = containerRef.current.offsetHeight;
    
    const elemW = spanRef.current.offsetWidth;
    const elemH = spanRef.current.offsetHeight;

    const maxX = containerW - elemW;
    const maxY = containerH - elemH;

    newX = clamp(newX, 0, maxX);
    newY = clamp(newY, 0, maxY);
  }

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