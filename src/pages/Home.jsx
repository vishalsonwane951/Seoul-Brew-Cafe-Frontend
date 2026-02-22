import { useState, useEffect } from "react";
import axios from "axios";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";
import FeaturedCard from "../components/FeaturedCard";
import API from '../services/api.js';
// import { ErrorBox } from "../components/Skeleton"; // if you want retry support

// ── Shared Buttons ────────────────────────────────────────────────
const BtnFill = ({ children, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        padding: "15px 40px",
        background: h ? colors.accent : colors.ink,
        color: colors.white,
        border: `1px solid ${h ? colors.accent : colors.ink}`,
        fontFamily: fonts.sans,
        fontSize: "0.75rem",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontWeight: 400,
        cursor: "pointer",
        transition: "all 0.25s",
      }}
    >
      {children}
    </button>
  );
};

const BtnOutline = ({ children, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        padding: "15px 40px",
        background: h ? colors.ink : "transparent",
        color: h ? colors.white : colors.ink,
        border: `1px solid ${colors.ink}`,
        fontFamily: fonts.sans,
        fontSize: "0.75rem",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontWeight: 400,
        cursor: "pointer",
        transition: "all 0.25s",
      }}
    >
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────
// 1. HERO SECTION
const Hero = ({ setPage }) => (
  <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", paddingTop: "72px", animation: "heroFade 0.8s ease forwards" }}>
    <style>{`
      @keyframes heroFade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes floatCoffee { 0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);} }
      @keyframes subtitleFade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>

    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", animation: "subtitleFade 1s ease 0.2s both" }}>
        <div style={{ width: "40px", height: "1px", background: colors.accent }} />
        <span style={{ fontFamily: fonts.sans, fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase", color: colors.accent, fontWeight: 400 }}>
          Est. 2019 · Koregaon Park, Pune
        </span>
      </div>
      <h1 style={{ fontFamily: fonts.serif, fontSize: "clamp(3rem, 5.5vw, 6rem)", fontWeight: 700, lineHeight: 0.95, color: colors.ink, letterSpacing: "-2px", margin: 0, animation: "heroFade 1s ease 0.1s both" }}>
        Seoul<br />
        <em style={{ fontStyle: "italic", fontWeight: 400, color: colors.accent }}>Brew</em>
        <span style={{ display: "block", fontFamily: fonts.sans, fontSize: "0.18em", fontStyle: "normal", fontWeight: 300, color: colors.muted, letterSpacing: "8px", textTransform: "uppercase", marginTop: "12px" }}>Cafe</span>
      </h1>
      <p style={{ fontFamily: fonts.sans, fontSize: "1.05rem", lineHeight: 1.8, color: colors.body, maxWidth: "400px", fontWeight: 300, marginTop: "28px", animation: "subtitleFade 1s ease 0.4s both" }}>
        A Taste of Seoul in Every Sip — inspired by the slow-sip culture of Seoul's finest café alleys, where every cup is a considered ritual.
      </p>
      <div style={{ display: "flex", gap: "16px", marginTop: "48px", animation: "subtitleFade 1s ease 0.6s both" }}>
        <BtnFill onClick={() => setPage("menu")}>Explore Menu</BtnFill>
        <BtnOutline onClick={() => setPage("order")}>Order Now</BtnOutline>
      </div>
      <span style={{ fontFamily: fonts.korean, fontSize: "0.75rem", color: colors.line, letterSpacing: "6px", marginTop: "40px", animation: "subtitleFade 1s ease 0.8s both" }}>
        서울 브루 카페
      </span>
    </div>

    <div style={{ background: colors.surface, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: "6rem", animation: "floatCoffee 5s ease-in-out infinite" }}>☕</div>
        <span style={{ fontFamily: fonts.korean, fontSize: "0.85rem", color: colors.muted, letterSpacing: "8px" }}>서울의 정신으로</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: `1px solid ${colors.line}` }}>
        {[["18+", "Drinks"], ["4.9★", "Rating"], ["3K+", "Guests/Mo"]].map(([num, label], i) => (
          <div key={label} style={{ padding: "20px 16px", textAlign: "center", borderRight: i < 2 ? `1px solid ${colors.line}` : "none" }}>
            <div style={{ fontFamily: fonts.serif, fontSize: "1.5rem", fontWeight: 700, color: colors.ink }}>{num}</div>
            <div style={{ fontFamily: fonts.sans, fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.muted, marginTop: "3px" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// 2. ABOUT SECTION
const About = () => (
  <section style={{ background: colors.off, padding: "120px 56px" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%", aspectRatio: "4/5", background: colors.surface, border: `1px solid ${colors.line}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            <span style={{ fontFamily: fonts.korean, fontSize: "4rem", color: colors.line }}>카페</span>
            <div style={{ position: "absolute", bottom: "-12px", right: "-12px", width: "80px", height: "80px", border: `1px solid ${colors.accent}`, opacity: 0.4 }} />
          </div>
          <div style={{ position: "absolute", top: "-16px", left: "-16px", width: "88px", height: "88px", borderRadius: "50%", background: colors.accent, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px" }}>
            <span style={{ fontFamily: fonts.serif, fontSize: "1.4rem", fontWeight: 700, color: colors.white, lineHeight: 1 }}>6+</span>
            <span style={{ fontFamily: fonts.sans, fontSize: "0.5rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.white, opacity: 0.85 }}>Years</span>
          </div>
        </div>

        <div>
          <Eyebrow text="Our Story" />
          <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 400, color: colors.ink, lineHeight: 1.15, margin: "0 0 24px 0" }}>
            Inspired by the<br />
            <em style={{ fontStyle: "italic", color: colors.accent }}>streets of Seoul</em>
          </h2>
          <p style={{ fontFamily: fonts.sans, fontSize: "0.93rem", lineHeight: 1.9, color: colors.body, fontWeight: 300, marginBottom: "20px" }}>
            Inspired by the vibrant streets of Seoul, we bring authentic Korean coffee culture to your city. From handcrafted espresso to signature desserts, every detail is brewed with passion.
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: "0.93rem", lineHeight: 1.9, color: colors.body, fontWeight: 300 }}>
            Every ingredient is sourced with care — single-origin beans from Jeju Island, premium ceremonial-grade matcha, and traditional recipes passed through our founder's family for three generations.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: colors.line, border: `1px solid ${colors.line}`, marginTop: "40px" }}>
            {[
              ["Handcrafted", "Every cup made fresh to order"],
              ["Authentic", "True to Seoul's café culture"],
              ["Sourced", "Direct-trade Korean ingredients"],
              ["Community", "10% profits to local artisans"],
            ].map(([title, desc]) => {
              const [h, setH] = useState(false);
              return (
                <div key={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? colors.surface : colors.white, padding: "18px 20px", transition: "background 0.2s" }}>
                  <div style={{ fontFamily: fonts.sans, fontSize: "0.78rem", fontWeight: 500, color: colors.ink, marginBottom: "3px" }}>{title}</div>
                  <div style={{ fontFamily: fonts.sans, fontSize: "0.74rem", color: colors.muted, lineHeight: 1.5, fontWeight: 300 }}>{desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// 3. FEATURED FAVORITES (with Axios, no skeleton, no FeaturedCard)
const Featured = ({ setPage }) => {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState(null);
  const [linkH, setLinkH] = useState(false);

  const fetchMenu = async () => {
    try {
      const res = await API.get("/menu");
      setMenu(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch menu");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const featured = menu
    ? [
      ...(menu.coffee?.filter((i) => i.available !== false).slice(0, 1) ?? []),
      ...(menu.matcha?.filter((i) => i.available !== false).slice(0, 1) ?? []),
      ...(menu.food?.filter((i) => i.available !== false).slice(0, 1) ?? []),
    ]
    : [];

  return (
    <section style={{ background: colors.ink, padding: "120px 56px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "1px", background: colors.accent }} />
              <span style={{ fontFamily: fonts.sans, fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase", color: colors.accent }}>
                Fan Favourites
              </span>
            </div>
            <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: colors.white, lineHeight: 1.1, margin: 0 }}>
              Featured <em style={{ fontStyle: "italic", color: colors.accent }}>Favorites</em>
            </h2>
          </div>

          <button
            onMouseEnter={() => setLinkH(true)}
            onMouseLeave={() => setLinkH(false)}
            onClick={() => setPage("menu")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: fonts.sans,
              fontSize: "0.75rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 400,
              color: linkH ? colors.white : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.2s",
              marginBottom: "4px",
            }}
          >
            <span>→</span> Full Menu
          </button>
        </div>

        {error && <div style={{ marginBottom: "24px" }}><ErrorBox message={error} onRetry={fetchMenu} /></div>}

        
          {featured.map((item) => (
            <FeaturedCard key={item.id} item={item} />
          ))}
        
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// 4. TESTIMONIALS
const TESTIMONIALS = [
  { quote: "Best coffee experience I've ever had.", author: "Priya S." },
  { quote: "Feels like a cafe straight from Seoul.", author: "Rahul K." },
  { quote: "Amazing ambiance and delicious desserts!", author: "Aisha M." },
];

const TestimonialCard = ({ quote, author }) => {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ background: colors.white, border: `1px solid ${h ? colors.accent : colors.line}`, padding: "40px 32px", transition: "all 0.3s ease", transform: h ? "translateY(-6px)" : "translateY(0)" }}
    >
      <p style={{ fontFamily: fonts.sans, fontSize: "0.9rem", color: colors.ink, lineHeight: 1.6, marginBottom: "16px" }}>“{quote}”</p>
      <span style={{ fontFamily: fonts.sans, fontSize: "0.75rem", fontWeight: 500, color: colors.accent }}>{author}</span>
    </div>
  );
};

const Testimonials = () => (
  <section style={{ padding: "120px 56px", background: colors.off }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
        {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// HOME PAGE
export default function HomePage({ setPage }) {
  return (
    <>
      <Hero setPage={setPage} />
      <About />
      <Featured setPage={setPage} />
      <Testimonials />
    </>
  );
}
