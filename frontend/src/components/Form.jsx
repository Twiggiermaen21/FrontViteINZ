import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState(""); // Stan dla komunikatu sukcesu

  const navigate = useNavigate();
  const name = method === "login" ? "Zaloguj się" : "Zarejestruj się";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setInfoMessage(""); // Czyścimy poprzednie komunikaty sukcesu

    try {
      let payload;
      if (method === "login") {
        payload = { username, password };
      } else {
        payload = {
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        };
      }

      const res = await api.post(route, payload);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/ai/dashboard");
      } else {
        // --- ZMIANA TUTAJ: Nowy komunikat i dłuższy czas oczekiwania ---
        setInfoMessage("Rejestracja zakończona pomyślnie! Aktywuj swoje konto klikając w link, który został wysłany na Twój adres e-mail.");
        
        // Zwiększyłem czas do 5000ms (5 sekund), żeby użytkownik zdążył przeczytać komunikat
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          setErrorMessage(error.response.data);
        } else if (error.response.data.detail) {
          setErrorMessage(error.response.data.detail);
        } else {
          // Obsługa błędów walidacji (np. zajęty email)
          try {
            const fieldErrors = Object.values(error.response.data).flat().join(", ");
            setErrorMessage(fieldErrors || "Wystąpił błąd. Spróbuj ponownie.");
          } catch (e) {
            setErrorMessage("Wystąpił nieoczekiwany błąd danych.");
          }
        }
      } else {
        setErrorMessage("Błąd połączenia z serwerem");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-[#d2e4e2] font-sans">
      {method === "register" && (
        <>
          <InputField 
            label="Username" 
            value={username} 
            onChange={setUsername} 
            placeholder="Wprowadź nazwę użytkownika" 
            autoComplete="username"
          />
          <InputField 
            label="Email" 
            value={email} 
            onChange={setEmail} 
            placeholder="Wprowadź adres e-mail" 
            type="email" 
            autoComplete="email"
          />
          <InputField 
            label="First Name" 
            value={firstName} 
            onChange={setFirstName} 
            placeholder="Wprowadź imię" 
            autoComplete="given-name"
          />
          <InputField 
            label="Last Name" 
            value={lastName} 
            onChange={setLastName} 
            placeholder="Wprowadź nazwisko" 
            autoComplete="family-name"
          />
        </>
      )}

      {method === "login" && (
        <InputField 
          label="Username" 
          value={username} 
          onChange={setUsername} 
          placeholder="Wprowadź nazwę użytkownika" 
          autoComplete="username"
        />
      )}

      <div>
        <label className="block mb-2 text-sm font-semibold uppercase tracking-wider text-[#9eaead]">Password</label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
            autoComplete={method === "login" ? "current-password" : "new-password"}
            className="w-full p-4 pr-12 rounded-xl bg-[#2a2b2b] text-[#e8f3f2] placeholder:text-[#6b7a7a] focus:outline-none focus:ring-2 focus:ring-[#6d8f91] border border-[#3b4a4a] transition"
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

        {method === "login" && (
          <div className="mt-5 flex justify-center w-full">
            <a 
              href="/forgot-password" 
              className="text-sm font-semibold text-[#afe5e6] hover:text-white hover:underline transition-colors"
            >
              Zapomniałeś hasła?
            </a>
          </div>
        )}
      </div>

      {/* --- ZMIANA TUTAJ: Wyświetlanie komunikatu o sukcesie --- */}
      {infoMessage && (
        <div className="p-3 bg-green-900/40 border border-green-600/50 rounded-xl text-center">
            <p className="text-green-400 text-sm font-bold">{infoMessage}</p>
        </div>
      )}

      {/* Wyświetlanie błędów */}
      {errorMessage && <p className="text-red-400 text-sm font-semibold text-center">{errorMessage}</p>}

      {loading && <LoadingIndicator />}

      <button
        type="submit"
        disabled={loading} // Dobra praktyka: zablokuj przycisk podczas ładowania
        className="w-full py-4 text-lg rounded-xl font-bold mt-2 bg-[#6d8f91] hover:bg-[#afe5e6] hover:text-[#1e1f1f] text-[#e8f3f2] transition-all duration-300 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {name}
      </button>
    </form>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", autoComplete = "off" }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold uppercase tracking-wider text-[#9eaead]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full p-4 rounded-xl bg-[#2a2b2b] text-[#e8f3f2] placeholder:text-[#6b7a7a] focus:outline-none focus:ring-2 focus:ring-[#6d8f91] border border-[#3b4a4a] shadow-sm transition"
        required
      />
    </div>
  );
}