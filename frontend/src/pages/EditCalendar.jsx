import React, { useState } from "react";
import { useCalendars } from "../utils/useCalendars";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";

const EditCalendar = () => {
  const { calendars, loading, scrollRef } = useCalendars();
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const months = ["Grudzień", "Styczeń", "Luty"];
  console.log(calendars);
  return (
    <div className="flex gap-6 w-full max-w-[1812px] mx-auto mt-4 ">
      {/* 🩶 Lewa kolumna z przewijaną listą */}
      <div className="w-[26%] bg-[#2a2b2b] rounded-4xl p-4 shadow-lg mt-4 border-r border-gray-700  flex flex-col">

        <h2 className="text-xl font-bold text-white mb-4">Wybierz kalendarz</h2>

        {/* 🔹 Scroll tylko na liście kalendarzy */}
        <div
          className="overflow-y-auto custom-scroll max-h-[80vh] pr-2"
          ref={scrollRef}
        >
          {loading && calendars.length === 0 ? (
            <p className="text-gray-400">Ładowanie...</p>
          ) : calendars.length === 0 ? (
            <p className="text-gray-400">Brak dostępnych kalendarzy.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {calendars.map((calendar) => {
                const isActive = selectedCalendar?.id === calendar.id;

                return (
                  <li
                    key={calendar.id}
                    className={`p-3 rounded-lg bg-[#2f3131] hover:bg-[#3a3d3d] text-gray-200 cursor-pointer transition" 
        ${
          isActive
            ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-semibold"
            : "text-[#d2e4e2] hover:bg-[#374b4b] hover:text-white"
        }`}
                    onClick={() => setSelectedCalendar(calendar)}
                  >
                    <h1 className="text-lg">{calendar.name}</h1>
                  </li>
                );
              })}
            </ul>
          )}

          {loading && calendars.length > 0 && (
            <p className="text-gray-500 text-sm mt-3 text-center">
              Ładowanie kolejnych...
            </p>
          )}
        </div>
      </div>

      {/* 🩵 Prawa kolumna — bez scrolla */}
      <div className="flex-1 bg-[#2a2b2b] rounded-4xl mt-4  p-8 flex justify-center items-start">
        {!selectedCalendar ? (
          <p className="text-gray-400 text-lg">
            Wybierz kalendarz z listy po lewej, aby rozpocząć edycję.
          </p>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-1xl font-bold text-white mb-2">
              Edycja: {selectedCalendar.name}
            </h1>

            {/* 📅 Podgląd kalendarza */}
            <div className="max-w-[272px] bg-white border rounded-lg shadow overflow-hidden">
              <div className="relative h-[152px] bg-gray-200 flex items-center justify-center">
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
                {[
                  selectedCalendar.field1,
                  selectedCalendar.field2,
                  selectedCalendar.field3,
                ].map((field, index) => {
                  if (!field) return null;
                  const key = `${selectedCalendar.id}-${index}`;
                  const isText = "text" in field;
                  const isImage = "path" in field;

                  return (
                    <div key={key} className="w-full mb-3">
                      <div className="w-full border rounded bg-white shadow p-2 flex flex-col items-center">
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
                              .filter((img) => img.field_number === index + 1)
                              .map((img) => (
                                <img
                                  key={`${selectedCalendar.id}-${index}-${img.id}`}
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
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCalendar;
