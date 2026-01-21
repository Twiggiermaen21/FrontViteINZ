import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom"; // Import Link do nawigacji

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
      // Upewnij się, że endpoint pasuje do Twojego backendu (często jest to /auth/password-reset/)
      await api.post("/auth/send-email/", { email });

      setMessage(
        "Jeśli konto istnieje, wysłaliśmy na podany adres email link do resetu hasła."
      );
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd. Spróbuj ponownie później.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1f1f] text-[#d2e4e2] p-4">
      <div className="w-full max-w-md bg-[#2a2b2b] rounded-3xl shadow-2xl border border-[#374b4b] p-8">
        
        <h2 className="text-3xl font-bold mb-2 text-center text-[#e0e0e0]">
          Nie pamiętasz hasła?
        </h2>
        <p className="text-sm text-[#989c9e] text-center mb-8">
          Podaj swój adres email, a wyślemy Ci instrukcje resetowania hasła.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold uppercase tracking-wider text-[#9eaead]">
              Email
            </label>
            <input
              type="email"
              placeholder="Wprowadź adres e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 rounded-xl bg-[#1e1f1f] text-[#e8f3f2] placeholder:text-[#6b7a7a] focus:outline-none focus:ring-2 focus:ring-[#6d8f91] border border-[#3b4a4a] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-lg rounded-xl font-bold bg-[#6d8f91] hover:bg-[#afe5e6] hover:text-[#1e1f1f] text-[#e8f3f2] transition-all duration-300 cursor-pointer shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Wysyłanie..." : "Wyślij link resetujący"}
          </button>
        </form>

        {/* Komunikaty */}
        {message && (
          <div className="mt-6 p-4 bg-green-900/20 text-green-400 border border-green-900/50 rounded-xl text-center text-sm font-semibold">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-900/20 text-red-400 border border-red-900/50 rounded-xl text-center text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Link powrotu */}
        <div className="text-center mt-8 text-[#989c9e] text-sm">
          Pamiętasz hasło?{" "}
          <Link
            to="/login"
            className="text-[#afe5e6] font-semibold hover:underline hover:text-white transition-colors cursor-pointer"
          >
            Wróć do logowania
          </Link>
        </div>

      </div>
    </div>
  );
}