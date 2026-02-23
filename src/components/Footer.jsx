import { useState } from "react";
import { colors, fonts } from "../tokens";


const FooterLink = ({ children, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <li style={{ listStyle: "none" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          background:    "none",
          border:        "none",
          padding:       0,
          fontFamily:    fonts.sans,
          fontSize:      "0.82rem",
          fontWeight:    300,
          color:         h ? colors.white : "rgba(255,255,255,0.4)",
          cursor:        onClick ? "pointer" : "default",
          transition:    "color 0.2s",
          textAlign:     "left",
        }}
      >
        {children}
      </button>
    </li>
  );
};

const ColHead = ({ children }) => (
  <div style={{
    fontFamily:    fonts.sans,
    fontSize:      "0.65rem",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color:         "rgba(255,255,255,0.25)",
    marginBottom:  "20px",
    fontWeight:    400,
  }}>
    {children}
  </div>
);

const Footer = ({ setPage }) => (
  <footer style={{ background: colors.ink }}>

    {/* Main grid */}
    <div style={{
      display:             "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr",
      gap:                 "60px",
      padding:             "80px 56px 60px",
      maxWidth:            "1200px",
      margin:              "0 auto",
      borderBottom:        "1px solid rgba(255,255,255,0.06)",
    }}>

      {/* Brand */}
      <div>
        <div style={{
          fontFamily:    fonts.serif,
          fontSize:      "1.3rem",
          color:         colors.white,
          letterSpacing: "3px",
          marginBottom:  "6px",
        }}>
          SEOUL BREW
        </div>
        <div style={{
          fontFamily:    fonts.korean,
          fontSize:      "0.65rem",
          color:         "rgba(255,255,255,0.3)",
          letterSpacing: "5px",
          marginBottom:  "20px",
        }}>
          서울 브루 카페
        </div>
        <p style={{
          fontFamily: fonts.sans,
          fontSize:   "0.83rem",
          fontWeight: 300,
          lineHeight: 1.8,
          color:      "rgba(255,255,255,0.35)",
          maxWidth:   "260px",
        }}>
          Inspired by the slow-sip culture of Seoul's finest café alleys. Every cup, a considered ritual.
        </p>
      </div>

      {/* Navigate */}
      <div>
        <ColHead>Navigate</ColHead>
        <ul style={{ padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          {[["Home","home"],["Menu","menu"],["Order","order"],["Reservation","reservation"]].map(([label, p]) => (
            <FooterLink key={p} onClick={() => setPage(p)}>{label}</FooterLink>
          ))}
        </ul>
      </div>

      {/* Hours */}
      <div>
        <ColHead>Hours</ColHead>
        <ul style={{ padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <ColHead>Contact</ColHead>
        <ul style={{ padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          {["12 Hanok Lane, Koregaon Park","Pune, MH 411001","+91 98765 43210","hello@seoulbrew.in"].map((t) => (
            <FooterLink key={t}>{t}</FooterLink>
          ))}
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div style={{
      padding:        "24px 56px",
      maxWidth:       "1200px",
      margin:         "0 auto",
      display:        "flex",
      justifyContent: "space-between",
      alignItems:     "center",
    }}>
      <span style={{ fontFamily: fonts.sans, fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>
        © {new Date().getFullYear()} Seoul Brew Cafe. All rights reserved.
      </span>
      <div style={{ display: "flex", gap: "12px" }}>
        {["IG","FB","TW","YT"].map((s) => {
          const [h, setH] = useState(false);
          return (
            <div
              key={s}
              onMouseEnter={() => setH(true)}
              onMouseLeave={() => setH(false)}
              style={{
                width:       "34px",
                height:      "34px",
                border:      h ? `1px solid ${colors.white}` : "1px solid rgba(255,255,255,0.1)",
                display:     "flex",
                alignItems:  "center",
                justifyContent: "center",
                color:       h ? colors.white : "rgba(255,255,255,0.3)",
                fontSize:    "0.7rem",
                fontFamily:  fonts.sans,
                cursor:      "pointer",
                transition:  "all 0.2s",
              }}
            >
              {s}
            </div>
          );
        })}
      </div>
    </div>
  </footer>
);

export default Footer;