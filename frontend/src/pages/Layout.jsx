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
console.log(sidebar)
  return (
    <div className="flex flex-col min-h-screen bg-[#1e1f1f] text-white">
      {/* NAVBAR */}
      <nav className="w-full px-6 h-14 flex items-center justify-between ">
        <img
          src={assets.logo}
          onClick={() => navigate("/")}
          alt="Logo"
          className="h-8 cursor-pointer"
        />
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

        <div className="flex items-center space-x-4 sm:flex hidden">
  <img
    src={user?.picture ? user.picture : assets.avatar}
    alt="user avatar"
    className="w-8 h-8 rounded-full border-2 border-[#374b4b]"
    onError={(e) => (e.currentTarget.src = assets.avatar)}
  />
  <div>
    <h1 className="font-semibold text-white">
      {user?.first_name + " " + user?.last_name}
    </h1>
  </div>
</div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="h-[calc(100vh-56px)] flex flex-1 w-full">
        {/* Sidebar */}
        <SideBar sidebar={sidebar} setSidebar={setSidebar} user={user} />

        {/* Content */}
        <div className="flex-1 bg-[#1e1f1f]  overflow-y-auto">
          <div className="shadow-lg h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
