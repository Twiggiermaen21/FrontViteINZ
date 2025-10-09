import React, { useState } from "react";
import { useCalendars } from "../utils/useCalendars";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";

const EditCalendar = () => {
  const { calendars, loading } = useCalendars();
  console.log("Calendars loaded:", calendars);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
const months = ["Grudzień", "Styczeń", "Luty"];
  return (
    <div className="flex w-full  max-w-[1812px] mx-auto mt-8 bg-[#2a2b2b] rounded-4xl shadow-lg overflow-hidden">
      {/* Lewa kolumna */}
      <div className="w-1/3 bg-[#1f2020] border-r border-gray-700 p-6 overflow-y-auto custom-scroll">
        <h2 className="text-2xl font-bold text-white mb-4">
          Wybierz kalendarz
        </h2>

        {loading ? (
          <p className="text-gray-400">Ładowanie...</p>
        ) : calendars.length === 0 ? (
          <p className="text-gray-400">Brak kalendarzy.</p>
        ) : (
          <ul className="space-y-2">
            {calendars.map((calendar) => (
              <li
                key={calendar.id}
                onClick={() => setSelectedCalendar(calendar)}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedCalendar?.id === calendar.id
                    ? "bg-blue-600 text-white"
                    : "bg-[#2f3131] hover:bg-[#3a3d3d] text-gray-200"
                }`}
              >
                {calendar.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Prawa kolumna */}
      <div className="flex-1 bg-[#2a2b2b] p-4 overflow-y-auto custom-scroll">
        {!selectedCalendar ? (
          <p className="text-gray-400 text-lg">
            Wybierz kalendarz z listy po lewej, aby rozpocząć edycję.
          </p>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Edycja: {selectedCalendar.name}
            </h1>
            <div
              className="max-w-[272px]  bg-white border rounded shadow"
            >
              <div className="relative h-[152px] bg-gray-200 flex items-center justify-center overflow-hidden">
                {selectedCalendar.top_image_url ? (
                  <img
                    src={selectedCalendar.top_image_url}
                    alt="Nagłówek"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Brak grafiki nagłówka</span>
                )}
              </div>

              <div
                className="h-[644px] px-3 py-4 flex flex-col items-center text-center"
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
                    const key = `${selectedCalendar.id}-${index}`; // unikalny key dla pola w kalendarzu

                        const isText = "text" in field;
                        const isImage = "path" in field;

                        return (
                          <>
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
                            </div>
                            <div className="text-xl font-bold text-blue-700 uppercase tracking-wide mt-2">
                              {isText
                                ? field.text
                                : isImage
                                ? selectedCalendar.images_for_fields
                                    .filter(
                                      (img) => img.field_number === index + 1
                                    )
                                    .map((img) => (
                                      <img
                                        key={`${selectedCalendar.id}-${index}-${img.id}`} // unikalny key
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
                          </>
                        );
                      }
                    )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCalendar;
