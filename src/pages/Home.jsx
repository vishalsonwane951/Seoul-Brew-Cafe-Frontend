import { useState, useEffect } from "react";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";
import OurStoryCard from "../components/OurStoryCard";
import API from '../services/api.js';
import { useNavigate } from "react-router-dom";

const useBreakpoint = () => {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024 };
};

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

// ── HERO ──────────────────────────────────────────────────────
const Hero = ({ setPage }) => {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();
  const isNarrow = isMobile || isTablet;

  return (
    <section style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr",
      paddingTop: "72px",
      animation: "heroFade 0.8s ease forwards",
    }}>
      <style>{`
        @keyframes heroFade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatCoffee { 0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);} }
        @keyframes subtitleFade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Text column */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: isMobile ? "40px 20px" : isTablet ? "60px 40px" : "80px 56px",
        order: isNarrow ? 2 : 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", animation: "subtitleFade 1s ease 0.2s both" }}>
          <div style={{ width: "40px", height: "1px", background: colors.accent }} />
          <span style={{ fontFamily: fonts.sans, fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase", color: colors.accent, fontWeight: 400 }}>
            Sihgad Law College, Pune
          </span>
        </div>
        <h1 style={{ fontFamily: fonts.serif, fontSize: "clamp(3rem, 5.5vw, 6rem)", fontWeight: 700, lineHeight: 0.95, color: colors.ink, letterSpacing: "-2px", margin: 0, animation: "heroFade 1s ease 0.1s both" }}>
          SEOUL<br />
          <em style={{ fontStyle: "italic", fontWeight: 400, color: colors.accent }}>BREW</em>
          <span style={{ display: "block", fontFamily: fonts.sans, fontSize: "0.18em", fontStyle: "normal", fontWeight: 300, color: colors.muted, letterSpacing: "8px", textTransform: "uppercase", marginTop: "12px" }}>Cafe</span>
        </h1>
        <p style={{ fontFamily: fonts.sans, fontSize: "1.05rem", lineHeight: 1.8, color: colors.body, maxWidth: "400px", fontWeight: 300, marginTop: "28px", animation: "subtitleFade 1s ease 0.4s both" }}>
          A Taste of Seoul in Every Sip — inspired by the slow-sip culture of Seoul's finest café alleys, where every cup is a considered ritual.
        </p>
        <div style={{ display: "flex", gap: "16px", marginTop: "48px", animation: "subtitleFade 1s ease 0.6s both", flexWrap: "wrap" }}>
          <BtnFill onClick={() => navigate('/menu')}>Explore Menu</BtnFill>
          <BtnOutline onClick={() => navigate('/order')}>Order Now</BtnOutline>
        </div>
        <span style={{ fontFamily: fonts.korean, fontSize: "0.75rem", color: colors.line, letterSpacing: "6px", marginTop: "40px", animation: "subtitleFade 1s ease 0.8s both" }}>
          CAFE
        </span>
      </div>

      {/* Image column */}
      <div style={{
        background: colors.surface,
        position: "relative",
        overflow: "hidden",
        borderRadius: "45px",
        minHeight: isNarrow ? "56vw" : "unset",
        order: isNarrow ? 1 : 2,
      }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
          <img src="https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <span style={{ fontFamily: fonts.korean, fontSize: "0.85rem", color: colors.muted, letterSpacing: "8px" }}>SEOUL Brew cafe..!</span>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: `1px solid ${colors.line}` }}>
          {[["18+", "Drinks"], ["4.9★", "Rating"], ["3K+", "Guests/Mo"]].map(([num, label], i) => (
            <div key={label} style={{ padding: "20px 16px", textAlign: "center", borderRight: i < 2 ? `1px solid ${colors.line}` : "none", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(4px)" }}>
              <div style={{ fontFamily: fonts.serif, fontSize: "1.5rem", fontWeight: 700, color: colors.ink1 }}>{num}</div>
              <div style={{ fontFamily: fonts.sans, fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.muted, marginTop: "3px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── ABOUT ─────────────────────────────────────────────────────
const About = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const isNarrow = isMobile || isTablet;

  return (
    <section style={{ background: colors.off, padding: isMobile ? "64px 20px" : isTablet ? "80px 40px" : "120px 56px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr",
          gap: isNarrow ? "56px" : "80px",
          alignItems: "center",
        }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "100%", aspectRatio: "4/5", background: colors.surface, border: `1px solid ${colors.line}`, display: "flex", borderRadius: "45px", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
              <img src="https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg" alt="" style={{ width: "100%" }} />
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
};

// ── OUR STORIES (replaces Featured / FeaturedCard) ────────────
const STORIES = [
  {
    _id: "s1",
    title: "How Seoul Brew Began",
    description: "From a small apartment kitchen in Mapo-gu to a full café — the story of our very first cup and the people who believed in us.",
    imageUrl: "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
    author: "Seo Jiyeon",
    date: "Mar 2024",
  },
  {
    _id: "s2",
    title: "Finding Our Matcha Source",
    description: "We travelled to Uji, Japan to meet the farmers behind every sip of our ceremonial-grade matcha.",
    imageUrl: "https://i.pinimg.com/736x/4f/93/69/4f936904e706fb6542af2ebe31e630c5.jpg",
    author: "Kim Taehwan",
    date: "Jun 2024",
  },
  {
    _id: "s3",
    title: "Community First, Always",
    description: "Every Sunday we open our space to local artists, readers, and dreamers. Here's why that will never change.",
    imageUrl: "https://i.pinimg.com/736x/49/f2/bb/49f2bb784e3a7b98fda2a19a409a8666.jpg",
    author: "Aisha M.",
    date: "Aug 2024",
  },
];

const OurStories = () => {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();
  const [linkH, setLinkH] = useState(false);

  return (
    <section style={{ background: colors.ink, padding: isMobile ? "64px 20px" : isTablet ? "80px 40px" : "120px 56px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header row */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "flex-end",
          gap: isMobile ? "12px" : 0,
          marginBottom: "clamp(32px, 5vw, 56px)",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "1px", background: colors.accent }} />
              <span style={{ fontFamily: fonts.sans, fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase", color: colors.accent }}>
                Our Stories
              </span>
            </div>
            <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400, color: colors.white, lineHeight: 1.1, margin: 0 }}>
              Moments We <em style={{ fontStyle: "italic", color: colors.accent }}>Cherish</em>
            </h2>
          </div>

          <button
            onMouseEnter={() => setLinkH(true)}
            onMouseLeave={() => setLinkH(false)}
            onClick={() => navigate('/blogs')}
            style={{
              background: "none", border: "none", padding: 0,
              fontFamily: fonts.sans, fontSize: "0.75rem",
              letterSpacing: "2px", textTransform: "uppercase",
              color: linkH ? colors.white : "rgba(255,255,255,0.4)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
              transition: "color 0.2s", marginBottom: "4px", fontWeight: 400,
            }}
          >
            <span>→</span> All Stories
          </button>
        </div>

        {/* Story cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: "1px",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
          {STORIES.map((story) => (
            <OurStoryCard key={story._id} item={story} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ── TESTIMONIALS ──────────────────────────────────────────────
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
      <p style={{ fontFamily: fonts.sans, fontSize: "0.9rem", color: colors.ink, lineHeight: 1.6, marginBottom: "16px" }}>"{quote}"</p>
      <span style={{ fontFamily: fonts.sans, fontSize: "0.75rem", fontWeight: 500, color: colors.accent }}>{author}</span>
    </div>
  );
};

const Testimonials = () => {
  const { isMobile, isTablet } = useBreakpoint();
  return (
    <section style={{ padding: isMobile ? "64px 20px" : isTablet ? "80px 40px" : "120px 56px", background: colors.off }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)",
          gap: "24px",
        }}>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </div>
      </div>
    </section>
  );
};

// ── HOME PAGE ─────────────────────────────────────────────────
export default function HomePage({ setPage }) {
  return (
    <>
      <Hero setPage={setPage} />
      <About />
      <OurStories />
      <Testimonials />
    </>
  );
}