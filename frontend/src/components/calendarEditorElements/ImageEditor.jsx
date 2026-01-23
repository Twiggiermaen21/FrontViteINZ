import React, { useState, useRef, useEffect } from "react";

const ImageEditor = ({
  imageSrc,
  setImageSrc,
  imageScale,
  setImageScale,
  position,
  setPosition,
  containerZoom = 0.08 // WAŻNE: Skala całego podglądu (np. ta z div style={{zoom: 0.08}})
}) => {
  const [dragging, setDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [displaySrc, setDisplaySrc] = useState(null);

  const containerRef = useRef(null);

  // 1. Bezpieczne zarządzanie URL obrazka (Blob)
  useEffect(() => {
    let objectUrl;
    if (imageSrc instanceof File) {
      objectUrl = URL.createObjectURL(imageSrc);
      setDisplaySrc(objectUrl);
    } else {
      setDisplaySrc(imageSrc);
    }

    // Czyścimy pamięć dopiero gdy zmieni się imageSrc lub komponent zniknie
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageSrc]);

  // Drag start
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Zapobiega konfliktom z innymi elementami
    setDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setStartPos(position);
  };

  // Drag move
  const onMouseMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    e.stopPropagation();

    // 2. Korekta przesunięcia o Zoom kontenera
    // Jeśli kontener jest pomniejszony (0.08), musimy ruszać się szybciej wewnątrz niego
    const deltaX = (e.clientX - startDragPos.x) / containerZoom;
    const deltaY = (e.clientY - startDragPos.y) / containerZoom;

    setPosition({ x: startPos.x + deltaX, y: startPos.y + deltaY });
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  const handleRemoveImage = () => {
      setImageSrc(null);
      // Reset pozycji i skali przy usunięciu
      setPosition({x: 0, y: 0});
      setImageScale(1);
  };

  return (
    <div className={`w-full h-full relative group`}>
      {displaySrc ? (
        <>
          {/* Obszar maskowania - wypełnia rodzica */}
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            className={`w-full h-full overflow-hidden relative border border-gray-300 cursor-${
              dragging ? "grabbing" : "grab"
            }`}
            style={{ 
                // Upewniamy się, że nie ma tu sztywnych 60px
                minHeight: "100%" 
            }}
          >
            <img
              src={displaySrc}
              alt="Uploaded"
              draggable={false}
              style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                // Obrazek nie ma sztywnej wysokości, skaluje się proporcjonalnie
                transform: `scale(${imageScale})`,
                transformOrigin: "top left",
                userSelect: "none",
                maxWidth: "none", // Ważne, żeby bootstrap/tailwind nie ściskał obrazka
                maxHeight: "none"
              }}
            />
          </div>

          
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center border-4 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400">
           {/* Tekst musi być duży w wysokiej rozdzielczości */}
          <span style={{ fontSize: "100px" }}>Kliknij, aby dodać zdjęcie</span>
          {/* Tu musiałbyś dodać input type file, ukryty lub obsługiwany przez rodzica */}
        </div>
      )}
    </div>
  );
};

export default ImageEditor;