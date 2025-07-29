import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const CalendarList = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      try {
        const response = await axios.get(`${apiUrl}/calendars/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCalendars(response.data.calendars);
      } catch (err) {
        console.error("Błąd podczas pobierania danych:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBottomStyle = (calendar) => {
    if (calendar.bottom_type === "color" && calendar.bottom_color) {
      return { backgroundColor: calendar.bottom_color };
    }

    if (
      calendar.bottom_type === "gradient" &&
      calendar.gradient_start_color &&
      calendar.gradient_end_color
    ) {
      return {
        background: `linear-gradient(${calendar.gradient_direction || "to bottom"}, ${calendar.gradient_start_color}, ${calendar.gradient_end_color})`,
      };
    }

    if (calendar.bottom_type === "image" && calendar.bottom_image_url) {
      return {
        background: `url(${calendar.bottom_image_url}) center/cover no-repeat`,
        color: "white",
      };
    }

    return {};
  };

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
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className="w-[372px] h-[972px] bg-white border rounded overflow-hidden shadow shrink-0"
            >
              {/* Header */}
              <div className="h-[252px] bg-gray-200 flex items-center justify-center">
                {calendar.top_image ? (
                  <img
                    src={calendar.top_image_url}
                    alt="Nagłówek"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Brak grafiki nagłówka</span>
                )}
              </div>

              {/* Bottom */}
              <div
                className="h-[720px] px-3 py-4 flex flex-col gap-28 items-center text-center"
                style={getBottomStyle(calendar)}
              >
                {["Grudzień", "Styczeń", "Luty"].map((month) => (
                  <div
                    key={month}
                    className="w-full border rounded bg-white shadow p-2 flex flex-col items-center"
                  >
                    <h3 className="text-xl font-bold text-blue-700 uppercase tracking-wide mb-1">
                      {month}
                    </h3>
                    <div className="w-full h-[85px] text-sm text-gray-600 flex items-center justify-center">
                      [Siatka dni dla {month}]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
