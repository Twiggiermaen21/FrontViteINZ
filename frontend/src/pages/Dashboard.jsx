import React, { useState } from "react";
import { Link } from "react-router-dom";

const tiles = [
  { path: "/ai/generate", label: "Generate", image: "/images/generate.png" },
  { path: "/ai/dashboard", label: "Dashboard", image: "/images/dashboard.png" },
  { path: "/ai/gallery", label: "Gallery", image: "/images/gallery.png" },
  { path: "/ai/calendars", label: "Browse Calendars", image: "/images/calendars.png" },
  { path: "/ai/create-calendar", label: "Create Calendar", image: "/images/create-calendar.png" },
  { path: "/ai/edit-calendar", label: "Edit Calendar", image: "/images/edit-calendar.png" },
  { path: "/ai/edit", label: "Edit Image", image: "/images/edit.png" },
];


const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
      {tiles.map((tile) => (
        <Link
          key={tile.path}
          to={tile.path}
          className="relative group bg-[#2a2b2b] rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <img
            src={tile.image}
            alt={tile.label}
            className="w-full h-48 object-cover brightness-90 group-hover:brightness-110 transition-all duration-300"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white text-lg font-semibold">{tile.label}</h3>
          </div>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity rounded-3xl"></div>
        </Link>
      ))}
    </div>
  );
};

export default Dashboard;
