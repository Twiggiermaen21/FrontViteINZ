import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";
import { useOutletContext } from "react-router-dom";
import CalendarDetailsModal from "../components/browseCalendarElements/ModalSelectedCalendar.jsx";
import CalendarPreview from "../components/browseCalendarElements/CalendarPreview.jsx";
const apiUrl = `${import.meta.env.VITE_API_URL}/api`;


const BrowseCalendars = () => {
  const selectedProject = useOutletContext() ?? {};
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [deadline, setDeadline] = useState("");
  const [note, setNote] = useState("");

  const [selectedCalendar, setSelectedCalendar] = useState(null); // ✅ do modala
  const scrollRef = useRef(null);
  const thumbRef = useRef(null);

  const fetchCalendars = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await axios.get(`${apiUrl}/calendars/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, page_size: 10 },
      });

      setCalendars((prev) => {
        const newItems = response.data.results.filter(
          (item) => !prev.some((c) => c.id === item.id),
        );
        return [...prev, ...newItems];
      });

      setHasMore(!!response.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania danych:", err);
      if (err.response?.status === 401)
        setTimeout(() => window.location.reload(), 500);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchSingleCalendar = useCallback(async (projectName) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const response = await axios.get(
        `${apiUrl}/calendar-by-project/${encodeURIComponent(projectName)}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Pobrany kalendarze:", response.data);
      setCalendars((prev) => {
        const incoming = response.data.results; // tablica kalendarzy

        const filtered = incoming.filter(
          (item) => !prev.some((c) => c.id === item.id),
        );

        return [...prev, ...filtered];
      });
      console.log("Zaktualizowane kalendarze:", calendars);
    } catch (err) {
      console.error("Błąd pobierania pojedynczego kalendarza:", err);
    }
  }, []);

  useEffect(() => {
    if (!selectedProject?.name) return;

    const exists = calendars.some((c) => c.name === selectedProject.name);

    if (!exists && !loading) {
      fetchSingleCalendar(selectedProject.name);
    }
  }, [selectedProject, calendars, loading, fetchSingleCalendar]);

  // Scroll thumb update
  const updateThumb = useCallback(() => {
    if (!scrollRef.current || !thumbRef.current) return;
    const container = scrollRef.current;
    const thumb = thumbRef.current;

    const containerWidth = container.scrollWidth;
    const visibleWidth = container.clientWidth;

    const thumbWidth = (visibleWidth / containerWidth) * visibleWidth;
    const thumbLeft = (container.scrollLeft / containerWidth) * visibleWidth;

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${thumbLeft}px)`;
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    updateThumb();

    return () => {
      container.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, [calendars, updateThumb]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 5 && !loading && hasMore) {
      fetchCalendars();
    }
  }, [loading, hasMore, fetchCalendars]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Funkcja do usuwania kalendarza
  const deleteCalendar = async (id) => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć kalendarz?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      await axios.delete(`${apiUrl}/calendar-destroy/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCalendars((prev) => prev.filter((c) => c.id !== id));
      setSelectedCalendar(null);
    } catch (err) {
      console.error("Błąd podczas usuwania kalendarza:", err);
      alert("Nie udało się usunąć kalendarza.");
    }
  };

  const handleAddToProduction = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);

      const response = await axios.post(
        `${apiUrl}/production/`,
        {
          calendar: selectedCalendar.id,
          quantity: Number(quantity),
          deadline: deadline || null,
          production_note: note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      alert("✅ Dodano do produkcji!");

      // reset formularza
      setQuantity(1);
      setDeadline("");
      setNote("");

      // jeśli masz odświeżanie listy:
      // fetchProductions();
    } catch (err) {
      console.error("Błąd dodawania do produkcji", err);

      if (err.response?.data) {
        alert(JSON.stringify(err.response.data));
      } else {
        alert("Nie udało się dodać do produkcji.");
      }
    }
  };

  // Sprawdzamy, czy window istnieje (zabezpieczenie dla Next.js/SSR)
  const isWindow = typeof window !== "undefined";

  const [width, setWidth] = useState(isWindow ? window.innerWidth : 0);

  useEffect(() => {
    if (!isWindow) return;

    const handleResize = () => setWidth(Math.max(window.innerWidth - 320, 300));

    // Dodajemy nasłuchiwanie na zmianę rozmiaru
    window.addEventListener("resize", handleResize);
    console.log("Initial width set to:", width);
    // Sprzątamy po sobie (cleanup), żeby nie zapchać pamięci
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("calendars:", calendars[2]);

  return (
    <div
      style={{ width: width }}
      className=" mt-4  bg-[#2a2b2b] rounded-4xl p-8 shadow-lg space-y-4 max-h-[1900]  max-w-[1600px]"
    >
      <h1 className="text-4xl font-extrabold mb-6 text-[#afe5e6]">
        Przeglądaj kalendarze
      </h1>

      <div
        className="overflow-x-auto custom-scroll [zoom:0.72] pb-4"
        ref={scrollRef}
      >
        <div className="flex gap-4 md:gap-8 px-4">
          {calendars.length === 0 && !loading ? (
            <p className="text-[#989c9e]">Brak dostępnych kalendarzy.</p>
          ) : (
            calendars
              .filter((calendar) =>
                selectedProject?.name
                  ? calendar.name === selectedProject.name
                  : true,
              )
              .map((calendar, index) => (
                <div
                  key={calendar.id}
                  className={`flex-shrink-0 relative my-3 flex flex-col items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl
      ${index === 0 ? "ml-6" : ""}
      ${index === calendars.length - 1 ? "mr-6" : ""}`}
                  onClick={() => setSelectedCalendar(calendar)} // otwieranie modala
                >
                  <h1 className="text-xl font-bold text-white mb-2">
                    {calendar.name}
                  </h1>
                  <CalendarPreview calendar={calendar} />
                </div>
              ))
          )}
        </div>
      </div>

      {loading && (
        <p className="text-[#989c9e] text-center mt-4">
          Ładowanie kalendarzy...
        </p>
      )}

      {/* Modal */}
      {selectedCalendar && (
        <CalendarDetailsModal
          selectedCalendar={selectedCalendar}
          onClose={() => setSelectedCalendar(null)}
          onDelete={deleteCalendar} // Zakładam, że masz tę funkcję w rodzicu
          onAddToProduction={handleAddToProduction}
        />
      )}
    </div>
  );
};

export default BrowseCalendars;
