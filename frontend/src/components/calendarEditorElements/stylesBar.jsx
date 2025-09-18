import React from "react";

const StyleSidebar = ({ style, setStyle, images,loading,hasMore,fetchImages, handleImageSelect, handleFileUpload,setImageFromDisk }) => {
  return (
    <>
      {/* Styl kalendarza */}
      <div className="border rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Styl kalendarza</h2>
        <div className="space-y-2">
          <button
            className={`w-full px-4 py-2 border rounded ${style === "style1" ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => setStyle("style1")}
          >
            Grafika + kolor
          </button>
          <button
            className={`w-full px-4 py-2 border rounded ${style === "style2" ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => setStyle("style2")}
          >
            Rozciągnięty gradient
          </button>
          <button
            className={`w-full px-4 py-2 border rounded ${style === "style3" ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => setStyle("style3")}
          >
            Grafika na całym tle
          </button>
        </div>
      </div>

      {/* Galeria grafik */}
       <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-2">Galeria grafik</h2>
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {images.map((item, index) => (
          <img
            key={index}
            src={item.url}
            alt="Grafika AI"
            className="cursor-pointer object-cover h-20 w-full border rounded hover:opacity-70"
            onClick={() => {
              handleImageSelect(item);
              setImageFromDisk(false);
            }}
          />
        ))}
      </div>

      {/* 🔹 Przyciski doładowania */}
      <div className="text-center mt-3">
        {hasMore ? (
          <button
            onClick={fetchImages}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Ładowanie..." : "Załaduj więcej"}
          </button>
        ) : (
          <p className="text-gray-500 text-sm">Brak więcej grafik.</p>
        )}
      </div>
    </div>

      {/* Własna grafika */}
      <div className="border rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Wgraj własną grafikę</h2>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded"
        />
      </div>
    </>
  );
};

export default StyleSidebar;
