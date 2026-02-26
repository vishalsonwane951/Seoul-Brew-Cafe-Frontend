import { useState, useEffect } from "react";
import { GOOGLE_FONTS_URL } from "./tokens";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

// ── Components ──
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ── Pages ──
import HomePage from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import OrderPage from "./pages/OrderPage";
import ReservationPage from "./pages/Reservation";

// Admin Pages
// import { Staff, Inventory, Analytics, Reviews, Settings } from './admin/pages/index';
import AdminLayout from "./Admin/components/AdminLayout";
import Overview from "./Admin/pages/Overview";
import Orders from "./Admin/pages/Orders";
import Menu from "./Admin/pages/Menu";
import Reservations from "./Admin/pages/Reservations";
import Staff from "./Admin/pages/Staff";
import Inventory from "./Admin/pages/Inventory";
import Analytics from "./Admin/pages/Analytics";
import Reviews from "./Admin/pages/Reviews";
import Settings from "./Admin/pages/Settings";
// import { Analytics, Inventory, Reviews, Settings, Staff } from "./Admin/pages/AdminPages";

// Wrapper component to use navigate inside App
function AppContent() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  // Track scroll for Nav shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Check localStorage for persisted user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Logout (LOGIC SAME)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // go to home
  };

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={GOOGLE_FONTS_URL} rel="stylesheet" />

      {/* Base reset */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
          -webkit-font-smoothing: antialiased;
          color: #4a4540;
        }
        ::selection { background: #b5894a; color: white; }
        input, select, textarea, button { font-family: inherit; }
      `}</style>

      {/* Nav */}
      <Nav
        scrolled={scrolled}
        user={user}
        onLogout={handleLogout}
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />}/>
          <Route path="/register" element={<RegisterPage setUser={setUser} />}/>

          {/* ── ADMIN PORTAL ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="menu" element={<Menu />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="staff" element={<Staff />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<navigate to="/" replace />} />
        </Routes>

        {/* <Footer /> */}
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
} 