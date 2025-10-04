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
    <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4 sm:m-4 space-y-4">
      <h2 className="text-base font-semibold text-[#d2e4e2]">
        Tło kalendarza
      </h2>

      {/* Galeria tła */}
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {images.map((img) => (
          <img
            key={img.id || img.url}
            src={img.url}
            alt="Grafika tła"
            className={`cursor-pointer object-cover h-20 w-full rounded-lg border transition 
              ${
                backgroundImage === img
                  ? "ring-2 ring-[#6d8f91] border-[#6d8f91]"
                  : "border-[#374b4b] hover:border-[#6d8f91]"
              }`}
            onClick={() => setBackgroundImage(img)}
          />
        ))}
      </div>

      {/* Upload własnej grafiki */}
      <div>
        <h3 className="text-sm font-medium text-[#d2e4e2] mb-2">
          Wgraj własną grafikę tła
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="block w-full text-sm rounded-lg bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] cursor-pointer file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#6d8f91] file:to-[#afe5e6] file:text-[#1e1f1f] hover:file:opacity-90"
        />
      </div>
    </div>
  );
};

export default BackgroundImg;
