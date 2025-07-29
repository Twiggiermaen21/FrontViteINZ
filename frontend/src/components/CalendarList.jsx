import React, { useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const CalendarList = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendars = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      try {
        const response = await axios.get(`${apiUrl}/calendars/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Pobrane kalendarze:", response.data);
        setCalendars(response.data);
      } catch (err) {
        console.error("Błąd podczas pobierania kalendarzy:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendars();
  }, []);

  if (loading) return <p>Ładowanie kalendarzy...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {calendars.map((calendar) => (
        <div
          key={calendar.id}
          className="rounded-xl shadow p-4 border bg-white space-y-2"
        >
          <h3 className="text-lg font-semibold">Kalendarz #{calendar.id}</h3>

          {/* Top image */}
          {calendar.top_image?.url && (
            <img
              src={calendar.top_image.url}
              alt="Top"
              className="w-full rounded-md"
            />
          )}

          {/* Bottom image / color / gradient info */}
          {calendar.bottom_type === "image" && calendar.bottom_image?.url && (
            <img
              src={calendar.bottom_image.url}
              alt="Bottom"
              className="w-full rounded-md"
            />
          )}

          {calendar.bottom_type === "color" && calendar.bottom_color && (
            <div
              className="w-full h-16 rounded-md"
              style={{ backgroundColor: calendar.bottom_color }}
            />
          )}

          {calendar.bottom_type === "gradient" &&
            calendar.gradient_start_color &&
            calendar.gradient_end_color && (
              <div
                className="w-full h-16 rounded-md"
                style={{
                  background: `linear-gradient(${calendar.gradient_direction || "to bottom"
                    }, ${calendar.gradient_start_color}, ${calendar.gradient_end_color})`,
                }}
              />
            )}

          {calendar.bottom_type === "theme-gradient" && calendar.gradient_theme && (
            <p className="text-sm text-gray-600">
              Motyw gradientu: {calendar.gradient_theme}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CalendarList;
