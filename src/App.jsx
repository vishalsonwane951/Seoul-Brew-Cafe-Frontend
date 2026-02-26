import { useState, useEffect } from "react";
import { GOOGLE_FONTS_URL } from "./tokens";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

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

// ── Admin guard — blocks non-admin users from /admin routes ──────────────────
function ProtectedRoute({ children }) {
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;

  if (!user || user.admin !== true) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh', background: '#0e0e0e',
        gap: 12
      }}>
        <div style={{ fontSize: '2.5rem' }}>🚫</div>
        <h2 style={{ color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Access Denied</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Outfit, sans-serif' }}>
          You don't have permission to view this page.
        </p>
        <a href="/login" style={{ color: '#b5894a', fontFamily: 'Outfit, sans-serif', marginTop: 8 }}>
          Go to Login
        </a>
      </div>
    );
  }

  return children;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
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
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Hide Nav & Footer for admin users or on /admin routes
  const isAdmin = user?.admin === true && location.pathname.startsWith('/admin');
  const showLayout = !isAdmin;

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

      {/* Nav — only for regular users */}
      {showLayout && (
        <Nav scrolled={scrolled} user={user} onLogout={handleLogout} />
      )}

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage setUser={setUser} />} />

          {/* ── ADMIN PORTAL ── */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
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
      </main>

      {/* Footer — only for regular users */}
      {showLayout && <Footer />}
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