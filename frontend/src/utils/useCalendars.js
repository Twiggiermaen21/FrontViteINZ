import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

export const useCalendars = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollRef = useRef(null);

  // 🔹 Pobieranie danych (paginacja)
  const fetchCalendars = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const token = localStorage.getItem(ACCESS_TOKEN);

    try {
      const res = await axios.get(`${apiUrl}/calendars/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, page_size: 20 },
      });

      const newCalendars = res.data.results;

      // 🔸 Unikamy duplikatów po `id`
      setCalendars((prev) => {
        const all = [...prev, ...newCalendars];
        const unique = all.filter(
          (item, index, self) =>
            index === self.findIndex((c) => c.id === item.id)
        );
        return unique;
      });

      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Błąd podczas pobierania kalendarzy:", err);
      if (err.response?.status === 401) {
        setTimeout(() => window.location.reload(), 500);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // 🔹 Pierwsze pobranie
  useEffect(() => {
    fetchCalendars();
  }, []);

  // 🔹 Infinite scroll
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading && hasMore) {
      fetchCalendars();
    }
  }, [loading, hasMore, fetchCalendars]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { calendars, loading, scrollRef };
};
