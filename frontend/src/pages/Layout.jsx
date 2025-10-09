import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Search, X, Menu } from "lucide-react";
import SideBar from "../components/SideBar";
const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1e1f1f] text-white">
      {/* SIDEBAR */}
      <SideBar sidebar={sidebar} setSidebar={setSidebar} user={user} />

      {/* GŁÓWNY KONTAINER: NAV + CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <nav className="h-14 bg-[#2a2b2b] mt-4 rounded-4xl shadow-lg mx-4 px-4 sm:px-6 flex items-center justify-between">
          {/* Środkowe pole wyszukiwania */}
          <div className="flex-1 flex justify-center px-8">
            <div className="w-full sm:w-2/4 md:w-3/4 flex items-center bg-[#1e1f1f] rounded-full px-8 border border-[#374b4b] focus-within:border-[#6d8f91] transition-all duration-300">
              <Search className="w-5 h-5 text-[#d2e4e2] mr-2" />
              <input
                type="text"
                placeholder="Szukaj..."
                className="bg-transparent text-[#d2e4e2] placeholder-[#989c9e] outline-none text-sm w-full h-10"
              />
            </div>
          </div>

          {/* Prawa część - avatar i nazwa */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gradient-to-br from-[#6d8f91] to-[#afe5e6] p-[2px]">
              <img
                src={user?.profile_image ? user.profile_image : assets.avatar}
                alt="user avatar"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => (e.currentTarget.src = assets.avatar)}
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-medium text-[#e0e0e0] text-sm sm:text-base">
                {user?.first_name + " " + user?.last_name}
              </h1>
            </div>
          </div>

          {/* Lewa część - menu mobilne */}
          <div className="flex items-center">
            {sidebar ? (
              <X
                onClick={() => setSidebar(false)}
                className="w-6 h-6 text-[#989c9e] sm:hidden cursor-pointer"
              />
            ) : (
              <Menu
                onClick={() => setSidebar(true)}
                className="w-6 h-6 text-[#989c9e] sm:hidden cursor-pointer"
              />
            )}
          </div>
        </nav>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
