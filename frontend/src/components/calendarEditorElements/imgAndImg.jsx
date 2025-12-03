import React, { useRef, useEffect, useCallback } from "react";

const BackgroundImg = ({
  images,
  backgroundImage,
  setBackgroundImage,
  fetchImages,
  hasMore,
  loading,
}) => {
  const scrollRef = useRef(null);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

    if (isAtBottom) {
      fetchImages();
    }
  }, [loading, hasMore, fetchImages]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setBackgroundImage(objectUrl);
    }
  };

  return (
    <>
      {/* Sekcja wyboru tła */}
      <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4">
        <h2 className="text-base font-semibold text-[#d2e4e2] mb-4">
          Tło kalendarza
        </h2>

        {/* Galeria z infinite scroll */}
        <div
          ref={scrollRef}
          className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto custom-scroll"
        >
          {images.map((img, index) => (
            <img
              key={img.id || img.url || index}
              src={img.url}
              alt="Grafika tła"
              className={`cursor-pointer object-cover h-20 w-full rounded-lg border transition 
                ${
                  backgroundImage === img.url
                    ? "ring-2 ring-[#6d8f91] border-[#6d8f91]"
                    : "border-[#374b4b] hover:border-[#6d8f91]"
                }`}
              onClick={() => setBackgroundImage(img)}
            />
          ))}
        </div>

        {/* Komunikaty na dole */}
        <div className="text-center mt-3">
          {loading && (
            <p className="text-[#989c9e] text-sm">Ładowanie grafik...</p>
          )}
          {!hasMore && !loading && (
            <p className="text-[#989c9e] text-sm">Brak więcej grafik.</p>
          )}
        </div>

        <h3 className="text-base font-semibold text-[#d2e4e2] mb-4">
          Wgraj własną grafikę tła
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="block w-full text-sm rounded-lg bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] cursor-pointer file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#6d8f91] file:to-[#afe5e6] file:text-[#1e1f1f] hover:file:opacity-90"
        />
      </div>

     
    </>
  );
};

export default BackgroundImg;
