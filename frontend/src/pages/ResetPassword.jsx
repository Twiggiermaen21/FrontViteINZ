import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({ uid, token, new_password: password });
        const res = await axios.post("http://localhost:8000/auth/password-reset-confirm/", {
        uid,
        token,
        new_password: password,
      });
      
      setMessage(res.data.detail);
    } catch (err) {
      setMessage("Błąd resetowania hasła");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Resetuj hasło</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Nowe hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-400 to-orange-400 text-white font-semibold rounded-lg hover:from-pink-500 hover:to-yellow-400 transition-all"
          >
            Resetuj hasło
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
