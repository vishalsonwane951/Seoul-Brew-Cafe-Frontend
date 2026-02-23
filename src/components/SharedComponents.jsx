import { useState, useEffect } from "react";
import { C, FONT_URL, KEYFRAMES } from "../constants";


export function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById("sb-fonts")) return;
    const link = document.createElement("link");
    link.id = "sb-fonts";
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "sb-kf";
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);
  }, []);
}

export function CupIllustration() {
  return (
    <svg width="148" height="168" viewBox="0 0 160 180" fill="none"
      style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.55))" }}>
      <ellipse cx="80" cy="160" rx="58" ry="9" fill="#6b3a1a" opacity=".45" />
      <path d="M36 82 Q31 142 51 156 Q80 166 109 156 Q129 142 124 82Z" fill="#4a2008" />
      <path d="M36 82 Q31 142 51 156 Q80 166 109 156 Q129 142 124 82Z"
        fill="url(#cupShade)" opacity=".4" />
      <ellipse cx="80" cy="82" rx="44" ry="11" fill="#6b3a1a" />
      <ellipse cx="80" cy="82" rx="39" ry="9" fill="#180d05" />
      <ellipse cx="80" cy="82" rx="28" ry="6" fill="#1e1008" />
      <path
        d="M71 79 Q71 73 75.5 73 Q80 73 80 77.5 Q80 73 84.5 73 Q89 73 89 79 Q89 85 80 90 Q71 85 71 79Z"
        fill="#c49a6c" opacity=".55" />
      <path d="M124 97 Q150 97 150 117 Q150 137 124 137"
        stroke="#5a2d0c" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M124 97 Q146 97 146 117 Q146 137 124 137"
        stroke="#7a3d14" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M43 97 Q41 122 46 144"
        stroke="rgba(255,255,255,0.07)" strokeWidth="5" strokeLinecap="round" />
      <defs>
        <linearGradient id="cupShade" x1="160" y1="82" x2="36" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BrandPanel() {
  const beans = [
    { top: "14%",    left: "9%",   dur: "4s",   delay: "0s"   },
    { top: "67%",    left: "17%",  dur: "5.2s", delay: "1.1s" },
    { top: "31%",    right: "11%", dur: "6s",   delay: "0.4s" },
    { bottom: "19%", right: "7%",  dur: "4.6s", delay: "2s"   },
    { bottom: "40%", left: "13%",  dur: "5.8s", delay: "1.6s" },
    { top: "52%",    right: "22%", dur: "4.2s", delay: "0.8s" },
  ];

  const steams = [
    { w: 80, h: 80, bottom: "37%", left: "41%", dur: "3s",   delay: "0s"   },
    { w: 60, h: 60, bottom: "37%", left: "48%", dur: "3.6s", delay: "0.9s" },
    { w: 70, h: 70, bottom: "37%", left: "36%", dur: "3.3s", delay: "1.6s" },
  ];

  return (
    <div style={{
      position: "relative", width: "46%", background: C.mocha,
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", overflow: "hidden",
      animation: "sb-slideLeft 0.85s cubic-bezier(0.16,1,0.3,1) both",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px",
      }} />

      {beans.map((b, i) => (
        <div key={i} style={{
          position: "absolute", width: 11, height: 17, borderRadius: "50%",
          background: "rgba(196,154,108,0.18)",
          animation: `sb-bean ${b.dur} ease-in-out infinite alternate`,
          animationDelay: b.delay, ...b,
        }} />
      ))}

      {steams.map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: s.w, height: s.h,
          borderRadius: "50%", opacity: 0,
          background: "radial-gradient(circle, rgba(196,154,108,0.22) 0%, transparent 70%)",
          animation: `sb-steam ${s.dur} ease-in infinite`,
          animationDelay: s.delay, bottom: s.bottom, left: s.left,
        }} />
      ))}

      {/* Brand text */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 22,
        animation: "sb-fadeUp 1s 0.35s both",
      }}>
        <CupIllustration />

        <div style={{
          fontFamily: "'Playfair Display',serif", color: C.cream,
          fontSize: "clamp(2.2rem,3.8vw,3.2rem)", letterSpacing: "-0.02em",
          lineHeight: 1, textAlign: "center",
        }}>
          <span style={{ fontStyle: "italic", color: C.latte }}>Seoul</span> Brew
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 1, background: C.latte, opacity: 0.45 }} />
          <div style={{ fontFamily: "'Nanum Myeongjo',serif", color: C.latte,
            fontSize: "0.82rem", letterSpacing: "0.28em" }}>
            CAFE
          </div>
          <div style={{ width: 36, height: 1, background: C.latte, opacity: 0.45 }} />
        </div>

        <p style={{
          fontFamily: "'Playfair Display',serif", fontStyle: "italic",
          color: C.cream, opacity: 0.62, fontSize: "0.95rem",
          textAlign: "center", maxWidth: 240, lineHeight: 1.7,
        }}>
          "Where every cup tells a story of Seoul's spirit"
        </p>

        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: "50%",
              background: C.latte, opacity: i === 2 ? 0.9 : 0.35,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/*  Form input field  */
export function Field({ label, type = "text", placeholder, value, onChange, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: "0.68rem", fontWeight: 600,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: C.mocha, marginBottom: 6, fontFamily: "'DM Sans',sans-serif",
      }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="sb-input"
        style={{
          width: "100%", padding: "12px 15px",
          border: `1.5px solid ${error ? "#c0392b" : "rgba(26,15,10,0.13)"}`,
          borderRadius: 5, background: "white",
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem",
          color: C.espresso, outline: "none",
          transition: "border-color 0.22s, box-shadow 0.22s",
        }}
      />
      {error && (
        <p style={{ fontSize: "0.71rem", color: "#c0392b", marginTop: 4,
          fontFamily: "'DM Sans',sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function PrimaryBtn({ children, onClick, loading }) {
  return (
    <button onClick={onClick} className="sb-btn-main" disabled={loading}
      style={{
        width: "100%", padding: "14px",
        background: C.espresso, color: C.cream,
        border: "none", borderRadius: 5,
        fontFamily: "'DM Sans',sans-serif", fontSize: "0.79rem",
        fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
        cursor: loading ? "not-allowed" : "pointer", marginTop: 6,
        transition: "background 0.3s, transform 0.18s",
        opacity: loading ? 0.72 : 1,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
      {loading && (
        <span style={{
          width: 13, height: 13,
          border: "2px solid rgba(245,240,232,0.35)",
          borderTopColor: C.cream, borderRadius: "50%",
          animation: "sb-spin 0.7s linear infinite", display: "inline-block",
        }} />
      )}
      {children}
    </button>
  );
}

export function OrDivider() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      margin: "18px 0", color: "rgba(26,15,10,0.3)", fontSize: "0.74rem",
      fontFamily: "'DM Sans',sans-serif",
    }}>
      <div style={{ flex: 1, height: 1, background: "rgba(26,15,10,0.1)" }} />
      or continue with
      <div style={{ flex: 1, height: 1, background: "rgba(26,15,10,0.1)" }} />
    </div>
  );
}

export function GoogleBtn() {
  return (
    <button className="sb-social"
      style={{
        width: "100%", padding: "12px",
        border: "1.5px solid rgba(26,15,10,0.12)",
        borderRadius: 5, background: "white",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        fontFamily: "'DM Sans',sans-serif", fontSize: "0.87rem",
        color: C.espresso, cursor: "pointer",
        transition: "border-color 0.22s, background 0.22s",
      }}>
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );
}

export function FormPanel({ children }) {
  return (
    <div style={{
      flex: 1, background: C.cream,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "48px 36px", overflowY: "auto",
      animation: "sb-slideRight 0.85s cubic-bezier(0.16,1,0.3,1) both",
    }}>
      <div style={{
        width: "100%", maxWidth: 410,
        animation: "sb-fadeUp 1s 0.55s both",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ── Page form heading ── */
export function FormHeading({ title, subtitle }) {
  return (
    <>
      <h2 style={{
        fontFamily: "'Playfair Display',serif", fontSize: "1.85rem",
        color: C.espresso, marginBottom: 6, lineHeight: 1.1,
      }}>
        {title}
      </h2>
      <p style={{
        color: "rgba(26,15,10,0.46)", fontSize: "0.87rem",
        marginBottom: 28, fontFamily: "'DM Sans',sans-serif",
      }}>
        {subtitle}
      </p>
    </>
  );
}