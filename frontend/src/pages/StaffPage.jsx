import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { getBottomSectionBackground } from "../utils/getBottomSectionBackground"; 
import { getYearPositionStyles } from "../utils/getYearPositionStyles";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;
const months = ["Grudzień", "Styczeń", "Luty"]; 

/* ================= POMOCNICY ================= */
const getStatusStyle = (status) => {
    switch (status) {
        case "draft":
        case "to_produce":
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

const LoadingSpinner = () => (
    <div className="flex items-center justify-center w-full h-32">
        <div className="w-16 h-16 border-4 border-t-[#afe5e6] border-b-[#6d8f91] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
    </div>
);

/* ================= CALENDAR PREVIEW ================= */
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
                ...res.data.results.filter(
                    (n) => !prev.some((p) => p.id === n.id)
                ),
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
        fetchProductions();
    }, [fetchProductions]);

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

    const updateProductionStatus = useCallback(async (productionId, newStatus, actionDescription) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        setIsUpdatingId(productionId);

        try {
            const res = await axios.patch(
                `${apiUrl}/production-staff/${productionId}/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProductions(prev =>
                prev.map(p =>
                    p.id === productionId ? res.data : p
                )
            );

            alert(`Sukces: Pozycja ID ${productionId} została ${actionDescription}.`);
            setExpandedId(null); 

        } catch (err) {
            console.error(`Błąd podczas ${actionDescription}:`, err);
            alert(`Nie udało się wykonać akcji (${actionDescription}).`);
        } finally {
            setIsUpdatingId(null);
        }
    }, []);

    const handleAccept = (item) => updateProductionStatus(item.id, "in_production", "zaakceptowana i włączona do produkcji");
    const handleReadyForPrint = (item) => updateProductionStatus(item.id, "archived", "przygotowana do druku (archived)");
    const handlePrint = (item) => updateProductionStatus(item.id, "done", "wysłana do druku");
    const handleReject = (item) => {
        if (!window.confirm("Czy na pewno chcesz ODRZUCIĆ tę pozycję?")) return;
        updateProductionStatus(item.id, "rejected", "odrzucona");
    };

    return (
        <div className="mt-8 bg-[#2a2b2b] p-8 rounded-xl max-w-[1400px] mx-auto text-white shadow-2xl">
            <h1 className="text-4xl font-extrabold mb-6 text-[#afe5e6]">Panel Zarządzania Produkcją ⚙️</h1>
            <p className="text-gray-400 mb-8">Zarządzaj statusami, upscalingiem i wysyłką do druku kalendarzy.</p>

            <div className="space-y-4">
                {productions.length === 0 && !loading && (
                    <div className="text-gray-400">Brak pozycji do zarządzania.</div>
                )}
                
                {productions.map((item) => {
                    const isExpanded = expandedId === item.id;
                    const calendarData = fullCalendarData[item.id];
                    const isLoading = loadingCalendarId === item.id;
                    const isUpdating = isUpdatingId === item.id;
                    const statusText = item.status || "draft";

                    return (
                        <div key={item.id} className="bg-[#1e1f1f] rounded-xl border border-[#3c3d3d] overflow-hidden transition-all duration-300">
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
                                
                                <div className={`py-1 px-3 rounded-full text-sm font-semibold ml-4 ${getStatusStyle(statusText)}`}>
                                    {statusText.toUpperCase()}
                                </div>

                                <span className="text-2xl text-[#afe5e6] ml-4">
                                    {isExpanded ? "▲" : "▼"}
                                </span>
                            </div>

                            {isExpanded && (
                                <div className="p-6 flex flex-col md:flex-row gap-6 bg-[#2a2b2b] border-t border-[#3c3d3d]">
                                    <div className="md:w-1/3 flex justify-center items-center p-2">
                                        {isLoading ? (
                                            <LoadingSpinner />
                                        ) : (
                                            calendarData ? (
                                                <CalendarPreview calendar={calendarData} />
                                            ) : (
                                                <div className="text-red-400">Brak podglądu</div>
                                            )
                                        )}
                                    </div>

                                    <div className="md:w-2/3 space-y-4">
                                        <h3 className="text-2xl font-bold text-[#afe5e6] mb-2">Informacje i Akcje</h3>

                                        <div className="flex flex-wrap gap-6 p-4 bg-[#1e1f1f] rounded-lg shadow-inner">
                                            <div>
                                                <div className="text-sm text-gray-400">Ilość:</div>
                                                <div className="text-xl font-bold">{item.quantity} szt.</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-400">Termin Realizacji:</div>
                                                <div className="text-xl font-bold">
                                                    {item.deadline || "Nieokreślony"}
                                                </div>
                                            </div>
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

                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-[#3c3d3d]">
                                            {isUpdating ? (
                                                <div className="text-lg text-yellow-500 font-semibold flex items-center">
                                                    <LoadingSpinner /> Trwa aktualizacja statusu...
                                                </div>
                                            ) : (
                                                <>
                                                    {(statusText === "draft" || statusText === "to_produce") && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleAccept(item); }}
                                                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
                                                        >
                                                            ✅ Przenieś na W PRODUKCJI
                                                        </button>
                                                    )}

                                                    {statusText === "in_production" && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleReadyForPrint(item); }}
                                                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
                                                        >
                                                            ⬆️ Oznacz jako GOTOWE DO DRUKU (Archived)
                                                        </button>
                                                    )}

                                                    {statusText === "archived" && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handlePrint(item); }}
                                                            className="bg-cyan-600 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition font-semibold"
                                                        >
                                                            🖨️ Oznacz jako ZAKOŃCZONE (Done)
                                                        </button>
                                                    )}

                                                    {(statusText !== "done" && statusText !== "rejected") && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleReject(item); }}
                                                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
                                                        >
                                                            ❌ Odrzuć (Rejected)
                                                        </button>
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
                <div className="text-center text-gray-400 mt-6">Ładowanie kolejnych pozycji...</div>
            )}

            {!hasMore && productions.length > 0 && (
                <div className="text-center text-gray-400 mt-6">Wszystkie pozycje zostały załadowane.</div>
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

export default StaffProductionList;
