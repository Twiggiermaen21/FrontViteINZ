import { useState, useEffect } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

export const useCalendars = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCalendars = async () => {
      setLoading(true);
      const token = localStorage.getItem(ACCESS_TOKEN);
      try {
        const res = await axios.get(`${apiUrl}/calendars/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCalendars(res.data.results);
      } catch (err) {
        console.error("Błąd podczas pobierania kalendarzy:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendars();
  }, []);

  return { calendars, loading };
};
