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
  const navigate = useNavigate();
const [infoMessage, setInfoMessage] = useState("");

  const name = method === "login" ? "Zaloguj się" : "Zarejestruj się";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

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
       // Po rejestracji ustawiamy infoMessage i ukrywamy formularz
        setInfoMessage("Rejestracja zakończona! Sprawdź e-mail, aby aktywować konto.");
        // Małe opóźnienie, żeby użytkownik zdążył przeczytać komunikat
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          setErrorMessage(error.response.data);
        } else if (error.response.data.detail) {
          setErrorMessage(error.response.data.detail);
        } else {
          setErrorMessage("Wystąpił błąd. Spróbuj ponownie.");
        }
      } else {
        setErrorMessage("Błąd połączenia z serwerem");
      }
    } finally {
      setLoading(false);
    }
  };


  // Jeśli infoMessage jest ustawione, wyświetlamy tylko komunikat
  if (infoMessage) {
    return (
      <div className="p-6 bg-[#2a2b2b] rounded-xl text-center text-[#e8f3f2]">
        <p className="text-lg font-semibold">{infoMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6  text-[#d2e4e2] font-sans"
    >
      {/* POLA REJESTRACJI */}
      {method === "register" && (
        <>
          <InputField
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="Wprowadź nazwę użytkownika"
          />
          <InputField
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="Wprowadź adres e-mail"
            type="email"
          />
          <InputField
            label="First Name"
            value={firstName}
            onChange={setFirstName}
            placeholder="Wprowadź imię"
          />
          <InputField
            label="Last Name"
            value={lastName}
            onChange={setLastName}
            placeholder="Wprowadź nazwisko"
          />
        </>
      )}

      {/* POLA LOGOWANIA */}
      {method === "login" && (
        <InputField
          label="Username"
          value={username}
          onChange={setUsername}
          placeholder="Wprowadź nazwę użytkownika"
        />
      )}

      {/* HASŁO */}
      <div>
        <label className="block mb-2 text-sm font-semibold uppercase tracking-wider text-[#9eaead]">
          Password
        </label>
        <div className="relative mt-1">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
            className="w-full p-4 pr-12 rounded-xl bg-[#2a2b2b] text-[#e8f3f2] placeholder:text-[#6b7a7a] focus:outline-none focus:ring-2 focus:ring-[#6d8f91] border border-[#3b4a4a] transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#6b7a7a] hover:text-[#afe5e6] transition"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </div>

      {/* KOMUNIKATY */}
      {errorMessage && (
        <p className="text-red-400 text-sm font-semibold">{errorMessage}</p>
      )}

      {method === "login" && (
        <div className="flex justify-between text-xs mt-1 text-[#9eaead]">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded-md border-2 border-[#6d8f91] accent-[#6d8f91] focus:ring-2 focus:ring-[#6d8f91] transition duration-200"
            />
            <span>Zapamiętaj mnie</span>
          </label>
          <a
            href="/forgot-password"
            className="text-[#afe5e6] font-semibold hover:underline"
          >
            Zapomniałeś hasła?
          </a>
        </div>
      )}

      {loading && <LoadingIndicator />}

      {/* PRZYCISK */}
      <button
        type="submit"
        className="w-full py-4 text-lg rounded-xl font-bold mt-6 bg-[#6d8f91] hover:bg-[#afe5e6] hover:text-[#1e1f1f] text-[#e8f3f2] transition-all duration-300"
      >
        {name}
      </button>
    </form>
  );
}

/* Subkomponent do pól tekstowych */
function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold uppercase tracking-wider text-[#9eaead]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 rounded-xl bg-[#2a2b2b] text-[#e8f3f2] placeholder:text-[#6b7a7a] focus:outline-none focus:ring-2 focus:ring-[#6d8f91] border border-[#3b4a4a] shadow-sm transition"
      />
    </div>
  );
}
