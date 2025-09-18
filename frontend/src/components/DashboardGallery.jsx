import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const didFetch = useRef(false); // zabezpieczenie przed podwójnym fetch w StrictMode

  const fetchImages = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/generate/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, page_size: 20 }, // 🔹 backend musi obsługiwać paginację
      });

      setImages((prev) => [...prev, ...res.data.results]);
      setHasMore(!!res.data.next); // jeśli `next` istnieje, to znaczy że są kolejne strony
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania obrazów:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didFetch.current) {
      fetchImages();
      didFetch.current = true;
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">Gallery</h1>
      <p className="text-gray-500 mb-4 max-w-xl">
        Browse through your generated images below.
      </p>

      {/* Scrollable image container */}
      <div className="h-[80vh] overflow-y-auto rounded-md border border-gray-200 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.length === 0 && !loading ? (
            <p className="col-span-full text-center text-gray-500">
              Brak obrazów do wyświetlenia.
            </p>
          ) : (
            images.map((img, index) => (
              <div
                key={img.id ?? index}
                className="relative group rounded-lg overflow-hidden"
              >
                <img
                  src={img.url}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-44 object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/50 text-white flex items-end p-2 opacity-0 group-hover:opacity-100 transition">
                  <span className="text-sm">
                    Prompt: {img.prompt?.slice(0, 30)}...
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔹 Przyciski paginacji */}
      <div className="text-center mt-4">
        {hasMore ? (
          <button
            onClick={fetchImages}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Ładowanie..." : "Załaduj więcej"}
          </button>
        ) : (
          <p className="text-gray-500">Brak więcej obrazów.</p>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
