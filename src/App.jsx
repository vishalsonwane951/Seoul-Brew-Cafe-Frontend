// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Menu from "./pages/Menu";
// import Cart from "./pages/Cart";
// import Home from "./pages/Home";
// import Reservation from "./pages/Reservation";
// import Checkout from "./pages/Checkout";
// import Navbar from "./components/Navbar";
// import Loader from "./pages/Loader";

// function App() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) return <Loader />;

//   return (
//     <Router>
//       <Navbar />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/menu" element={<Menu />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/reservation" element={<Reservation />} />
//         <Route path="/checkout" element={<Checkout />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import { useState, useEffect } from "react";
import { GOOGLE_FONTS_URL } from "./tokens";

// ── Components ──
import Nav    from "./components/Nav";
import Footer from "./components/Footer";

// ── Pages ──
import HomePage        from "./pages/Home";
import MenuPage        from "./pages/MenuPage";
import OrderPage       from "./pages/OrderPage";
import ReservationPage from "./pages/Reservation";

// ─── APP ─────────────────────────────────────────────────────────
// Root component: manages active page + scroll state.
// Navigation is handled via state (no React Router required).

export default function App() {
  const [page, setPage]       = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for Nav shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Navigate: switch page + scroll to top
  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Page map
  const pages = {
    home:        <HomePage        setPage={navigate} />,
    menu:        <MenuPage />,
    order:       <OrderPage />,
    reservation: <ReservationPage />,
  };

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={GOOGLE_FONTS_URL} rel="stylesheet" />

      {/* Base reset — minimal, no classes */}
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

      <Nav page={page} setPage={navigate} scrolled={scrolled} />

      <main>
        {pages[page]}
        <Footer setPage={navigate} />
      </main>
    </>
  );
}