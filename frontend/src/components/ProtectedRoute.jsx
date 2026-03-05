import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";


function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-[#1e1f1f]">
      {/* Kręcące się kółko z kolorami Twojego motywu */}
      <div className="w-16 h-16 rounded-full border-[5px] border-[#3c3d3d] border-t-[#afe5e6] border-r-[#6d8f91] animate-spin mb-6"></div>
      
      {/* Pulsujący tekst */}
      <div className="text-[#d2e4e2] text-lg font-semibold tracking-wider uppercase animate-pulse">
        Chwila moment, pobieramy dane...
      </div>
    </div>
  );
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;