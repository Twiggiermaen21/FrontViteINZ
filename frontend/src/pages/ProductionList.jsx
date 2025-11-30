import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground";
import { getYearPositionStyles } from "../utils/getYearPositionStyles";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;
const months = ["Grudzień", "Styczeń", "Luty"]; 

// Mapowanie angielskich statusów na polskie (DODANE/ZAKTUALIZOWANE)
const STATUS_MAP = {
    "draft": "PROJEKT",
    "rejected": "ODRZUCONY",
    "to_produce": "DO PRODUKCJI",
    "in_production": "W TRAKCIE",
    "done": "GOTOWY",
    "archived": "ARCHIWUM",
    "Nieokreślony": "BRAK STATUSU",
    "waiting":"OCZEKIWANIE NA AKCEPTACJĘ"
};

/* ================= PREVIEW KALENDARZA (BEZ ZMIAN) ================= */
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
            const isImage = "path" in field;

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
                    ? <img src={field.path} alt="Pole graficzne" className="h-8 w-full object-contain mx-auto" />
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
  const [loadingMore, setLoadingMore] = useState(false); 
  const [expandedId, setExpandedId] = useState(null);
  const [fullCalendarData, setFullCalendarData] = useState({});
  const [loadingCalendarId, setLoadingCalendarId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(null); 

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

  /* ===== FUNKCJA RESETUJĄCA STAN I ODPALAJĄCA POBIERANIE OD NOWA (BEZ ZMIAN) ===== */
  const resetAndRefetchProductions = useCallback(() => {
    setProductions([]);
    setPage(1);
    setHasMore(true);
    setFullCalendarData({});
    setExpandedId(null);
  }, []); 

  /* ===== POBIERANIE PRODUKCJI (BEZ ZMIAN W LOGICE) ===== */
  const fetchProductions = useCallback(async (reset = false) => {
    if (!hasMore && !reset || loadingMore) return;

    const targetPage = reset ? 1 : page;
    const currentProductions = reset ? [] : productions;


    setLoadingMore(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/production/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: targetPage },
      });

      setProductions((prev) => 
        reset 
          ? res.data.results
          : [...prev, ...res.data.results.filter(
              (n) => !prev.some((p) => p.id === n.id)
            )]
      );
      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);

    } catch (err) {
      console.error("Błąd listy produkcji:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, page, productions]);

  useEffect(() => {
    // Pierwsze ładowanie listy produkcji
    if(page === 1 && productions.length === 0 && !loadingMore && hasMore){
      fetchProductions();
    }
  }, [fetchProductions, page, productions.length, loadingMore, hasMore]);


  /* ===== ANULOWANIE PRODUKCJI (BEZ ZMIAN W LOGICE) ===== */
  const cancelProduction = useCallback(async (productionId) => {
    // Dodatkowy pop-up potwierdzający
    if (!window.confirm("Czy na pewno chcesz anulować tę pozycję z produkcji? Kalendarz pozostanie nienaruszony.")) {
        return;
    }

    setIsCancelling(productionId);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      // Używamy metody DELETE na endpoint /production-delete/{id}/
      await axios.delete(`${apiUrl}/production-delete/${productionId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Sukces: Usuwamy pozycję z lokalnego stanu (bez przeładowania całej strony)
      setProductions(prev => prev.filter(item => item.id !== productionId));
      setExpandedId(null); 
      
      alert("Produkcja została pomyślnie anulowana.");

    } catch (err) {
      console.error("Błąd anulowania produkcji:", err);
      // Sprawdzenie statusu błędu dla lepszej informacji
      const errorMessage = err.response?.data?.detail || "Wystąpił nieznany błąd podczas anulowania.";
      alert(`Błąd: ${errorMessage}`);
    } finally {
      setIsCancelling(null);
    }
  }, [/* pusta lista zależności, ponieważ resetAndRefetchProductions zostało usunięte z tej funkcji, aby była szybsza. */]);

  /* ===== ROZWIJANIE POZYCJI (BEZ ZMIAN) ===== */
  const toggleExpand = async (item) => {
    if (expandedId === item.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(item.id);

    if (fullCalendarData[item.id]) return; 

    setLoadingCalendarId(item.id);

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
    
  // --- Funkcja pomocnicza do kolorowania statusu (BEZ ZMIAN w kolorach, ale statusy są kluczami) ---
 const getStatusStyle = (status) => {
    switch (status) {
        case "draft":
        case "to_produce":
            return "bg-yellow-600/50 text-yellow-300";
case "waiting":
            return "bg-yellow-600/50 text-yellow-300";
        case "in_production":
            return "bg-blue-600/50 text-blue-300";
        case "done":
            return "bg-green-600/50 text-green-300";
        case "archived":
            return "bg-cyan-600/50 text-cyan-300";
        case "rejected":
            return "bg-red-600/50 text-red-300"; 
        default:
            return "bg-gray-600/50 text-gray-400";
    }
};


  return (
    <div className="mt-8 bg-[#2a2b2b] p-8 rounded-xl  mx-auto text-white">
    <h1 className="text-4xl font-extrabold mb-6 text-[#afe5e6]">Lista Produkcji</h1>

      <div className="space-y-4">
          {/* WARUNEK DLA PUSTEJ LISTY PRODUKCJI */}
          {!loadingMore && productions.length === 0 && (
              <p className="text-lg text-center text-gray-400 py-10">
                  Nie ma żadnych pozycji w realizacji.
              </p>
          )}

        {productions.map((item) => {
          const isExpanded = expandedId === item.id;
          const calendarData = fullCalendarData[item.id];
          const isLoadingCalendar = loadingCalendarId === item.id;
          const isCurrentlyCancelling = isCancelling === item.id;
            // Użycie klucza statusu z serwera, ale wyświetlenie polskiej wartości
          const englishStatusKey = item.status || "Nieokreślony";
            const polishStatusText = STATUS_MAP[englishStatusKey] || STATUS_MAP["Nieokreślony"];


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
                
                {/* Status zamówienia w nagłówku - WYŚWIETLANIE POLSKIEJ NAZWY */}
                <div className={`py-1 px-3 rounded-full text-sm font-semibold ml-4 ${getStatusStyle(englishStatusKey)}`}>
                    {polishStatusText}
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
                    {isLoadingCalendar ? (
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

                      {/* PRZYCISK ANULOWANIA */}
{item.status !== "done" && (

 <div className="pt-4 border-t border-[#3c3d3d]">
                          <button
                            onClick={() => cancelProduction(item.id)}
                            className="bg-red-700 text-white px-6 py-2 rounded font-semibold hover:bg-red-600 transition disabled:bg-red-900 disabled:cursor-not-allowed flex items-center"
                            disabled={isCurrentlyCancelling}
                          >
                            {isCurrentlyCancelling && (
                              <div className="w-4 h-4 mr-2 border-2 border-t-white border-b-gray-400 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                            )}
                            Anuluj Produkcję
                          </button>
                          <p className="text-xs text-gray-400 mt-2">
                            Spowoduje to usunięcie pozycji tylko z listy produkcji, projekt kalendarza pozostanie w bazie.
                          </p>
                      </div>

) }
                     
                      
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {loadingMore && (
        <p className="text-center text-gray-400 mt-6">
          Ładowanie kolejnych pozycji...
        </p>
      )}

      {!hasMore && productions.length > 0 && (
        <p className="text-center text-gray-400 mt-6">
          Wszystkie pozycje zostały załadowane.
        </p>
      )}

      {hasMore && !loadingMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => fetchProductions()} 
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