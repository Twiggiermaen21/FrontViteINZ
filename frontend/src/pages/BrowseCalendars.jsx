import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { Trash2 } from "lucide-react";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;
const months = ["Grudzień", "Styczeń", "Luty"];

const BrowseCalendars = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [selectedCalendar, setSelectedCalendar] = useState(null); // ✅ do modala

  const scrollRef = useRef(null);
  const thumbRef = useRef(null);

  const fetchCalendars = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await axios.get(`${apiUrl}/calendars/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, page_size: 10 },
      });

      setCalendars((prev) => {
        const newItems = response.data.results.filter(
          (item) => !prev.some((c) => c.id === item.id)
        );
        return [...prev, ...newItems];
      });

      setHasMore(!!response.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania danych:", err);
      if (err.response?.status === 401)
        setTimeout(() => window.location.reload(), 500);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    fetchCalendars();
  }, []);

  // Scroll thumb update
  const updateThumb = useCallback(() => {
    if (!scrollRef.current || !thumbRef.current) return;
    const container = scrollRef.current;
    const thumb = thumbRef.current;

    const containerWidth = container.scrollWidth;
    const visibleWidth = container.clientWidth;

    const thumbWidth = (visibleWidth / containerWidth) * visibleWidth;
    const thumbLeft = (container.scrollLeft / containerWidth) * visibleWidth;

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${thumbLeft}px)`;
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    updateThumb();

    return () => {
      container.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, [calendars, updateThumb]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 5 && !loading && hasMore) {
      fetchCalendars();
    }
  }, [loading, hasMore, fetchCalendars]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Funkcja do usuwania kalendarza
  const deleteCalendar = async (id) => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć kalendarz?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      await axios.delete(`${apiUrl}/calendar-destroy/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCalendars((prev) => prev.filter((c) => c.id !== id));
      setSelectedCalendar(null);
    } catch (err) {
      console.error("Błąd podczas usuwania kalendarza:", err);
      alert("Nie udało się usunąć kalendarza.");
    }
  };

  return (
    <div className="relative mt-8 mx-auto bg-[#2a2b2b] rounded-4xl p-8 shadow-lg space-y-4 max-h-[1900]   max-w-[1600px]">
      <h1 className="text-3xl font-bold text-white mb-4">
        Przeglądaj kalendarze
      </h1>

      <div className="overflow-x-auto w-full custom-scroll" ref={scrollRef}>
        <div className="flex gap-6 pb-4">
          {calendars.length === 0 && !loading ? (
            <p className="text-[#989c9e]">Brak dostępnych kalendarzy.</p>
          ) : (
            calendars.map((calendar, index) => (
              <div
                key={calendar.id}
                className={`flex-shrink-0 relative my-3 flex flex-col items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl
      ${index === 0 ? "ml-6" : ""}
      ${index === calendars.length - 1 ? "mr-6" : ""}`}
                onClick={() => setSelectedCalendar(calendar)} // otwieranie modala
              >
                <h1 className="text-xl font-bold text-white mb-2">
                  {calendar.name}
                </h1>
                <div className="relative w-[221px] h-[539px] bg-white border rounded overflow-hidden shadow">
                  {/* Header */}
                  <div className="relative h-[152px] bg-gray-200 flex items-center justify-center overflow-hidden">
                    {calendar.top_image ? (
                      <img
                        src={calendar.top_image_url}
                        alt="Nagłówek"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">
                        Brak grafiki nagłówka
                      </span>
                    )}
                  </div>

                  {/* Bottom */}
                  <div
                    className="h-[720px] px-3 py-4 flex flex-col items-center text-center"
                    style={getBottomSectionBackground({
                      style:
                        calendar.bottom?.content_type_id === 26
                          ? "style1"
                          : calendar.bottom?.content_type_id === 27
                          ? "style2"
                          : calendar.bottom?.content_type_id === 28
                          ? "style3"
                          : null,
                      bgColor:
                        calendar.bottom?.color ?? calendar.bottom?.start_color,
                      gradientEndColor: calendar.bottom?.end_color,
                      gradientTheme: calendar.bottom?.theme,
                      gradientStrength: calendar.bottom?.strength,
                      gradientVariant: calendar.bottom?.direction,
                      backgroundImage: calendar.bottom?.url,
                    })}
                  >
                    {[calendar.field1, calendar.field2, calendar.field3].map(
                      (field, index) => {
                        if (!field) return null;
                        const isText = "text" in field;
                        const isImage = "path" in field;
                        return (
                          <div
                            key={`${calendar.id}-${index}`}
                            className="w-full border rounded bg-white shadow p-2 flex flex-col items-center mb-2"
                          >
                            <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide mb-1">
                              {months[index]}
                            </h3>
                            <div className="w-full h-[85px] text-sm text-gray-600 flex items-center justify-center mb-2">
                              [Siatka dni dla {months[index]}]
                            </div>
                            <div className="text-xl font-bold text-blue-700 uppercase tracking-wide mt-2">
                              {isText
                                ? field.text
                                : isImage
                                ? calendar.images_for_fields
                                    .filter(
                                      (img) => img.field_number === index + 1
                                    )
                                    .map((img) => (
                                      <img
                                        key={`${calendar.id}-${index}-${img.id}`}
                                        src={img.url}
                                        alt="Image"
                                        style={{ height: 60 }}
                                      />
                                    ))
                                : null}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {loading && (
        <p className="text-[#989c9e] text-center mt-4">
          Ładowanie kalendarzy...
        </p>
      )}

      {/* Modal */}
     {selectedCalendar && (
  <div
    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
    onClick={() => setSelectedCalendar(null)}
  >
    <div
      className="relative max-w-6xl w-full bg-[#1e1f1f] rounded-2xl shadow-lg overflow-hidden flex gap-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Zamknij modal */}
      <button
        className="absolute top-3 right-3 text-white text-2xl hover:text-[#a0f0f0] transition"
        onClick={() => setSelectedCalendar(null)}
      >
        ✕
      </button>

      {/* Kalendarz */}
      <div className="flex-shrink-0 w-[400px] h-auto bg-white border rounded overflow-hidden shadow m-4">
        {/* Header */}
        <div className="relative h-[180px] bg-gray-200 flex items-center justify-center overflow-hidden">
          {selectedCalendar.top_image ? (
            <img
              src={selectedCalendar.top_image_url}
              alt="Nagłówek"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500">Brak grafiki nagłówka</span>
          )}
        </div>

        {/* Bottom */}
        <div
          className="px-3 py-4 flex flex-col items-center text-center"
          style={getBottomSectionBackground({
            style:
              selectedCalendar.bottom?.content_type_id === 26
                ? "style1"
                : selectedCalendar.bottom?.content_type_id === 27
                ? "style2"
                : selectedCalendar.bottom?.content_type_id === 28
                ? "style3"
                : null,
            bgColor:
              selectedCalendar.bottom?.color ??
              selectedCalendar.bottom?.start_color,
            gradientEndColor: selectedCalendar.bottom?.end_color,
            gradientTheme: selectedCalendar.bottom?.theme,
            gradientStrength: selectedCalendar.bottom?.strength,
            gradientVariant: selectedCalendar.bottom?.direction,
            backgroundImage: selectedCalendar.bottom?.url,
          })}
        >
          {[selectedCalendar.field1, selectedCalendar.field2, selectedCalendar.field3].map(
            (field, index) => {
              if (!field) return null;
              const isText = "text" in field;
              const isImage = "path" in field;
              return (
                <div
                  key={`${selectedCalendar.id}-${index}`}
                  className="w-full border rounded bg-white shadow p-2 flex flex-col items-center mb-2"
                >
                  <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide mb-1">
                    {months[index]}
                  </h3>
                  <div className="w-full h-[85px] text-sm text-gray-600 flex items-center justify-center mb-2">
                    [Siatka dni dla {months[index]}]
                  </div>
                  <div className="text-xl font-bold text-blue-700 uppercase tracking-wide mt-2">
                    {isText
                      ? field.text
                      : isImage
                      ? selectedCalendar.images_for_fields
                          .filter((img) => img.field_number === index + 1)
                          .map((img) => (
                            <img
                              key={`${selectedCalendar.id}-${index}-${img.id}`}
                              src={img.url}
                              alt="Image"
                              style={{ height: 60 }}
                            />
                          ))
                      : null}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Panel boczny z nazwą i przyciskami */}
      <div className="flex flex-col justify-start p-6 text-white flex-1">
        <h2 className="text-3xl font-bold mb-6">{selectedCalendar.name}</h2>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
          onClick={() => window.print()}
        >
          Drukuj
        </button>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          onClick={() => deleteCalendar(selectedCalendar.id)}
        >
          Usuń
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default BrowseCalendars;
