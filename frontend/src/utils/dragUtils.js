export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const handleMouseDown = (e, {
  yearPosition,
  setYearPosition,
  spanRef,
  xLimits,
  yLimits,
  setDragging,
  dragStartPos
}) => {
  e.preventDefault();
  setDragging(true);

  let startX, startY;

  if (yearPosition.coords) {
    startX = clamp(yearPosition.coords.x, xLimits.min, xLimits.max);
    startY = clamp(yearPosition.coords.y, yLimits.min, yLimits.max);
  } else {
    const rect = spanRef.current.getBoundingClientRect();
    const parentRect = spanRef.current.parentElement.getBoundingClientRect();

    startX = rect.left - parentRect.left + rect.width / 2;
    startY = rect.top - parentRect.top + rect.height / 2;

    startX = clamp(startX, xLimits.min, xLimits.max);
    startY = clamp(startY, yLimits.min, yLimits.max);

    setYearPosition({ coords: { x: startX, y: startY } });
  }

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
  xLimits,
  yLimits,
  setYearPosition
}) => {
  if (!dragging) return;

  const deltaX = e.clientX - dragStartPos.current.mouseX;
  const deltaY = e.clientY - dragStartPos.current.mouseY;

  setYearPosition((prev) => ({
    ...prev,
    coords: {
      x: clamp(dragStartPos.current.elemX + deltaX, xLimits.min, xLimits.max),
      y: clamp(dragStartPos.current.elemY + deltaY, yLimits.min, yLimits.max),
    },
  }));
};

export const handleMouseUp = (setDragging) => {
  setDragging(false);
};
