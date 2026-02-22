import { useState } from "react";
import { colors, fonts } from "../tokens";
// import { NAV_PAGES } from "../data/menuData";

// ─── NAV ─────────────────────────────────────────────────────────
// Fixed top navigation with logo, page links, reserve CTA

const NavLink = ({ label, active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const isActive = active || hovered;

  


  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:      "relative",
        padding:       "8px 20px",
        fontFamily:    fonts.sans,
        fontSize:      "0.75rem",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontWeight:    400,
        color:         isActive ? colors.ink : colors.muted,
        cursor:        "pointer",
        transition:    "color 0.2s",
        background:    "none",
        border:        "none",
        outline:       "none",
      }}
    >
      {label}
      {/* underline indicator */}
      <span style={{
        position:   "absolute",
        bottom:     "4px",
        left:       "20px",
        right:      "20px",
        height:     "1px",
        background: colors.accent,
        transform:  isActive ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 0.25s",
        display:    "block",
      }} />
    </button>
  );
};

const Nav = ({ page, setPage, scrolled }) => {
  const [reserveHovered, setReserveHovered] = useState(false);
  const [navpage, setNavpage] = useState(["home", "menu", "order", "reservation"]); // example


  return (
    <nav style={{
      position:       "fixed",
      top:            0,
      left:           0,
      right:          0,
      zIndex:         200,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      padding:        "0 56px",
      height:         scrolled ? "64px" : "72px",
      background:     "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom:   scrolled ? `1px solid ${colors.line}` : "1px solid transparent",
      transition:     "height 0.3s, border-color 0.4s",
    }}>

      {/* Logo */}
      <div
        onClick={() => setPage("home")}
        style={{ display: "flex", flexDirection: "column", gap: "2px", cursor: "pointer" }}
      >
        <span style={{
          fontFamily:    fonts.serif,
          fontSize:      "1.1rem",
          fontWeight:    700,
          color:         colors.ink,
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}>
          Seoul Brew
        </span>
        <span style={{
          fontFamily:    fonts.korean,
          fontSize:      "0.65rem",
          color:         colors.muted,
          letterSpacing: "4px",
        }}>
          Cafe
        </span>
      </div>

      {/* Center nav links */}
      <div style={{
        display:   "flex",
        position:  "absolute",
        left:      "50%",
        transform: "translateX(-50%)",
      }}>
         <nav>
          {navpage.map((p) => (
        <NavLink
          key={p}
          label={p}
          active={page === p}
          onClick={() => setPage(p)}
        />
      ))}
         </nav>
      </div>

      {/* Reserve CTA */}
      <button
        onClick={() => setPage("reservation")}
        onMouseEnter={() => setReserveHovered(true)}
        onMouseLeave={() => setReserveHovered(false)}
        style={{
          padding:       "10px 24px",
          background:    reserveHovered ? colors.accent : colors.ink,
          color:         colors.white,
          border:        "none",
          fontFamily:    fonts.sans,
          fontSize:      "0.72rem",
          letterSpacing: "2px",
          textTransform: "uppercase",
          fontWeight:    400,
          cursor:        "pointer",
          transition:    "background 0.25s",
        }}
      >
        Reserve
      </button>
    </nav>
  );
};

export default Nav; 