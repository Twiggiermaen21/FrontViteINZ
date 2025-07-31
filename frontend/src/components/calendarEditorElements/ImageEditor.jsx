import React, { useRef, useState, useEffect } from "react";

const ImageEditor = ({
  imageSrc,
  onChange, // callback z nowym obrazem lub pozycją
  maxWidth = 300,
  maxHeight = 85,
}) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Obsługa rozpoczęcia dragowania
  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setStartPos(position);
  };

  // Obsługa przeciągania
  const onMouseMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const dx = e.clientX - startDragPos.x;
    const dy = e.clientY - startDragPos.y;

    let newX = startPos.x + dx;
    let newY = startPos.y + dy;

    // Ograniczenie przesuwania w poziomie i pionie, jeśli chcesz
    // tutaj możesz dodać ograniczenia do containerRef

    setPosition({ x: newX, y: newY });
  };

  const onMouseUp = (e) => {
    setDragging(false);
  };

  // Zoom - prosty input range
  const onZoomChange = (e) => {
    const val = parseFloat(e.target.value);
    setScale(val);
  };

  // Obsługa zmiany pliku
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange(url);
      setPosition({ x: 0, y: 0 });
      setScale(1);
    }
  };

  useEffect(() => {
    // Cleanup URL object kiedy obraz się zmienia lub komponent znika
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  return (
    <div className="w-full flex flex-col items-center">
      <input type="file" accept="image/*" onChange={onFileChange} />

      <div
        ref={containerRef}
        className="relative overflow-hidden border border-gray-300 rounded mt-2"
        style={{ width: maxWidth, height: maxHeight, cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {imageSrc ? (
          <img
            ref={imgRef}
            src={imageSrc}
            alt="editable"
            draggable={false}
            style={{
              position: "absolute",
              top: position.y,
              left: position.x,
              transform: `scale(${scale})`,
              userSelect: "none",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Wybierz obrazek
          </div>
        )}
      </div>

      <input
        type="range"
        min="0.5"
        max="3"
        step="0.01"
        value={scale}
        onChange={onZoomChange}
        className="w-full mt-2"
      />
    </div>
  );
};

export default ImageEditor;
