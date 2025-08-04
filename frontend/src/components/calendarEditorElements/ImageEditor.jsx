import React, { useState, useRef } from "react";

const ImageEditor = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Wczytywanie obrazka
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setPosition({ x: 0, y: 0 }); // reset pozycji
        setScale(1); // reset skali
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag start
  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setStartPos(position);
  };

  // Drag move
  const onMouseMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const dx = e.clientX - startDragPos.x;
    const dy = e.clientY - startDragPos.y;
    setPosition({ x: startPos.x + dx, y: startPos.y + dy });
  };

  // Drag end
  const onMouseUp = () => {
    setDragging(false);
  };

  // Zoom
  const onZoomChange = (e) => {
    const val = parseFloat(e.target.value);
    setScale(val);
  };

  return (
    <div
      className={`text-center ${dragging ? "select-none" : "select-auto"}  w-full`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="mx-auto my-4 block"
      />

      {imageSrc && (
        <>
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className={`mt-5 mx-auto border border-gray-300 overflow-hidden relative cursor-${dragging ? "grabbing" : "grab"}`}
            style={{ height: 60 }}
          >
            <img
              src={imageSrc}
              alt="Uploaded"
              draggable={false}
              style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                
                height: 60,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                userSelect: "none",
              }}
              onLoad={() => {
                if (position.x === 0 && position.y === 0) {
                  setPosition({ x: 0, y: 0 });
                }
              }}
            />
          </div>

          <input
            type="range"
            min="0.1"
            max="3"
            step="0.01"
            value={scale}
            onChange={onZoomChange}
            className="] mt-2"
          />
        </>
      )}
    </div>
  );
};

export default ImageEditor;
