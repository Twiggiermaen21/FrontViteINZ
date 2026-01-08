import Form from "../components/Form";
import { NAME_WEB } from "../assets/assets";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
const apiUrl = `${import.meta.env.VITE_API_URL}/api`;
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#1e1f1f] text-[#d2e4e2]">
      <div className="flex w-full max-w-6xl min-h-[40rem] bg-[#2a2b2b] rounded-3xl overflow-hidden shadow-2xl border border-[#374b4b]">
        {/* LEWA STRONA (zachowana oryginalna kolorystyka) */}
        <div className="flex-1 bg-gradient-to-br from-[#6d8f91] via-[#8ebabb] to-[#afe5e6] relative flex items-center justify-center p-10">
          <img
            src="/astronaut.png"
            alt="Astronaut"
            className="max-h-80 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
          <div className="text-white text-6xl font-extrabold absolute bottom-10 left-10 drop-shadow-md">
            {NAME_WEB}
          </div>
        </div>

        {/* PRAWA STRONA (ciemny motyw jak dashboard) */}
        <div className="flex-1 p-12 flex flex-col justify-center bg-[#1e1f1f]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#e0e0e0]">
              Witamy w {NAME_WEB}!
            </h2>
            <p className="text-sm text-[#989c9e] mt-2">
              Zaloguj się, aby kontynuować swoją przygodę.
            </p>
          </div>

          <Form route="/api/token/" method="login" />

          <div className="text-center mt-8 text-[#989c9e] text-sm">
            Nie masz jeszcze konta?{" "}
            <a
              href="/register"
              className="text-[#afe5e6] font-semibold hover:underline hover:text-white transition-colors"
            >
              Zarejestruj się
            </a>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-[#374b4b]"></div>
            <span className="mx-4 text-[#989c9e] text-sm">
              lub zaloguj się przez Google
            </span>
            <div className="flex-grow border-t border-[#374b4b]"></div>
          </div>

          <div className="flex justify-center">
            <div className="transition-transform duration-300 hover:scale-[1.03]">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const res = await axios.post(
                    "http://localhost:8000/auth/google/",
                    { credential: credentialResponse.credential },
                    { withCredentials: true }
                  );
                  localStorage.setItem(ACCESS_TOKEN, res.data.token.access);
                  localStorage.setItem(REFRESH_TOKEN, res.data.token.refresh);
                  localStorage.setItem("user", JSON.stringify(res.data.user));
                  navigate("/ai/dashboard");
                }}
                onError={() => {
                  navigate("/login");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
