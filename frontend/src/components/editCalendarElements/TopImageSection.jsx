// TopImageSection.jsx
import React, { useState } from "react";

const TopImageSection = ({
  openSection,
  toggleSection,
  images,
  selectedImageUrl,
  setSelectedCalendar,
  selectedCalendar,
  setSelectedImageUrl,
  handleImageSelect,
  loading,
  hasMore,
  scrollRef,
}) => {
  const [uploadImage, setUploadImage] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadImage(file); // do ewentualnej wysyłki na backend
      const objectUrl = URL.createObjectURL(file);

      // aktualizacja podglądu
      setSelectedImageUrl(objectUrl);

      // aktualizacja selectedCalendar.top_image_url
      setSelectedCalendar((prev) => ({
        ...prev,
        top_image_url: objectUrl,
      }));

      console.log("Nowy top image URL:", objectUrl);
    }
  };

  return (
    <div>
      

      
        <div className="bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4 animate-fadeIn">
          <h2 className="text-base font-semibold text-[#d2e4e2] mb-4">
            Galeria grafik
          </h2>

          <div
            ref={scrollRef}
            className="grid grid-cols-2 gap-3 max-h-72 overflow-hidden overflow-y-auto custom-scroll"
          >
            {images.map((item) => (
              <div
                key={item.url} // ✅ unikalny key
                onClick={() => handleImageSelect(item)}
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                  selectedImageUrl === item.url
                    ? "ring-4 ring-[#6d8f91] scale-[1.02]"
                    : "hover:opacity-80"
                }`}
              >
                <img src={item.url} alt="Grafika AI" className="object-cover" />
              </div>
            ))}
          </div>

          {loading && (
            <p className="text-center text-gray-400 mt-2">Ładowanie...</p>
          )}
          {!hasMore && (
            <p className="text-center text-gray-500 mt-2">
              To już wszystkie grafiki 🎉
            </p>
          )}

          <h2 className="text-base font-semibold text-[#d2e4e2] mt-5 mb-3">
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
    
    </div>
  );
};

export default TopImageSection;
