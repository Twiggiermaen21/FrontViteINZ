import React, { useEffect, useRef, useCallback } from "react";

const StyleSidebar = ({
  style,
  setStyle,
  images,
  loading,
  hasMore,
  fetchImages,
  setImage,
  setImageFromDisk,
  setDimensions,
}) => {
  const scrollRef = useRef(null);

  const styles = [
    { key: "style1", label: "Grafika + kolor" },
    { key: "style2", label: "Rozciągnięty gradient" },
    { key: "style3", label: "Grafika na całym tle" },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageFromDisk(true);

      // pobranie wymiarów obrazu
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  // ✅ Infinite scroll — automatyczne ładowanie przy przewinięciu do końca
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

  return (
    <>
      {/* Styl kalendarza */}
      <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4">
        <h2 className="text-base font-semibold text-[#d2e4e2] mb-4">
          Styl kalendarza
        </h2>

        <div className="flex flex-col gap-2">
          {styles.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStyle(key)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors
                ${
                  style === key
                    ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-semibold"
                    : "text-[#d2e4e2] hover:bg-[#374b4b] hover:text-white"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Galeria grafik z infinite scroll */}
      <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4">
        <h2 className="text-base font-semibold text-[#d2e4e2] mb-4">
          Galeria grafik
        </h2>

        {/* ✅ Scrollowalny kontener */}
        <div
          ref={scrollRef}
          className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scroll"
        >
          {images.map((item, index) => (
            <img
              key={index}
              src={item.url}
              alt="Grafika AI"
              className="cursor-pointer object-cover h-20 w-full rounded-lg hover:opacity-70 transition"
              onClick={() => {
                setImage(item);
                setImageFromDisk(false);
              }}
            />
          ))}
        </div>

        {/* ✅ Komunikaty na dole */}
        <div className="text-center mt-3">
          {loading && (
            <p className="text-[#989c9e] text-sm">Ładowanie grafik...</p>
          )}
          {!hasMore && !loading && (
            <p className="text-[#989c9e] text-sm">Brak więcej grafik.</p>
          )}
        </div>


        <h2 className="text-base font-semibold text-[#d2e4e2] mb-2">
          Wgraj własną grafikę
        </h2>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
                    className="block w-full text-sm rounded-lg bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] cursor-pointer file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#6d8f91] file:to-[#afe5e6] file:text-[#1e1f1f] hover:file:opacity-90"

        />
      </div>

      
    </>
  );
};

export default StyleSidebar;