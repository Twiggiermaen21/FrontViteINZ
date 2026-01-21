import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Upewniamy się, że ścieżka prowadzi do /api (zgodnie z poprzednimi plikami)
const apiUrl = `${import.meta.env.VITE_API_URL}`;

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Stany komunikatów
  const [message, setMessage] = useState(""); // Komunikat ogólny (sukces/błąd tokenu)
  const [passwordError, setPasswordError] = useState(""); // Błąd walidacji hasła
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setPasswordError("");
    setIsError(false);

    try {
      await axios.post(`${apiUrl}/auth/password-reset-confirm/`, {
        uid,
        token,
        new_password: password,
      });

      setMessage("Hasło zostało pomyślnie zmienione. Za chwilę nastąpi przekierowanie...");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      console.error(err);
      setIsError(true);

      // Obsługa błędów z backendu
      if (err.response && err.response.data) {
        const data = err.response.data;

        // 1. Sprawdź czy to błąd walidacji hasła (klucz "new_password")
        if (data.new_password) {
          // Backend zwraca tablicę błędów, łączymy je w string
          const errorMsg = Array.isArray(data.new_password) 
            ? data.new_password.join(" ") 
            : data.new_password;
          setPasswordError(errorMsg);
        } 
        // 2. Sprawdź czy to błąd ogólny (klucz "detail" lub inne)
        else if (data.detail) {
          setMessage(data.detail);
        } else {
          // Fallback, jeśli backend zwrócił coś innego (np. słownik błędów "uid", "token")
                  setMessage("Wystąpił błąd walidacji danych. Lub link do resetu jest nieprawidłowy.");
        }
      } else {
        setMessage("Błąd połączenia z serwerem.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1f1f] text-[#d2e4e2] p-4">
      <div className="w-full max-w-md bg-[#2a2b2b] rounded-3xl shadow-2xl border border-[#374b4b] p-8">
        
        <h2 className="text-3xl font-bold mb-2 text-center text-[#e0e0e0]">
          Resetuj hasło
        </h2>
        <p className="text-sm text-[#989c9e] text-center mb-8">
          Wprowadź nowe hasło dla swojego konta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold uppercase tracking-wider text-[#9eaead]">
              Nowe hasło
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wpisz nowe hasło"
                className={`w-full p-4 pr-12 rounded-xl bg-[#1e1f1f] text-[#e8f3f2] placeholder:text-[#6b7a7a] focus:outline-none focus:ring-2 border transition ${
                  passwordError 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-[#3b4a4a] focus:ring-[#6d8f91]"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6b7a7a] hover:text-[#afe5e6] transition cursor-pointer flex items-center"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            {/* Wyświetlanie błędu konkretnie pod polem hasła */}
            {passwordError && (
              <p className="mt-2 text-sm text-red-400 font-medium">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-lg rounded-xl font-bold bg-[#6d8f91] hover:bg-[#afe5e6] hover:text-[#1e1f1f] text-[#e8f3f2] transition-all duration-300 cursor-pointer shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Przetwarzanie..." : "Zmień hasło"}
          </button>
        </form>

        {/* Ogólny komunikat (sukces lub błąd globalny np. zły token) */}
        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-semibold ${
            isError ? "bg-red-900/20 text-red-400 border border-red-900/50" : "bg-green-900/20 text-green-400 border border-green-900/50"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}