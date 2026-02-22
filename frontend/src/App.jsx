import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./pages/Layout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Generate from "./pages/Generate";
import StartPage from "./pages/StartPage";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import BrowseCalendars from "./pages/BrowseCalendars";
import CreateCalendar from "./pages/CreateCalendar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Settings from "./pages/Settings";
import FlappyBird from "./components/menuElements/FlappyBird";
import ActivateAccount from "./pages/ActivateAccount";
import ProductionList from "./pages/ProductionList";
import StaffPage from "./pages/StaffPage";
import { useEffect, useState } from "react";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tutaj normalnie robisz fetha do swojego API
    // Symulujemy opóźnienie sieci za pomocą setTimeout
    setTimeout(() => {
      setIsLoading(false);
    }, 1500); 
  }, []);
if (isLoading) {
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
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<StartPage />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/activate-account/:uidb64/:token" element={<ActivateAccount />} />
          

          {/* Protected routes */}
          <Route
            path="/ai"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="generate" element={<Generate />} />
            <Route path="staffpage" element={<StaffPage />} />
            <Route path="production-list" element={<ProductionList />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="calendars" element={<BrowseCalendars />} />
            <Route path="create-calendar" element={<CreateCalendar />} />
            <Route path="settings" element={<Settings />} />
            <Route path="logout" element={<Logout />} />
            <Route path="game" element={<FlappyBird />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
