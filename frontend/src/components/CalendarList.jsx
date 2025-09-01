import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getYearPositionStyles } from "../utils/getYearPositionStyles";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const CalendarList = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const months = ["Grudzień", "Styczeń", "Luty"];
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      try {
        const response = await axios.get(`${apiUrl}/calendars/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCalendars(response.data);
      } catch (err) {
        console.error("Błąd podczas pobierania danych:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log("Calendars fetched:", calendars);

  const scrollLeft = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: -372 * 2, behavior: "smooth" }); // przewijanie o 2 elementy
  };

  const scrollRight = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: 372 * 2, behavior: "smooth" });
  };

  if (loading) return <p>Ładowanie kalendarzy...</p>;

  return (
    <div className="relative w-full max-w-[1512px] mx-auto">
      {/* Strzałka w lewo */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
      >
        <ChevronLeft />
      </button>

      {/* Przewijalny wrapper z ograniczoną szerokością */}
      <div className="overflow-hidden px-12">
        <div
          ref={scrollRef}
          className="flex gap-6 transition-all duration-300 ease-in-out overflow-x-auto scrollbar-hide"
        >
          {calendars === null || calendars.length === 0 ? (
            <p>Brak dostępnych kalendarzy.</p>
          ) : (
            calendars.map((calendar) => (
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
                    <span className="text-gray-500">Brak grafiki nagłówka</span>
                  )}
                </div>

                {/* Bottom */}
                <div
                  className="h-[720px] px-3 py-4 flex flex-col  items-center text-center"
                  style={getBottomSectionBackground({
                    style:
                      calendar.bottom?.content_type_id === 26
                        ? "style1"
                        : calendar.bottom?.content_type_id === 27
                        ? "style2"
                        : calendar.bottom?.content_type_id === 28
                        ? "style3"
                        : null,
                    bgColor: calendar.bottom?.color ??  calendar.bottom?.start_color,
                    gradientEndColor: calendar.bottom?.end_color,
                    gradientTheme: calendar.bottom?.theme,
                    gradientStrength: calendar.bottom?.strength,
                    gradientVariant: calendar.bottom?.direction,
                    backgroundImage: calendar.bottom?.image,
                  })}
                >
                  {[calendar.field1, calendar.field2, calendar.field3].map(
                    (field) => {
                      if (!field) return null; // jeśli pole jest null

                      const isText = "text" in field;
                      const isImage = "path" in field;

                      return (
                        <div className="w-full border rounded bg-white shadow p-2 flex flex-col items-center">
                          <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide mb-1">
                            {isText
                              ? field.text
                              : isImage
                              ? "Obrazek"
                              : "Nieznany typ"}
                          </h3>
                          <div className="w-full h-[85px] text-sm text-gray-600 flex items-center justify-center">
                            {isText
                              ? `[Pole tekstowe]`
                              : isImage
                              ? `[Obrazek]`
                              : `[Nieznany typ]`}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Strzałka w prawo */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default CalendarList;
