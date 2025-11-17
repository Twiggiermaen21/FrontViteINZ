import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, ChevronDown, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mapa wyników -> linki
const ROUTES = {
  dashboard: "/ai/dashboard",
  generuj: "/ai/generate",
  galeria: "/ai/gallery",
  "nowy kalendarz": "/ai/create-calendar",
  kalendarze: "/ai/calendars",
};

const SEARCH_ITEMS = Object.keys(ROUTES);

// Fuzzy dopasowanie
const fuzzyMatch = (input, target) => {
  if (!input) return true;
  input = input.toLowerCase();
  target = target.toLowerCase();

  if (target.includes(input)) return true;

  let i = 0;
  for (let char of target) {
    if (char === input[i]) i++;
    if (i === input.length) return true;
  }
  return false;
};

const SmartExpandableSearch = ({ placeholder = "Szukaj..." }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Wczytaj historię
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("search_history") || "[]");
    setHistory(saved);
  }, []);

  const saveToHistory = (item) => {
    const updated = [item, ...history.filter((h) => h !== item)].slice(0, 6);
    setHistory(updated);
    localStorage.setItem("search_history", JSON.stringify(updated));
  };

  const filtered = useMemo(() => {
    return SEARCH_ITEMS.filter((item) => fuzzyMatch(query, item));
  }, [query]);

  const run = (item) => {
    saveToHistory(item);
    navigate(ROUTES[item]);
    setOpen(false);
  };

  // Klik poza komponent → zamyka
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="w-full flex flex-col gap-2 relative">

      {/* Pasek wyszukiwania */}
      <div
        className="w-full z-100 sm:w-2/4 md:w-3/4 flex items-center bg-[#1e1f1f] rounded-full px-8 border border-[#374b4b] cursor-pointer focus-within:border-[#6d8f91] transition-all duration-300"
        onClick={() => setOpen(true)}
      >
        <Search className="w-5 h-5 text-[#d2e4e2] mr-2" />

        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          className="bg-transparent text-[#d2e4e2] placeholder-[#989c9e] outline-none text-sm w-full h-10"
        />

        <ChevronDown
          className={`w-5 h-5 text-[#d2e4e2] ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
     {open && (
  <div
    className="absolute -mt-5 top-full left-0 w-full sm:w-2/4 md:w-3/4 
               bg-[#1e1f1f] border border-[#374b4b] border-t-0
               rounded-b-xl shadow-xl z-50"
  >
    {/* HEADER DROPDOWNU (nie scrolluje się) */}
    <div className="p-4 pt-10 pb-1">
      {query.length === 0 && (
        <div className="text-xs text-[#7b7d80] mb-2 font-semibold">
          Wszystkie opcje
        </div>
      )}
    </div>

    {/* SCROLL ONLY AREA */}
    <div className="max-h-72 overflow-y-auto custom-scroll px-4 pb-4">
      {/* WYNIKI */}
      {query.length > 0 && (
        <ul className="space-y-1 mb-4">
          {filtered.map((item) => (
            <li
              key={item}
              onClick={() => run(item)}
              className="text-[#d2e4e2] cursor-pointer hover:text-white hover:bg-[#2a2b2b] p-2 rounded-lg transition"
            >
              🔎 {item}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-[#787b7c] text-sm p-2">Brak wyników</li>
          )}
        </ul>
      )}

      {/* LISTA PEŁNA */}
      {query.length === 0 && (
        <ul className="space-y-1 mb-4">
          {SEARCH_ITEMS.map((item) => (
            <li
              key={item}
              onClick={() => run(item)}
              className="text-[#d2e4e2] cursor-pointer hover:text-white hover:bg-[#2a2b2b] p-2 rounded-lg transition"
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* HISTORIA */}
      {history.length > 0 && (
        <div>
          <div className="text-xs text-[#7b7d80] mb-2 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Ostatnie wyszukiwania
          </div>

          <ul className="space-y-1">
            {history.map((item) => (
              <li
                key={item}
                onClick={() => run(item)}
                className="text-[#b4b7b8] cursor-pointer hover:text-white hover:bg-[#2a2b2b] p-2 rounded-lg transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default SmartExpandableSearch;
