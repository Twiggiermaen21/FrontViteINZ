import React, { useRef, useEffect, useState } from "react";

const images = [
  "/gallery/cal1.png",
  "/gallery/cal2.png",
  "/gallery/cal3.png",
  "/gallery/cal4.png",
  "/gallery/cal5.png",
  "/gallery/cal1.png",
  "/gallery/cal2.png",
  "/gallery/cal3.png",
  "/gallery/cal4.png",
  "/gallery/cal5.png",
  "/gallery/cal1.png",
  "/gallery/cal2.png",
  "/gallery/cal3.png",
  "/gallery/cal4.png",
  "/gallery/cal5.png",
  "/gallery/cal5.png",
];

export default function ImageGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Grupowanie zdjęć po 2
  const groupedImages = [];
  const groupSize = 4;
  for (let i = 0; i < images.length; i += groupSize) {
    groupedImages.push(images.slice(i, i + groupSize));
  }

  const totalGroups = groupedImages.length;

  const goToSlide = (index) => {
    setCurrentIndex(index % totalGroups);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentIndex + 1) % totalGroups);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, totalGroups]);

  return (
    <div className="flex flex-col mt-10 items-center">
      <h1 className="text-3xl font-semibold text-center mx-auto">
        Explore the Library
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
        A visual collection of our most recent works – each piece crafted with
        intention, emotion, and style.
      </p>

      <div className="w-full max-w-5xl mt-10 overflow-hidden relative">
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {groupedImages.map((group, i) => (
            <div
              key={i}
              className="flex justify-center  w-full flex-shrink-0 px-4"
            >
              {group.map((src, j) => (
                <img
                  key={j}
                  src={src}
                  alt={`Gallery image ${i * groupSize + j + 1}`}
                  style={{ maxWidth: "20%", height: "auto" }}
                  className="mx-2 rounded-lg shadow-md"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center mt-5 space-x-2">
        {Array.from({ length: totalGroups }).map((_, i) => (
          <span
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${currentIndex === i ? "bg-black" : "bg-black/20"
              }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
