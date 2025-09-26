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
      className={`w-60 bg-white border-r border-gray-200 flex flex-col items-center justify-between max-sm:absolute top-14 bottom-0
        ${
          sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
        } transition-all duration-300 ease-in-out`}
    >
      <div className="my-7 w-full">
        <img
          src={user?.picture ? user.picture : assets.avatar}
          alt="user avatar"
          className="w-13 rounded-full mx-auto"
          onError={(e) => (e.currentTarget.src = assets.avatar)}
        />
        <h1 className="text-center mt-1">
          {user?.first_name + " " + user?.last_name}
        </h1>

        <div className="px-6 mt-5 text-sm text-gray-600 font-medium ">
          {navbar.map(({ path, label, Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded-md transition-colors
                 ${
                   isActive
                     ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                     : "text-gray-700 hover:bg-gray-100"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <span className="text-sm">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full brodaer-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => navigate("/ai/settings")}
        >
          <img
            src={user?.picture ? user.picture : assets.avatar}
            alt="user avatar"
            className="w-13 rounded-full mx-auto"
            onError={(e) => (e.currentTarget.src = assets.avatar)}
          />
          <div>
            <h1 className="text-sm font-medium">
              {user?.first_name + " " + user?.last_name}
            </h1>
            <p className="text-xs text-gray-500">Premium Plan</p>
          </div>
        </div>
        <LogOut
          onClick={() => navigate("/ai/logout")}
          className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SideBar;
