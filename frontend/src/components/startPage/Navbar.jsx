import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate("/ai");

  return (
    <div className="fixed top-0 z-50 w-full backdrop-blur-lg bg-[#1e1f1fcc] border-b border-[#374b4b] flex justify-between items-center py-4 px-6 sm:px-16">
      {/* <img
        src={assets.logo}
        alt="logo"
        onClick={() => navigate('/')}
        className="w-32 sm:w-44 cursor-pointer"
      /> */}
      <div className="flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform ">
        <img
          src="logo_ikona.png"
          alt="Logo Neocal"
          className="w-10 sm:w-14 "
        />
        <label 
        className="text-1xl sm:text-3xl font-semibold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] bg-clip-text text-transparent cursor-pointer ">
          Neocal
        </label>
      </div>

      <button
        onClick={handleGetStarted}
        className="flex items-center gap-2 rounded-full text-sm font-medium px-8 py-2.5
                   bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f]
                   hover:scale-105 active:scale-95 transition-all duration-300"
      >
        Get Started <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Navbar;
