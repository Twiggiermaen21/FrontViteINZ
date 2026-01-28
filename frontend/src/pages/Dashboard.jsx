import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const tiles = [
  { path: "/ai/generate", label: "Generate", image: "/dashboard/generator.png" },
  { path: "/ai/gallery", label: "Gallery", image: "/dashboard/galeria.png" },
  { path: "/ai/calendars", label: "Browse Calendars", image: "/dashboard/kalendarzeGaleria.png" },
  { path: "/ai/create-calendar", label: "Create Calendar", image: "/dashboard/kalendarz.png" },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const visibleTiles = tiles.filter((item) =>
    item.staffOnly ? user?.is_staff : true
  );

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 p-8 max-w-7xl mx-auto w-full`}
    >
      {visibleTiles.map((tile) => (
        <Link
          key={tile.path}
          to={tile.path}
          className="relative group bg-[#2a2b2b] rounded-3xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-300"
        >
         <img
  src={tile.image}
  alt={tile.label}
  className="w-full h-72 object-cover brightness-90 group-hover:brightness-110 transition-all duration-300 border-18 rounded-3xl border-[#2a2b2b]"
/>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
            <h3 className="text-white text-xl font-semibold">{tile.label}</h3>
          </div>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity rounded-3xl"></div>
        </Link>
      ))}
    </div>
  );
};

export default Dashboard;
