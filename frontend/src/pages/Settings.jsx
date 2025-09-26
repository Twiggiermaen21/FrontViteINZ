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

  // Pre-fill danych użytkownika
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.username || "");
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
    }
  }, []);

  // Axios instance
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
        username: username,
        first_name: firstName,
        last_name: lastName,
      });
      setSuccessProfile("Dane profilu zostały zaktualizowane!");
      const user = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          username,
          first_name: firstName,
          last_name: lastName,
        })
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

  // Zmiana emaila
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

  // Zmiana hasła
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
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Ustawienia użytkownika
      </h1>

      {/* Zmiana profilu */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Dane profilu</h2>
        <form onSubmit={handleProfileChange} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {errorProfile && <p className="text-red-500">{errorProfile}</p>}
          {successProfile && <p className="text-green-500">{successProfile}</p>}
          <button
            type="submit"
            disabled={loadingProfile}
            className="w-full py-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-md font-semibold hover:from-pink-500 hover:to-yellow-400 transition"
          >
            {loadingProfile ? <LoadingIndicator /> : "Zaktualizuj profil"}
          </button>
        </form>
      </div>

      {/* Zmiana Emaila */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Zmień email</h2>
        <form onSubmit={handleEmailChange} className="space-y-4">
          <input
            type="email"
            placeholder="Nowy email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {errorEmail && <p className="text-red-500">{errorEmail}</p>}
          {successEmail && <p className="text-green-500">{successEmail}</p>}
          <button
            type="submit"
            disabled={loadingEmail}
            className="w-full py-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-md font-semibold hover:from-pink-500 hover:to-yellow-400 transition"
          >
            {loadingEmail ? <LoadingIndicator /> : "Zmień email"}
          </button>
        </form>
      </div>

      {/* Zmiana Hasła */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Zmień hasło</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            placeholder="Aktualne hasło"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Nowe hasło"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Potwierdź nowe hasło"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {errorPassword && <p className="text-red-500">{errorPassword}</p>}
          {successPassword && (
            <p className="text-green-500">{successPassword}</p>
          )}
          <button
            type="submit"
            disabled={loadingPassword}
            className="w-full py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-md font-semibold hover:from-orange-500 hover:to-pink-500 transition"
          >
            {loadingPassword ? <LoadingIndicator /> : "Zmień hasło"}
          </button>
        </form>
      </div>
    </div>
  );
}
