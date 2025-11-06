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
    <div className="flex flex-col mt-16 items-center bg-[#1e1f1f] text-[#d2e4e2] py-12">
      <h1 className="text-3xl font-semibold text-center bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] bg-clip-text text-transparent">
        Explore the Library
      </h1>
      <p className="text-sm text-[#989c9e] text-center mt-3 max-w-lg mx-auto">
        A visual collection of our most recent works — each piece crafted with
        intention, emotion, and style.
      </p>

      <div className="w-full max-w-7xl mt-10 overflow-hidden relative rounded-2xl bg-[#2a2b2b] border border-[#374b4b] shadow-xl">
        <div
          ref={containerRef}
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {groupedImages.map((group, i) => (
            <div
              key={i}
              className="flex justify-center w-full flex-shrink-0 px-4 py-6"
            >
              {group.map((src, j) => (
                <img
                  key={j}
                  src={src}
                  alt={`Gallery image ${i * groupSize + j + 1}`}
                  className="mx-3 rounded-xl shadow-md hover:scale-[1.05] hover:shadow-lg transition-transform duration-300 border border-[#374b4b]"
                  style={{ maxWidth: "22%", height: "auto" }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center mt-6 space-x-3">
        {Array.from({ length: totalGroups }).map((_, i) => (
          <span
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === i
                ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] shadow-md scale-110"
                : "bg-[#374b4b]"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
