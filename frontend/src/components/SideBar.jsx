import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import {
  House,
  SquarePen,
  LogOut,
  ImageMinus,
  Edit3,
  CalendarPlus,
  CalendarSearch,
  Settings,
  Printer,
  Shield,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navbar = [
  { label: "Dashboard", path: "/ai/dashboard", Icon: House },
  { label: "Generuj", path: "/ai/generate", Icon: SquarePen },
  { label: "Galeria", path: "/ai/gallery", Icon: ImageMinus },
  { label: "Edytuj zdjęcie", path: "/ai/edit", Icon: Edit3, staffOnly: true },
  { label: "Nowy kalendarz", path: "/ai/create-calendar", Icon: CalendarPlus },
  { label: "Kalendarze", path: "/ai/calendars", Icon: CalendarSearch },
  { label: "Edytuj kalendarz", path: "/ai/edit-calendar", Icon: Edit3, staffOnly: true },
  { label: "Produkcja", path: "/ai/production-list", Icon: Printer },
  { label: "Strona dla pracowników", path: "/ai/staffpage", Icon: Shield, staffOnly: true },
];

const SideBar = ({ sidebar, setSidebar, user }) => {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);
  
  useEffect(() => {
    if (clicks === 5) {
      navigate("/ai/game");
      setClicks(0); // reset po przejściu
    }

    // Reset po 2 sekundach bez klikania
    const timer = setTimeout(() => setClicks(0), 2000);
    return () => clearTimeout(timer);
  }, [clicks, navigate]);
  return (
    <div
      className={`
    w-60 bg-[#2a2b2b] rounded-4xl  mt-4 z-40 flex flex-col justify-between
    max-sm:absolute max-sm:top-0 max-sm:left-0 max-sm:h-full sm:m-4
    transform transition-transform duration-300 ease-in-out
    ${sidebar ? "translate-x-0 m-4 " : "max-sm:-translate-x-full"}
  `}
    >
      {/* GÓRNA CZĘŚĆ */}
      <div className="my-7 w-full">
        <img
          src="/logo_ikona.png"
          alt="user avatar"
          className="w-24 h-24 mx-auto cursor-pointer transition-transform duration-200 hover:scale-105"
          onClick={() => setClicks((c) => c + 1)}
        />

        <div className="px-4 mt-6 text-sm font-medium">
          {navbar
  .filter(item => (item.staffOnly ? user?.is_staff : true))
  .map(({ path, label, Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded-lg transition-colors
                 ${
                   isActive
                     ? "bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] font-semibold"
                     : "text-[#d2e4e2] hover:bg-[#374b4b] hover:text-white"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-[#1e1f1f]" : "text-[#989c9e]"
                    }`}
                  />
                  <span className="text-sm">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* DOLNA CZĘŚĆ */}
      <div className="w-full p-4 px-5 flex flex-col items-start space-y-2">
        <button
          onClick={() => navigate("/ai/settings")}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#d2e4e2] hover:bg-[#374b4b] hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5 text-[#989c9e]" />
          <span className="text-sm">Ustawienia</span>
        </button>

        <button
          onClick={() => navigate("/ai/logout")}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#d2e4e2] hover:bg-[#374b4b] hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 text-[#989c9e]" />
          <span className="text-sm">Wyloguj</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
