import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const CalendarList = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollRef = useRef(null);

  const months = ["Grudzień", "Styczeń", "Luty"];

  const fetchCalendars = async () => {
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
      if (err.response?.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      fetchCalendars();
      didFetch.current = true;
    }
  }, []);

  return (
    <div className="relative w-full max-w-378 mx-auto">
      {/* Wrapper z możliwością przewijania */}
      <div className="overflow-hidden px-12">
        <div
          ref={scrollRef}
          className="flex gap-6 transition-all duration-300 ease-in-out overflow-x-auto scrollbar-hide"
        >
          {calendars.length === 0 && !loading ? (
            <p>Brak dostępnych kalendarzy.</p>
          ) : (
            calendars.map((calendar) => (
              <div
                key={calendar.id}
                className="w-93 h-243 bg-white border rounded overflow-hidden shadow shrink-0"
              >
                {/* Header */}
                <div className="relative h-63 bg-gray-200 flex items-center justify-center overflow-hidden">
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
                    <span className="text-gray-500">Brak grafiki nagłówka</span>
                  )}
                </div>

                {/* Bottom */}
                <div
                  className="h-180 px-3 py-4 flex flex-col items-center text-center"
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

                      const isText = "text" in field;
                      const isImage = "path" in field;

                      return (
                        <>
                          <div
                            key={index}
                            className="w-full border rounded bg-white shadow p-2 flex flex-col items-center"
                          >
                            <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide mb-1">
                              {months[index]}
                            </h3>
                            <div className="w-full h-21.25 text-sm text-gray-600 flex items-center justify-center">
                              [Siatka dni dla {months[index]}]
                            </div>
                          </div>
                          <div className="text-xl font-bold text-blue-700 uppercase tracking-wide mt-2">
                            {isText
                              ? field.text
                              : isImage
                                ? calendar.images_for_fields.map((img, idx) =>
                                    img.field_number === index + 1 ? (
                                      <img
                                        key={idx}
                                        src={img.url}
                                        alt="Image"
                                        style={{
                                          left: field.positionX,
                                          top: field.positionY,
                                          height: 60,
                                          transform: `scale(${field.size})`,
                                          transformOrigin: "top left",
                                          userSelect: "none",
                                        }}
                                      />
                                    ) : (
                                      console.log("blad")
                                    ),
                                  )
                                : console.log("blad")}
                          </div>
                        </>
                      );
                    },
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔹 Przyciski doładowania */}
      <div className="text-center mt-4">
        {hasMore ? (
          <button
            onClick={fetchCalendars}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Ładowanie..." : "Załaduj więcej"}
          </button>
        ) : (
          <p className="text-gray-500">Brak więcej kalendarzy.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarList;
