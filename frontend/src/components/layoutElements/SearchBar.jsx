import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, ChevronDown, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ACCESS_TOKEN } from "../../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

const ROUTES = {
  generuj: "/ai/generate",
  galeria: "/ai/gallery",
  "nowy kalendarz": "/ai/create-calendar",
  kalendarze: "/ai/calendars",
};

const SEARCH_ITEMS = Object.keys(ROUTES);

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

const SearchBar = ({ placeholder = "Szukaj...", selectedProject, setSelectedProject }) => {
  const [query, setQuery] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [projectsList, setProjectsList] = useState([]);
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const isProjectMode = query === "galeria" || query === "kalendarze";
  const frozenPrefix = isProjectMode ? `${query} / ` : "";


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("search_history") || "[]");
    setHistory(saved);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      try {
        let response;
        if (query === "kalendarze") {
          response = await axios.get(`${apiUrl}/calendar-search/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProjectsList(response.data.map(item => ({ id: item.id, name: item.name })));
        } else if (query === "galeria") {
          response = await axios.get(`${apiUrl}/image-search/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProjectsList(response.data.map(item => ({ id: item.id, name: item.name })));
        }
      } catch (err) {
        console.error("Błąd podczas pobierania projektów:", err);
      }
    };

    if (isProjectMode) {
      fetchProjects();
    }
  }, [query]);

  const saveToHistory = (item) => {
    const updated = [item, ...history.filter(h => h !== item)].slice(0, 6);
    setHistory(updated);
    localStorage.setItem("search_history", JSON.stringify(updated));
  };

  const filtered = useMemo(() => {
    if (isProjectMode) {
      const input = selectedProject ? selectedProject.name : projectInput;
      return projectsList.filter(p => fuzzyMatch(input, p.name));
    } else {
      return SEARCH_ITEMS.filter(item => fuzzyMatch(query, item));
    }
  }, [query, projectInput, projectsList, selectedProject]);

  const run = (item) => {
    saveToHistory(item);
    navigate(ROUTES[item]);
    setOpen(false);
    setQuery(item);
    setProjectInput("");
    setSelectedProject(null);
  };

  const selectProject = (project) => {
    setSelectedProject(project);
    setProjectInput(project.name);
    setOpen(false);
  };

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
      <div
        className="w-full z-10 sm:w-2/4 md:w-3/4 flex items-center bg-[#1e1f1f] rounded-full px-8 border border-[#374b4b] cursor-pointer focus-within:border-[#6d8f91] transition-all duration-300"
        onClick={() => setOpen(true)}
      >
        <Search className="w-5 h-5 text-[#d2e4e2] mr-2" />
        {isProjectMode && <span className="text-[#7b8f90] mr-2 whitespace-nowrap">{frozenPrefix}</span>}
        <input
          type="text"
          placeholder={placeholder}
          value={isProjectMode ? (selectedProject ? selectedProject.name : projectInput) : query}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedProject(null);
            if (isProjectMode) setProjectInput(val);
            else setQuery(val);
          }}
          onKeyDown={(e) => {
            if (isProjectMode && e.key === "Backspace" && projectInput === "") {
              setQuery("");
              setProjectInput("");
              setSelectedProject(null);
            }
          }}
          onFocus={() => setOpen(true)}
          className="bg-transparent text-[#d2e4e2] placeholder-[#989c9e] outline-none text-sm w-full h-10"
        />
        <ChevronDown className={`w-5 h-5 text-[#d2e4e2] ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="absolute -mt-5 top-full left-0 w-full sm:w-2/4 md:w-3/4 bg-[#1e1f1f] border border-[#374b4b] border-t-0 rounded-b-xl shadow-xl z-9">
          <div className="max-h-72 overflow-y-auto custom-scroll px-4 py-6">
            {isProjectMode ? (
              <div>
                <div className="text-xs text-[#7b7d80] mb-2 font-semibold">Twoje projekty</div>
                <ul className="space-y-1">
                  {filtered.map(p => (
                    <li
                      key={p.id}
                      className="text-[#d2e4e2] cursor-pointer hover:text-white hover:bg-[#2a2b2b] p-2 rounded-lg transition"
                      onClick={() => selectProject(p)}
                    >
                      📁 {p.name}
                    </li>
                  ))}
                  {filtered.length === 0 && <li className="text-[#787b7c] text-sm p-2">Brak wyników</li>}
                </ul>
              </div>
            ) : query.length > 0 ? (
              <ul className="space-y-1 mb-4">
                {filtered.map(item => (
                  <li
                    key={item}
                    onClick={() => run(item)}
                    className="text-[#d2e4e2] cursor-pointer hover:text-white hover:bg-[#2a2b2b] p-2 rounded-lg transition"
                  >
                    🔎 {item}
                  </li>
                ))}
                {filtered.length === 0 && <li className="text-[#787b7c] text-sm p-2">Brak wyników</li>}
              </ul>
            ) : (
              <ul className="space-y-1 mb-4">
                {SEARCH_ITEMS.map(item => (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
