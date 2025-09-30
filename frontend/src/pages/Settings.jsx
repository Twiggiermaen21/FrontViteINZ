import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingIndicator from "../components/LoadingIndicator";
import { ACCESS_TOKEN } from "../constants";

const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

export default function Settings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [errorProfile, setErrorProfile] = useState("");
  const [successProfile, setSuccessProfile] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [successEmail, setSuccessEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [successPassword, setSuccessPassword] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.username || "");
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
    }
  }, []);

  const api = axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
    },
  });

  const handleProfileChange = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setErrorProfile("");
    setSuccessProfile("");

    try {
      await api.put("/user/update-profile/", {
        username,
        first_name: firstName,
        last_name: lastName,
      });
      setSuccessProfile("Dane profilu zostały zaktualizowane!");
      const user = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, username, first_name: firstName, last_name: lastName })
      );
    } catch (err) {
      setErrorProfile(
        err.response?.data?.username ||
        err.response?.data?.detail ||
        "Błąd przy aktualizacji profilu"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setLoadingEmail(true);
    setErrorEmail("");
    setSuccessEmail("");

    try {
      await api.put("/user/change-email/", { email });
      setSuccessEmail("Email został zmieniony pomyślnie!");
      const user = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem("user", JSON.stringify({ ...user, email }));
    } catch (err) {
      setErrorEmail(
        err.response?.data?.email ||
        err.response?.data?.detail ||
        "Błąd przy zmianie emaila"
      );
    } finally {
      setLoadingEmail(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    setErrorPassword("");
    setSuccessPassword("");

    if (newPassword !== confirmPassword) {
      setErrorPassword("Nowe hasło i potwierdzenie nie są takie same");
      setLoadingPassword(false);
      return;
    }

    try {
      await api.put("/user/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccessPassword("Hasło zostało zmienione pomyślnie!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorPassword(
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.current_password?.[0] ||
        err.response?.data?.detail ||
        "Błąd przy zmianie hasła"
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto pt-8 px-4">
      {/* LEWY PANEL: Dane profilu */}
      <div className="flex-1 bg-[#2a2b2b] rounded-4xl p-8 shadow-lg space-y-8">
        <h1 className="text-2xl font-semibold text-white">Ustawienia użytkownika</h1>

        {/* Profil */}
        <form onSubmit={handleProfileChange} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
          />
          {errorProfile && <p className="text-red-500">{errorProfile}</p>}
          {successProfile && <p className="text-green-500">{successProfile}</p>}
          <button
            type="submit"
            disabled={loadingProfile}
            className="w-full py-3 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] hover:opacity-90 transition-all duration-300"
          >
            {loadingProfile ? <LoadingIndicator /> : "Zaktualizuj profil"}
          </button>
        </form>

        {/* Email */}
        <form onSubmit={handleEmailChange} className="space-y-4">
          <input
            type="email"
            placeholder="Nowy email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
          />
          {errorEmail && <p className="text-red-500">{errorEmail}</p>}
          {successEmail && <p className="text-green-500">{successEmail}</p>}
          <button
            type="submit"
            disabled={loadingEmail}
            className="w-full py-3 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] hover:opacity-90 transition-all duration-300"
          >
            {loadingEmail ? <LoadingIndicator /> : "Zmień email"}
          </button>
        </form>

        {/* Hasło */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            placeholder="Aktualne hasło"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
          />
          <input
            type="password"
            placeholder="Nowe hasło"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
          />
          <input
            type="password"
            placeholder="Potwierdź nowe hasło"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f] placeholder:text-[#595f5e] focus:outline-none focus:ring-2 focus:ring-[#afe5e6] transition"
          />
          {errorPassword && <p className="text-red-500">{errorPassword}</p>}
          {successPassword && <p className="text-green-500">{successPassword}</p>}
          <button
            type="submit"
            disabled={loadingPassword}
            className="w-full py-3 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] hover:opacity-90 transition-all duration-300"
          >
            {loadingPassword ? <LoadingIndicator /> : "Zmień hasło"}
          </button>
        </form>
      </div>
    </div>
  );
}
