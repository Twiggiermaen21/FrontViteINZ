import React from "react";
import { assets } from "../assets/assets";
import {
  House,
  SquarePen,
  LogOut,
  ImageMinus,
  Edit3,
  CalendarPlus,
  CalendarSearch,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navbar = [
  { label: "Dashboard", path: "/ai/dashboard", Icon: House },
  { label: "Generuj", path: "/ai/generate", Icon: SquarePen },
  { label: "Galeria", path: "/ai/gallery", Icon: ImageMinus },
  { label: "Edytuj zdjęcie", path: "/ai/edit", Icon: Edit3 },
  { label: "Nowy kalendarz", path: "/ai/create-calendar", Icon: CalendarPlus },
  { label: "Kalendarze", path: "/ai/calendars", Icon: CalendarSearch },
  { label: "Edytuj kalendarz", path: "/ai/edit-calendar", Icon: Edit3 },
];

const SideBar = ({ sidebar, setSidebar, user }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-60 bg-[#2a2b2b] border-r border-[#374b4b] flex flex-col items-center justify-between max-sm:absolute top-14 bottom-0
        ${
          sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
        } transition-all duration-300 ease-in-out`}
    >
      {/* GÓRNA CZĘŚĆ */}
      <div className="my-7 w-full">
        <img
          src={user?.picture ? user.picture : assets.avatar}
          alt="user avatar"
          className="w-16 h-16 rounded-full mx-auto border-2 border-[#374b4b]"
          onError={(e) => (e.currentTarget.src = assets.avatar)}
        />
        <h1 className="text-center mt-2 font-semibold text-white">
          {user?.first_name + " " + user?.last_name}
        </h1>

        <div className="px-4 mt-6 text-sm font-medium">
          {navbar.map(({ path, label, Icon }) => (
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
      <div className="w-full border-t border-[#374b4b] p-4 px-5 flex items-center justify-between">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => navigate("/ai/settings")}
        >
          <img
            src={user?.picture ? user.picture : assets.avatar}
            alt="user avatar"
            className="w-10 h-10 rounded-full border border-[#374b4b]"
            onError={(e) => (e.currentTarget.src = assets.avatar)}
          />
          <div>
            <h1 className="text-sm font-medium text-white">
              {user?.first_name + " " + user?.last_name}
            </h1>
            <p className="text-xs text-[#989c9e]">Premium Plan</p>
          </div>
        </div>
        <LogOut
          onClick={() => navigate("/ai/logout")}
          className="w-5 h-5 text-[#989c9e] hover:text-white transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SideBar;
