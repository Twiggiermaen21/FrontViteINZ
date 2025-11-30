import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { useOutletContext } from "react-router-dom";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const Gallery = () => {
  const selectedProject = useOutletContext() ?? {};
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const isFetchingRef = useRef(false); // ⛔ lokalna blokada




 const fetchImages = useCallback(async () => {
  if (isFetchingRef.current || loading || !hasMore) return;

  isFetchingRef.current = true;
  setLoading(true);
  const token = localStorage.getItem(ACCESS_TOKEN);

  try {
    const res = await axios.get(`${apiUrl}/generate/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { 
        page,
        page_size: 20,
        project_name: selectedProject?.name,
      },
    });

    const results = res.data.results || [];

    if (page === 1) {
      setImages(results);
    } else if (results.length > 0) {
      setImages((prev) => {
        const merged = [...prev, ...results];
        return Array.from(new Map(merged.map((img) => [img.id, img])).values());
      });
    }

    if (!res.data.next || results.length < 20) setHasMore(false);
    else setPage((prev) => prev + 1);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
    isFetchingRef.current = false;
  }
}, [selectedProject, page, loading, hasMore]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages, selectedProject]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // tylko jeśli nie ładuje i są jeszcze dane
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
      fetchImages();
    }
  };
console.log("images:", images);
  return (
    <div className="p-6">
       <h1 className="text-4xl font-extrabold mb-4 text-[#afe5e6]">Gallery</h1>

      <div className="h-[80vh] rounded-4xl border pt-8 pb-8 border-[#2c2e2d] p-4 bg-[#2c2e2d]">
        <div
          className="custom-scroll overflow-y-auto h-full pr-4"
          onScroll={handleScroll}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.length === 0 && !loading ? (
              <p className="col-span-full text-center text-[#9ca3af]">
                Brak obrazów do wyświetlenia.
              </p>
            ) : (
              images
      .filter((img) =>
        selectedProject?.name
          ? img.name === selectedProject.name
          : true
      )
      .map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border border-[#374b4b] bg-[#2a2b2b] shadow-sm cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.url}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-44 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-[#00000080] flex items-end p-2 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-sm text-[#a0f0f0]">
                      Name: {img.name}
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

          {!hasMore && !loading && (
            <p className="col-span-full text-center text-[#9ca3af] mt-4">
              🏁 To już wszystkie obrazy.
            </p>
          )}
        </div>
      </div>

      {/* Modal powiększonego obrazu */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1e1f1f] rounded-2xl shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 left-3 text-white text-2xl hover:text-[#a0f0f0] transition"
              onClick={() => setSelectedImage(null)}
            >
              ←
            </button>
            <button
              className="absolute top-3 right-3 text-white text-2xl hover:text-[#a0f0f0] transition"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>

            <img
              src={selectedImage.url}
              alt="Selected"
              className="w-full max-h-[70vh] object-contain bg-black"
            />

            <div className="p-4 border-t border-[#2c2e2d] text-[#d1d5db]">
              <h2 className="text-lg font-semibold mb-2">Details</h2>
              <p>
                <span className="font-medium text-[#a0f0f0]">Prompt:</span>{" "}
                {selectedImage.prompt}
              </p>
              {selectedImage.created_at && (
                <p className="mt-2 text-sm text-[#9ca3af]">
                  Generated at:{" "}
                  {new Date(selectedImage.created_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
