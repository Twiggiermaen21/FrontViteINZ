import React from "react";
import Form from "../components/Form";
import { NAME_WEB } from "../assets/assets";

export default function Register() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#1e1f1f] text-[#d2e4e2]">
      <div className="flex w-full max-w-6xl min-h-[40rem] bg-[#2a2b2b] rounded-3xl overflow-hidden shadow-2xl border border-[#374b4b]">

        {/* Lewa strona - kolorowa ilustracja */}
        <div className="flex-1 bg-gradient-to-br from-pink-400 via-orange-400 to-purple-500 relative flex items-center justify-center p-10">
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/astronaut-helmet-with-balloons-9236788-7520477.png"
            alt="Astronaut"
            className="max-h-80 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
          <div className="text-white text-6xl font-extrabold absolute bottom-10 left-10 drop-shadow-md">
            {NAME_WEB}
          </div>
        </div>

        {/* Prawa strona - panel rejestracji */}
        <div className="flex-1 p-12 flex flex-col justify-center bg-[#1e1f1f]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#e0e0e0]">Witamy w {NAME_WEB}!</h2>
            <p className="text-sm text-[#989c9e] mt-2">
              Zarejestruj się, aby rozpocząć przygodę.
            </p>
          </div>

          <Form route="/api/user/register/" method="register" />

          <div className="text-center mt-8 text-[#989c9e] text-sm">
            Masz już konto?{" "}
            <a
              href="/login"
              className="text-[#afe5e6] font-semibold hover:underline hover:text-white transition-colors"
            >
              Zaloguj się
            </a>
          </div>

         

          
        </div>

      </div>
    </div>
  );
}
