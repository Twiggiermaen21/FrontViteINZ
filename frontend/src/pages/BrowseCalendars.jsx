import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;
const months = ["Grudzień", "Styczeń", "Luty"];

const BrowseCalendars = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollRef = useRef(null);
  const thumbRef = useRef(null);

  // Pobieranie kalendarzy
  const fetchCalendars = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await axios.get(`${apiUrl}/calendars/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, page_size: 5 },
      });

      setCalendars((prev) => [...prev, ...response.data.results]);
      setHasMore(!!response.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania danych:", err);
      if (err.response?.status === 401)
        setTimeout(() => window.location.reload(), 500);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  useEffect(() => {
    fetchCalendars();
  }, []);

  // Aktualizacja thumba paska scroll
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

  // Infinite scroll
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

  console.log("kalendarze", calendars);

  return (
    <div className="relative w-full max-w-[1512px] mx-auto bg-[#2a2b2b] rounded-4xl p-8 shadow-lg space-y-4">
      <h1 className="text-3xl font-bold text-white mb-4">
        Przeglądaj kalendarze
      </h1>

      {/* Pasek scroll na górze */}

      {/* Wrapper z przewijaniem poziomym */}
      <div className="overflow-x-auto  custom-scroll " ref={scrollRef}>
        <div className="flex gap-6 pb-4">
          {calendars.length === 0 && !loading ? (
            <p className="text-[#989c9e]">Brak dostępnych kalendarzy.</p>
          ) : (
            calendars.map((calendar) => (
              <div key={calendar.id} className="flex-shrink-0">
                <h1 className="text-xl  font-bold text-white mb-2">
                  {calendar.name}
                </h1>
                <div
                  key={calendar.id}
                  className="w-[372px] h-[972px] bg-white border rounded overflow-hidden shadow shrink-0"
                >
                  {/* Header */}
                  <div className="relative h-[252px] bg-gray-200 flex items-center justify-center overflow-hidden">
                    {calendar.top_image ? (
                      <>
                        <img
                          src={calendar.top_image_url}
                          alt="Nagłówek"
                          className="w-full h-full object-cover"
                        />
                        {calendar.year_data && (
                          <span
                            style={{
                              position: "absolute",
                              color: calendar.year_data.color,
                              fontSize: `${calendar.year_data.size}px`,
                              fontWeight: calendar.year_data.weight,
                              fontFamily: calendar.year_data.font,
                              left: `${calendar.year_data.positionX}px`,
                              top: `${calendar.year_data.positionY}px`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {calendar.year_data.text || ""}
                          </span>
                        )}
                      </>
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
                      backgroundImage: calendar.bottom?.image,
                    })}
                  >
                    {[calendar.field1, calendar.field2, calendar.field3].map(
                      (field, index) => {
                        if (!field) return null;
                        const key = `${calendar.id}-${index}`; // unikalny key dla pola w kalendarzu

                        const isText = "text" in field;
                        const isImage = "path" in field;

                        return (
                          <div
                            key={key}
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
                                        key={`${calendar.id}-${index}-${img.id}`} // unikalny key
                                        src={img.url}
                                        alt="Image"
                                        style={{
                                          height: 60,
                                          transform: `scale(${field.size})`,
                                          transformOrigin: "top left",
                                          userSelect: "none",
                                        }}
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
    </div>
  );
};

export default BrowseCalendars;
