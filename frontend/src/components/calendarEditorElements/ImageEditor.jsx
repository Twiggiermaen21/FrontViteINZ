import React, { useState, useRef } from "react";

const ImageEditor = ({imageSrc,setImageSrc,imageScale,setImageScale,position,setPosition}) => {
 
  
  const [dragging, setDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
const displaySrc = imageSrc instanceof File ? URL.createObjectURL(imageSrc) : imageSrc;

  const containerRef = useRef(null);


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

  

  return (
    <div
      className={`text-center ${dragging ? "select-none" : "select-auto"}  w-full`}
          
          >
      {imageSrc ? (
        <>
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className={`my-2 mx-auto border border-gray-300 overflow-hidden relative cursor-${dragging ? "grabbing" : "grab"}`}
            style={{ height: 60 }}
          >
            <img
              src={displaySrc} 
              alt="Uploaded"
              draggable={false}
              style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                height: 60,
                transform: `scale(${imageScale})`,
                transformOrigin: "top left",
                userSelect: "none",
              }}
              onLoad={() => {
                if (position.x === 0 && position.y === 0) {
                  setPosition({ x: 0, y: 0 });
                }
                URL.revokeObjectURL(imageSrc);
              }}
            />
          </div>
        </>
      ):(
        <div className="my-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
          Wybierz grafikę do kalendarza
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
