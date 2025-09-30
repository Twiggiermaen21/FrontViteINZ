import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { X, Menu } from "lucide-react";
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
    <nav className="w-full h-14 px-6 flex items-center justify-end">
      {/* <img
        src="/logo_napis.png"
        onClick={() => navigate("/")}
        alt="Logo"
        className="h-6 cursor-pointer"
      /> */}

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

    <div className="flex items-center mt-4 space-x-4 sm:flex hidden ml-4">
  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gradient-to-br from-[#6d8f91] to-[#afe5e6] p-[2px]">
    <img
      src={user?.picture ? user.picture : assets.avatar}
      alt="user avatar"
      className="w-full h-full rounded-full object-cover"
      onError={(e) => (e.currentTarget.src = assets.avatar)}
    />
  </div>
  <div>
    <h1 className="font-medium text-[#e0e0e0] text-sm sm:text-base">
      {user?.first_name + " " + user?.last_name}
    </h1>
  </div>
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
