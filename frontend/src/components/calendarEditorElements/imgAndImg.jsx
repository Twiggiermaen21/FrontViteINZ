import React from "react";

const BackgroundImg = ({ images, backgroundImage, setBackgroundImage }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setBackgroundImage(objectUrl);
    }
  };

  return (
    <div className="border rounded p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Tło kalendarza</h2>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {images.map((img) => (
          <img
            key={img.id || img.url}
            src={img.url}
            alt="Grafika tła"
            className={`cursor-pointer object-cover h-20 w-full border rounded ${
              backgroundImage === img ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setBackgroundImage(img)}
          />
        ))}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mt-2 mb-1">Wgraj własną grafikę tła</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default BackgroundImg;
