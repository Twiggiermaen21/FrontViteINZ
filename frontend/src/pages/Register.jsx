import React from "react";
import Form from "../components/Form";
import { NAME_WEB } from "../assets/assets";

export default function Register() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#1e1f1f] text-[#d2e4e2]">
      <div className="flex w-full max-w-6xl min-h-[40rem] bg-[#2a2b2b] rounded-3xl overflow-hidden shadow-2xl border border-[#374b4b]">
        
        {/* LEWA STRONA (Spójna z Login - gradient morski) */}
        <div className="flex-1 bg-gradient-to-br from-[#6d8f91] via-[#8ebabb] to-[#afe5e6] relative flex items-center justify-center p-10">
          <img
            src="/astronaut.png"
            alt="Astronaut"
            className="max-h-80 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
          <div className="text-white text-6xl font-extrabold absolute bottom-10 left-10 drop-shadow-md">
            {NAME_WEB}
          </div>
        </div>

        {/* PRAWA STRONA (Ciemny motyw) */}
        <div className="flex-1 p-12 flex flex-col justify-center bg-[#1e1f1f]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#e0e0e0]">
              Dołącz do {NAME_WEB}!
            </h2>
            <p className="text-sm text-[#989c9e] mt-2">
              Zarejestruj się, aby rozpocząć swoją przygodę z nami.
            </p>
          </div>

          <Form route="/api/user/register/" method="register" />

          <div className="text-center mt-8 text-[#989c9e] text-sm">
            Masz już konto?{" "}
            <a
              href="/login"
              className="text-[#afe5e6] font-semibold hover:underline hover:text-white transition-colors cursor-pointer"
            >
              Zaloguj się
            </a>
          </div>

          {/* Opcjonalnie: Możesz tu dodać separator i GoogleLogin dla rejestracji, 
              jeśli Twój backend to obsługuje, analogicznie jak w Login */}
        </div>

      </div>
    </div>
  );
}