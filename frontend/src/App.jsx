import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./pages/Layout";
import ForgotPassword from "./pages/ForgotPassword";
import Generate from "./pages/Generate";
import StartPage from "./pages/StartPage";
import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import BrowseCalendars from "./pages/BrowseCalendars";
import CreateCalendar from "./pages/CreateCalendar";
import EditCalendar from "./pages/EditCalendar";
import EditImage from "./pages/EditImage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Settings from "./pages/Settings";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<StartPage />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />

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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="calendars" element={<BrowseCalendars />} />
            <Route path="create-calendar" element={<CreateCalendar />} />
            <Route path="edit-calendar" element={<EditCalendar />} />
            <Route path="edit" element={<EditImage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
