import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import CalendarPreview from "../components/browseCalendarElements/CalendarPreview";
// Importujemy helpery (upewnij się, że plik productionHelpers.js istnieje w utils)
import { MONTHS, STATUS_MAP} from "../constants";
import {getStatusStyle} from "../utils/getStatusStyle";
const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-32">
    <div className="w-16 h-16 border-4 border-t-[#afe5e6] border-b-[#6d8f91] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
  </div>
);


/* ================= STAFF PRODUCTION LIST ================= */
const StaffProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [fullCalendarData, setFullCalendarData] = useState({});
  const [loadingCalendarId, setLoadingCalendarId] = useState(null);
  const [isUpdatingId, setIsUpdatingId] = useState(null);

  const fetchCalendarById = useCallback(async (calendarId) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await axios.get(`${apiUrl}/calendarByIdStaff/${calendarId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Błąd pobierania kalendarza:", err);
      return null;
    }
  }, []);

  const fetchProductions = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/production-staff/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page },
      });

      setProductions((prev) => [
        ...prev,
        ...res.data.results.filter((n) => !prev.some((p) => p.id === n.id)),
      ]);
      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd listy produkcji (STAFF):", err);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    if (page === 1 && productions.length === 0 && !loading && hasMore) {
      fetchProductions();
    }
  }, [fetchProductions, page, productions.length, loading, hasMore]);

  const toggleExpand = async (item) => {
    if (expandedId === item.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(item.id);

    if (fullCalendarData[item.id]) return;

    setLoadingCalendarId(item.id);
    const fullCalendar = await fetchCalendarById(item.calendar);

    if (fullCalendar) {
      setFullCalendarData((prev) => ({
        ...prev,
        [item.id]: fullCalendar,
      }));
    }

    setLoadingCalendarId(null);
  };

  const updateProductionStatus = useCallback(
    async (productionId, newStatus, actionDescription) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      setIsUpdatingId(productionId);

      try {
        const res = await axios.patch(
          `${apiUrl}/production-staff/${productionId}/`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProductions((prev) =>
          prev.map((p) => (p.id === productionId ? res.data : p))
        );

        alert(`Sukces: Pozycja ID ${productionId} została ${actionDescription}.`);
        setExpandedId(null);
      } catch (err) {
        console.error(`Błąd podczas ${actionDescription}:`, err);
        const errorMessage = err.response?.data?.detail || "Wystąpił nieznany błąd.";
        alert(`Nie udało się wykonać akcji (${actionDescription}). Błąd: ${errorMessage}`);
      } finally {
        setIsUpdatingId(null);
      }
    },
    []
  );

  const handleAccept = async (item) => {
    // 1. Aktualizacja statusu
    updateProductionStatus(item.id, "in_production", "zaakceptowana i włączona do produkcji");
    
    // 2. Wysłanie requestu o wydruk (generowanie)
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const res = await axios.post(
        `${apiUrl}/calendar-print/`,
        { id_kalendarz: item.calendar },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Błąd CalendarPrint:", error.response || error.message);
    }
  };

  const handleReadyForPrint = (item) =>
    updateProductionStatus(item.id, "archived", "przygotowana do druku (archived)");

  const handlePrint = (item) =>
    updateProductionStatus(item.id, "done", "wysłana do druku");

  const handleReject = (item) => {
    if (!window.confirm("Czy na pewno chcesz ODRZUCIĆ tę pozycję?")) return;
    updateProductionStatus(item.id, "rejected", "odrzucona");
  };

  return (
    <div className="mt-8 bg-[#2a2b2b] p-8 rounded-xl mx-auto text-white shadow-2xl">
      {/* Style dla scrollbara */}
     

      <h1 className="text-4xl font-extrabold mb-6 text-[#afe5e6]">
        Panel Zarządzania Produkcją
      </h1>
      <p className="text-gray-400 mb-8">
        Zarządzaj statusami, upscalingiem i wysyłką do druku kalendarzy.
      </p>

      {/* Kontener scrollowania - max 800px wysokości */}
      <div className="max-h-[600px] overflow-y-auto custom-scroll pr-4">
        <div className="space-y-4">
          {productions.length === 0 && !loading && (
            <p className="text-lg text-center text-gray-400 py-10">
              Brak pozycji do zarządzania.
            </p>
          )}

          {productions.map((item) => {
            const isExpanded = expandedId === item.id;
            const calendarData = fullCalendarData[item.id];
            const isLoading = loadingCalendarId === item.id;
            const isUpdating = isUpdatingId === item.id;

            const englishStatusKey = item.status || "Nieokreślony";
            const polishStatusText = STATUS_MAP[englishStatusKey] || STATUS_MAP["Nieokreślony"];

            return (
              <div
                key={item.id}
                className="bg-[#1e1f1f] rounded-xl border border-[#3c3d3d] overflow-hidden transition-all duration-300"
              >
                {/* HEADER */}
                <div
                  onClick={() => toggleExpand(item)}
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-[#3c3d3d]/50 transition duration-150"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-bold truncate">
                      {item.calendar_name || "Brak nazwy kalendarza"}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Utworzono: {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className={`py-1 px-3 rounded-full text-sm font-semibold ml-4 ${getStatusStyle(englishStatusKey)}`}>
                    {polishStatusText}
                  </div>

                  <span className="text-2xl text-[#afe5e6] ml-4">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>

                {/* SZCZEGÓŁY */}
                {isExpanded && (
                  <div className="p-6 flex flex-col md:flex-row gap-6 bg-[#2a2b2b] border-t border-[#3c3d3d]">
                    {/* Lewa kolumna: Podgląd */}
                    <div className="md:w-1/3 flex justify-center items-center p-2">
                      {isLoading ? (
                        <LoadingSpinner />
                      ) : calendarData ? (
                        <CalendarPreview calendar={calendarData} />
                      ) : (
                        <div className="text-red-400">Brak podglądu</div>
                      )}
                    </div>

                    {/* Prawa kolumna: Akcje */}
                    <div className="md:w-2/3 space-y-4">
                      <h3 className="text-2xl font-bold text-[#afe5e6] mb-2">
                        Informacje i Akcje
                      </h3>

                      <div className="flex flex-wrap gap-6 p-4 bg-[#1e1f1f] rounded-lg shadow-inner">
                        <div>
                          <div className="text-sm text-gray-400">Ilość:</div>
                          <div className="text-xl font-bold">{item.quantity} szt.</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Termin Realizacji:</div>
<div className="text-xl font-bold">
  {item.deadline 
    ? new Date(item.deadline).toLocaleDateString('pl-PL') 
    : "Nieokreślony"}
</div>                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Ostatnia zmiana:</div>
                          <div className="text-xl font-bold text-yellow-300">
                            {new Date(item.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="text-sm text-gray-400 mb-1">Notatka:</div>
                        <div className="bg-[#1e1f1f] p-4 rounded-lg whitespace-pre-wrap italic text-sm">
                          {item.production_note || "Brak notatki."}
                        </div>
                      </div>

                      {/* BUTTONY AKCJI */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-[#3c3d3d]">
                        {isUpdating ? (
                          <div className="text-lg text-yellow-500 font-semibold flex items-center">
                            <LoadingSpinner /> Trwa aktualizacja statusu...
                          </div>
                        ) : (
                          <>
                            {/* Akceptacja */}
                            {(englishStatusKey === "draft" ||
                              englishStatusKey === "to_produce" ||
                              englishStatusKey === "waiting") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAccept(item);
                                }}
                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                                disabled={isUpdating}
                              >
                                ✅ Akceptuj do produkcji
                              </button>
                            )}

                            {/* Gotowe do druku (Archiwum) */}
                            {englishStatusKey === "in_production" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReadyForPrint(item);
                                }}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                                disabled={isUpdating}
                              >
                                📦 Oznacz jako GOTOWE DO DRUKU (Archiwum)
                              </button>
                            )}

                            {/* Wysłano do druku (Gotowy) */}
                            {englishStatusKey === "archived" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrint(item);
                                }}
                                className="bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition font-semibold disabled:opacity-50"
                                disabled={isUpdating}
                              >
                                🚀 WYSŁANO DO DRUKU (Gotowy)
                              </button>
                            )}

                            {/* Odrzucenie */}
                            {englishStatusKey !== "done" && englishStatusKey !== "rejected" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(item);
                                }}
                                className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition font-semibold disabled:opacity-50"
                                disabled={isUpdating}
                              >
                                ❌ Odrzuć
                              </button>
                            )}

                            {englishStatusKey === "done" && (
                              <p className="text-green-500 font-bold">
                                Pozycja zakończona i wydrukowana.
                              </p>
                            )}
                            {englishStatusKey === "rejected" && (
                              <p className="text-red-500 font-bold">
                                Pozycja została odrzucona.
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {loading && (
          <p className="text-center text-gray-400 mt-6">Ładowanie kolejnych pozycji...</p>
        )}

        {!hasMore && productions.length > 0 && (
          <p className="text-center text-gray-400 mt-6">Wszystkie pozycje zostały załadowane.</p>
        )}

        {hasMore && !loading && (
          <div className="flex justify-center mt-6 pb-2">
            <button
              onClick={() => fetchProductions()}
              className="bg-[#afe5e6] text-black px-6 py-3 rounded font-semibold hover:bg-[#92c5c6] transition"
            >
              Załaduj więcej
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffProductionList;