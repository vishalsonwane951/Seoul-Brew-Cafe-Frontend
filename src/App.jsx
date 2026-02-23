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

export default function App() {
  const [page, setPage] = useState("home");
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
  };

  // Navigate: switch page + scroll to top
  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Page map (state-based navigation)
  const pages = {
    home: <HomePage setPage={navigate} />,
    menu: <MenuPage />,
    order: <OrderPage />,
    reservation: <ReservationPage />,
    login: <LoginPage setPage={navigate} setUser={setUser} />,    // pass setUser
    register: <RegisterPage setPage={navigate} setUser={setUser} />, // pass setUser
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

      {/* Nav with logged-in user */}
      <Nav page={page} setPage={navigate} scrolled={scrolled} user={user} onLogout={handleLogout} />

      <main>
        {pages[page]}
        <Footer setPage={navigate} />
      </main>
    </>
  );
}