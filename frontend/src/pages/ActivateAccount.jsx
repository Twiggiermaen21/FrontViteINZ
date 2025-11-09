import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ActivateAccount() {
  const { uidb64, token } = useParams();
  const [message, setMessage] = useState("Aktywacja konta...");
  const [error, setError] = useState("");
  const [activated, setActivated] = useState(false); // flaga aktywacji
  const navigate = useNavigate();

  useEffect(() => {
    if (activated) return; // jeśli już aktywowano, nic nie robimy

    const activateUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/activate-account/${uidb64}/${token}/`
        );

        setMessage(res.data.detail);
        setActivated(true); // ustawiamy flagę, żeby nie powtarzać
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        console.error(err);
        setError("Nie udało się aktywować konta. Link mógł wygasnąć.");
        setActivated(true); // blokujemy kolejne próby
      }
    };

    activateUser();
  }, [uidb64, token, navigate, activated]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#1e1f1f] text-[#d2e4e2]">
      <div className="flex w-full max-w-md p-10 bg-[#2a2b2b] rounded-3xl shadow-2xl border border-[#374b4b]">
        <div className="flex flex-col items-center justify-center w-full">
          {error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : (
            <p className="text-center text-[#e0e0e0]">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
