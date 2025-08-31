import React from "react";

const StyleSidebar = ({ style, setStyle, images, handleImageSelect, handleFileUpload }) => {
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
          {images.map((img) => (
            <img
              key={img.id || img.url}
              src={img.url}
              alt="Grafika AI"
              className="cursor-pointer object-cover h-20 w-full border rounded hover:opacity-70"
              onClick={() => handleImageSelect(img)}
            />
          ))}
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
