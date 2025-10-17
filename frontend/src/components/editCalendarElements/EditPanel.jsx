// EditRightPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../../constants";
import TopImageSection from "./TopImageSection";
import BottomImageSection from "./BottomImageSection";

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
        params: { page, page_size: 6 },
      });

      // 🔹 Scalanie bez duplikatów
      setImages((prev) => {
        const combined = [...prev, ...res.data.results];
        const unique = combined.filter(
          (v, i, a) => a.findIndex((item) => item.url === v.url) === i
        );
        return unique;
      });

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
      if (loading || !hasMore) return; // ✅ zabezpieczenie

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50
      ) {
        fetchImages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollRef, loading, hasMore]);

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
        <TopImageSection
          openSection={openSection}
          toggleSection={toggleSection}
          images={images}
          selectedImageUrl={selectedImageUrl}
          setSelectedCalendar={setSelectedCalendar}
          selectedCalendar={selectedCalendar}
          setSelectedImageUrl={setSelectedImageUrl}
          handleImageSelect={handleImageSelect}
          loading={loading}
          hasMore={hasMore}
          scrollRef={scrollRef}
        />
        <BottomImageSection
          openSection={openSection}
          toggleSection={toggleSection}
          images={images}
          selectedImageUrl={selectedImageUrl}
          setSelectedCalendar={setSelectedCalendar}
          selectedCalendar={selectedCalendar}
          setSelectedImageUrl={setSelectedImageUrl}
          handleImageSelect={handleImageSelect}
          loading={loading}
          hasMore={hasMore}
          scrollRef={scrollRef}
        
        />
      </div>
    </div>
  );
};

export default EditRightPanel;
