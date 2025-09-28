import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // nowa flaga

  const observer = useRef(null);

  // Funkcja pobierająca obrazy
  const fetchImages = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/generate/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, page_size: 20 },
      });

      setImages((prev) => [...prev, ...res.data.results]);
      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania obrazów:", err);
      if (err.response?.status === 401) {
        setTimeout(() => window.location.reload(), 500);
      }
    } finally {
      setLoading(false);
      setInitialLoad(false); // po pierwszym fetchu ustawiamy flagę na false
    }
  }, [page, hasMore, loading]);
  console.log(page);
  // Początkowe pobranie obrazów
  useEffect(() => {
    fetchImages();
  }, []);

  // Ref do ostatniego obrazka (infinite scroll)
  const lastImageRef = useCallback(
    (node) => {
      if (loading || initialLoad) return; // <- nie obserwujemy póki trwa pierwsze ładowanie
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchImages();
          }
        },
        { threshold: 1 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchImages, initialLoad]
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4 text-white">Gallery</h1>

      <div className="h-[80vh] rounded-4xl border pt-8 pb-8 border-[#2c2e2d] p-4 bg-[#2c2e2d]">
        <div className="custom-scroll overflow-y-auto h-full pr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.length === 0 && !loading ? (
              <p className="col-span-full text-center text-[#9ca3af]">
                Brak obrazów do wyświetlenia.
              </p>
            ) : (
              images.map((img, index) => (
                <div
                  key={`${img.id}-${index}`}
                  ref={index === images.length - 1 ? lastImageRef : null}
                  className="relative group rounded-lg overflow-hidden border border-[#374b4b] bg-[#2a2b2b] shadow-sm"
                >
                  <img
                    src={img.url}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-44 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[#00000080] flex items-end p-2 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-sm text-[#a0f0f0]">
                      Prompt: {img.prompt?.slice(0, 30)}...
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {loading && (
            <p className="col-span-full text-center text-[#9ca3af] mt-4">
              Ładowanie...
            </p>
          )}
          {!hasMore && images.length > 0 && (
            <p className="text-center text-[#6b7280] mt-4">Brak więcej obrazów.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
