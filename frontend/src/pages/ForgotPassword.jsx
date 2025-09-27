import { useState } from "react";
import api from "../api"; // Twój axios instance

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // 👇 dostosuj endpoint do swojego backendu
      await api.post("/auth/send-email/", { email });

      setMessage(
        "Jeśli konto istnieje, wysłaliśmy na podany adres email link do resetu hasła."
      );
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Reset hasła</h2>
      <p className="text-sm text-gray-500 mb-6">
        Podaj swój adres email, a wyślemy Ci link do zresetowania hasła.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Wpisz email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition disabled:opacity-50"
        >
          {loading ? "Wysyłanie..." : "Wyślij link resetujący"}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
