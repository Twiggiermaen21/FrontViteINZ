import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const EditRightPanel = ({ selectedCalendar, setSelectedCalendar }) => {
  const [openSection, setOpenSection] = useState("topImage");
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    selectedCalendar?.top_image_url || null
  );

  const scrollRef = useRef(null);

  // 🔹 Pobieranie obrazów z backendu
  const fetchImages = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/generate/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, page_size: 12 },
      });

      setImages((prev) => [...prev, ...res.data.results]);
      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania obrazów:", err);
      if (err.response?.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Pierwsze pobranie
  useEffect(() => {
    fetchImages();
  }, []);

  // 🔹 Infinite scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50
      ) {
        fetchImages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollRef, hasMore, loading]);

  const toggleSection = (name) => {
    setOpenSection((prev) => (prev === name ? null : name));
  };

  const handleImageSelect = (url) => {
    setSelectedImageUrl(url);
    setSelectedCalendar((prev) => ({
      ...prev,
      top_image_url: url,
    }));
  };

  return (
    <div className="flex-1 bg-[#1f2020] rounded-2xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-4">
        Ustawienia kalendarza
      </h2>

      <div className="space-y-4">
        {/* 🔹 Sekcja: Grafika górna */}
        <div>
          <div
            className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition ${
              openSection === "topImage"
                ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-semibold"
                : "bg-[#2a2b2b] text-gray-300 hover:bg-[#343636]"
            }`}
            onClick={() => toggleSection("topImage")}
          >
            <span>🖼️ Grafika górna</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 transition-transform duration-300 ${
                openSection === "topImage" ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {openSection === "topImage" && (
            <div className="bg-[#2a2b2b]  rounded-4xl p-4 shadow-lg mt-4 animate-fadeIn">
              <h2 className="text-base font-semibold text-[#d2e4e2] mb-4">
                Galeria grafik
              </h2>

              <div
                ref={scrollRef}
                className="grid grid-cols-2 gap-3 max-h-72 overflow-hidden overflow-y-auto custom-scroll"
              >
                {images.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageSelect(item.url)}
                    className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      selectedImageUrl === item.url
                        ? "ring-4 ring-[#6d8f91] scale-[1.02]"
                        : "hover:opacity-80"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt="Grafika AI"
                      className="object-cover  "
                    />
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
                className="block w-full text-sm rounded-lg bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] cursor-pointer file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#6d8f91] file:to-[#afe5e6] file:text-[#1e1f1f] hover:file:opacity-90"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditRightPanel;
