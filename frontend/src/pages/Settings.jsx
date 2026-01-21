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
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const [errorProfile, setErrorProfile] = useState("");
  const [successProfile, setSuccessProfile] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [successEmail, setSuccessEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [successPassword, setSuccessPassword] = useState("");
  const [successImage, setSuccessImage] = useState("");
  const [errorImage, setErrorImage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (user) {
      setUsername(user.username || "");
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setPreviewImage(user.profile_image || null);
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
       window.location.reload();
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
      window.location.reload();
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveImage = async () => {
    if (!profileImage) return;
    setLoadingImage(true);
    setErrorImage("");
    setSuccessImage("");

    const formData = new FormData();
    formData.append("profile_image", profileImage);

    try {
      const response = await api.put("/user/update-profile-image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessImage("Zdjęcie profilowe zostało zapisane!");
      const user = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          profile_image: response.data.profile_image_url,
        })
      );
    } catch (err) {
      setErrorImage("Nie udało się zapisać zdjęcia profilowego.");
    } finally {
      setLoadingImage(false);
      window.location.reload();
    }
  };
  return (
    <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl mx-auto pt-6 px-4">
      {/* LEWA STRONA — zdjęcie profilowe */}
      <div className="flex flex-col items-center bg-[#2a2b2b] p-8 rounded-4xl shadow-lg w-full lg:w-1/3">
        <h2 className="text-xl text-white font-semibold mb-6">
          Zdjęcie profilowe
        </h2>

        <div className="relative w-48 h-48 mb-6">
          <img
            src={previewImage || "/default-avatar.png"}
            alt="Profil"
            className="w-full h-full object-cover rounded-full border-4 border-[#afe5e6] shadow-lg"
          />
        </div>

        <input
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm rounded-lg bg-[#1e1f1f] text-[#d2e4e2] border border-[#374b4b] hover:border-[#6d8f91] cursor-pointer file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-[#6d8f91] file:to-[#afe5e6] file:text-[#1e1f1f] hover:file:opacity-90"
          type="file"
        ></input>

        {errorImage && <p className="text-red-500 text-sm">{errorImage}</p>}
        {successImage && (
          <p className="text-green-500 text-sm">{successImage}</p>
        )}

        <button
          onClick={handleSaveImage}
          disabled={loadingImage}
          className="w-full mt-2 py-3 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f] hover:opacity-90 transition-all duration-300"
        >
          {loadingImage ? <LoadingIndicator /> : "Zapisz zdjęcie"}
        </button>
      </div>

      {/* PRAWA STRONA — ustawienia */}
      <div className="flex-1 bg-[#2a2b2b] rounded-4xl p-8 shadow-lg space-y-8">
        <h1 className="text-2xl font-semibold text-white">
          Ustawienia użytkownika
        </h1>

        {/* Profil */}
        <form onSubmit={handleProfileChange} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f]"
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f]"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f]"
          />
          {errorProfile && <p className="text-red-500">{errorProfile}</p>}
          {successProfile && <p className="text-green-500">{successProfile}</p>}
          <button
            type="submit"
            disabled={loadingProfile}
            className="w-full py-3 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f]"
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
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f]"
          />
          {errorEmail && <p className="text-red-500">{errorEmail}</p>}
          {successEmail && <p className="text-green-500">{successEmail}</p>}
          <button
            type="submit"
            disabled={loadingEmail}
            className="w-full py-3 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f]"
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
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f]"
          />
          <input
            type="password"
            placeholder="Nowe hasło"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f]"
          />
          <input
            type="password"
            placeholder="Potwierdź nowe hasło"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#d2e4e2] text-[#1e1f1f]"
          />
          {errorPassword && <p className="text-red-500">{errorPassword}</p>}
          {successPassword && (
            <p className="text-green-500">{successPassword}</p>
          )}
          <button
            type="submit"
            disabled={loadingPassword}
            className="w-full py-3 text-lg rounded-xl font-bold bg-gradient-to-r from-[#6d8f91] to-[#afe5e6] text-[#1e1f1f]"
          >
            {loadingPassword ? <LoadingIndicator /> : "Zmień hasło"}
          </button>
        </form>
      </div>
    </div>
  );
}
