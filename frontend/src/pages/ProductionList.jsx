import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";
import { getYearPositionStyles } from "../utils/getYearPositionStyles";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;
const months = ["Grudzień", "Styczeń", "Luty"]; 

/* ================= PREVIEW KALENDARZA (BEZ ZMIAN) ================= */
// Upewniam się, że ta sekcja poprawnie obsługuje obrazki/tekst (tak jak w poprzednich wersjach)
const CalendarPreview = ({ calendar }) => {
  if (!calendar) return null;

  return (
    <div className="w-[221px] bg-white border rounded shadow-lg">
      <div className="relative h-[152px] bg-gray-200 flex items-center justify-center overflow-hidden">
        {calendar.top_image ? (
          <img
            src={calendar.top_image_url}
            alt="Nagłówek"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Brak nagłówka</span>
        )}

        {calendar?.year_data && (
          <span
            style={{
              position: "absolute",
              color: calendar.year_data.color,
              fontSize: `${calendar.year_data.size}px`,
              fontWeight: calendar.year_data.weight,
              fontFamily: calendar.year_data.font,
              ...getYearPositionStyles({
                coords: {
                  x: calendar.year_data.positionX,
                  y: calendar.year_data.positionY,
                },
              }),
            }}
          >
            {calendar.year_data.text}
          </span>
        )}
      </div>

      <div
        className="px-2 py-2"
        style={getBottomSectionBackground({
          style:
            calendar.bottom?.content_type_id === 26
              ? "style1"
              : calendar.bottom?.content_type_id === 27
              ? "style2"
              : "style3",
          bgColor: calendar.bottom?.color,
          gradientEndColor: calendar.bottom?.end_color,
        })}
      >
        {[calendar.field1, calendar.field2, calendar.field3].map(
          (field, index) => {
            if (!field) return null;
            const isText = "text" in field;
            const isImage = "path" in field; // Zakładamy, że path oznacza obrazek

            return (
              <div
                key={index}
                className="bg-white rounded p-1 mb-2 text-center"
              >
                <h3 className="text-xs font-bold uppercase mb-1">
                  {months[index]}
                </h3>
                <div className="text-xs text-gray-700">
                  {isText
                    ? field.text
                    : isImage
                    ? // Uproszczone wyświetlanie image URL, zakładając, że to pole ma URL
                      <img src={field.path} alt="Pole graficzne" className="h-8 w-full object-contain mx-auto" />
                    : null
                  }
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};


/* ================= LISTA PRODUKCJI (ZMODYFIKOWANA) ================= */

const ProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [fullCalendarData, setFullCalendarData] = useState({});
  const [loadingCalendarId, setLoadingCalendarId] = useState(null);

  /* ===== POBIERANIE KALENDARZA PO ID (BEZ ZMIAN) ===== */
  const fetchCalendarById = useCallback(async (calendarId) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await axios.get(`${apiUrl}/calendar/${calendarId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      return res.data;
    } catch (err) {
      console.error("Błąd pobierania kalendarza:", err);
      return null;
    }
  }, []);

  /* ===== POBIERANIE PRODUKCJI (BEZ ZMIAN) ===== */
  const fetchProductions = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/production/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page },
      });

      setProductions((prev) => [
        ...prev,
        ...res.data.results.filter(
          (n) => !prev.some((p) => p.id === n.id)
        ),
      ]);
      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd listy produkcji:", err);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    fetchProductions();
  }, [fetchProductions]);

  /* ===== ROZWIJANIE POZYCJI (BEZ ZMIAN) ===== */
  const toggleExpand = async (item) => {
    if (expandedId === item.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(item.id);

    // item.calendar to jest ID kalendarza z serlizera CalendarProductionSerializer
    if (fullCalendarData[item.id]) return; 

    setLoadingCalendarId(item.id);

    // Zakładamy, że item.calendar zawiera ID kalendarza, a nie cały obiekt, jak w poprzednich założeniach
    const calendarIdToFetch = item.calendar; 
    const fullCalendar = await fetchCalendarById(calendarIdToFetch);

    if (fullCalendar) {
      setFullCalendarData((prev) => ({
        ...prev,
        [item.id]: fullCalendar,
      }));
    }

    setLoadingCalendarId(null);
  };
    
  // --- Funkcja pomocnicza do kolorowania statusu ---
  const getStatusStyle = (status) => {
      switch (status) {
          case "oczekujące":
              return "bg-yellow-600/50 text-yellow-300";
          case "w trakcie":
              return "bg-blue-600/50 text-blue-300";
          case "gotowe":
              return "bg-green-600/50 text-green-300";
          default:
              return "bg-gray-600/50 text-gray-400";
      }
  }


  return (
    <div className="mt-8 bg-[#2a2b2b] p-8 rounded-xl max-w-[1200px] mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Lista Produkcji</h1>

      <div className="space-y-4">
        {productions.map((item) => {
          const isExpanded = expandedId === item.id;
          const calendarData = fullCalendarData[item.id];
          const isLoading = loadingCalendarId === item.id;
          const statusText = item.status || "Nieokreślony"; // Zakładamy pole 'status'

          return (
            <div key={item.id} className="bg-[#1e1f1f] rounded-xl border border-[#3c3d3d] overflow-hidden">
              {/* HEADER (Nazwa + Status) */}
              <div
                onClick={() => toggleExpand(item)}
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#3c3d3d]/50 transition duration-150"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold truncate">
                    {item.calendar_name || "Brak nazwy kalendarza"}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Utworzono: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Status zamówienia w nagłówku */}
                <div className={`py-1 px-3 rounded-full text-sm font-semibold ml-4 ${getStatusStyle(statusText)}`}>
                    {statusText.toUpperCase()}
                </div>

                <span className="text-2xl text-[#afe5e6] ml-4">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>

              {/* SZCZEGÓŁY (Rozwijane) */}
              {isExpanded && (
                <div className="p-6 flex flex-col md:flex-row gap-6 bg-[#2a2b2b] border-t border-[#3c3d3d]">
                  {/* Lewa kolumna: Podgląd */}
                  <div className="md:w-1/3 flex justify-center items-center">
                    {isLoading ? (
                      <div className="flex items-center justify-center w-full h-32">
                        <div className="w-16 h-16 border-4 border-t-[#afe5e6] border-b-[#6d8f91] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      calendarData ? (
                        <CalendarPreview calendar={calendarData} />
                      ) : (
                        <p className="text-red-400">Brak podglądu</p>
                      )
                    )}
                  </div>

                  {/* Prawa kolumna: Szczegóły produkcji */}
                  <div className="md:w-2/3 space-y-4">
                        <h3 className="text-2xl font-bold mb-2">Szczegóły Zamówienia</h3>

                        {/* Ilość i Termin */}
                        <div className="flex gap-6 p-3 bg-[#1e1f1f] rounded-lg">
                            <div>
                                <p className="text-sm text-gray-400">Ilość:</p>
                                <p className="text-lg font-bold text-[#afe5e6]">
                                    {item.quantity} szt.
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Termin Realizacji:</p>
                                <p className="text-lg font-bold">
                                    {item.deadline || "Nieokreślony"}
                                </p>
                            </div>
                        </div>

                        {/* Notatka Produkcyjna */}
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Notatka dla produkcji:</p>
                            <p className="bg-[#1e1f1f] p-4 rounded-lg whitespace-pre-wrap italic">
                                {item.production_note || "Brak notatki od klienta/projektanta."}
                            </p>
                        </div>

                       
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="text-center text-gray-400 mt-6">
          Ładowanie kolejnych pozycji...
        </p>
      )}

      {!hasMore && productions.length > 0 && (
        <p className="text-center text-gray-400 mt-6">
          Wszystkie pozycje zostały załadowane.
        </p>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={fetchProductions}
            className="bg-[#afe5e6] text-black px-6 py-3 rounded font-semibold hover:bg-[#92c5c6] transition"
          >
            Załaduj więcej
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductionList;