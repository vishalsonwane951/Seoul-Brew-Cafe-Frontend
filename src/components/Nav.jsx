import { useState } from "react";
import { colors, fonts } from "../tokens";

// ─── NAV LINK ────────────────────────────────────────────────────
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

// ─── PROFILE ICON ────────────────────────────────────────────────
const ProfileIcon = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>

      {/* Avatar circle */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width:        38,
          height:       38,
          borderRadius: "50%",
          background:   colors.ink,
          border:       `2px solid ${colors.accent}`,
          cursor:       "pointer",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          flexShrink:   0,
        }}
      >
        {/* User initial or person icon */}
        {user?.name ? (
          <span style={{
            fontFamily: fonts.sans,
            fontSize:   "0.85rem",
            fontWeight: 600,
            color:      "#fff",
            textTransform: "uppercase",
          }}>
            {user.name.charAt(0)}
          </span>
        ) : (
          /* Simple SVG person icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="#fff" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="1.8"
              strokeLinecap="round" fill="none" />
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Click-away overlay */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 299,
            }}
          />

          <div style={{
            position:     "absolute",
            top:          "calc(100% + 10px)",
            right:        0,
            zIndex:       300,
            background:   "#fff",
            border:       `1px solid ${colors.line || "#e8e2d9"}`,
            minWidth:     160,
            boxShadow:    "0 8px 24px rgba(0,0,0,0.10)",
            animation:    "navDropFade 0.18s ease",
          }}>
            {/* User name */}
            {user?.name && (
              <div style={{
                padding:    "12px 18px 8px",
                fontFamily: fonts.sans,
                fontSize:   "0.78rem",
                color:      colors.muted,
                letterSpacing: "1px",
                borderBottom: `1px solid ${colors.line || "#e8e2d9"}`,
              }}>
                {user.name}
              </div>
            )}

            {/* Logout */}
            <button
              onClick={() => { onLogout(); setOpen(false); }}
              style={{
                width:      "100%",
                padding:    "12px 18px",
                background: "none",
                border:     "none",
                textAlign:  "left",
                fontFamily: fonts.sans,
                fontSize:   "0.75rem",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color:      colors.ink,
                cursor:     "pointer",
                display:    "flex",
                alignItems: "center",
                gap:        8,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#faf7f3"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              {/* Logout icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={colors.muted}
                  strokeWidth="1.8" strokeLinecap="round" />
                <polyline points="16 17 21 12 16 7" stroke={colors.ink}
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="21" y1="12" x2="9" y2="12" stroke={colors.ink}
                  strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ─── NAV ─────────────────────────────────────────────────────────
// Props:
//   page      — current active page string
//   setPage   — navigate function
//   scrolled  — boolean (adds shadow/border)
//   user      — null = logged out | { name: "..." } = logged in
//   onLogout  — called when user clicks Logout

const Nav = ({ page, setPage, scrolled, user = null, onLogout = () => {} }) => {
  const [reserveHovered, setReserveHovered] = useState(false);
  const [menuOpen, setMenuOpen]             = useState(false); // mobile menu

  const navPages = ["home", "menu", "order", "reservation"];

  return (
    <>
      {/* Keyframe for dropdown */}
      <style>{`
        @keyframes navDropFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .sb-center-nav { display: none !important; }
          .sb-reserve-btn { display: none !important; }
          .sb-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .sb-hamburger { display: none !important; }
          .sb-mobile-menu { display: none !important; }
        }
      `}</style>

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
        borderBottom:   scrolled ? `1px solid ${colors.line || "#e8e2d9"}` : "1px solid transparent",
        transition:     "height 0.3s, border-color 0.4s",
      }}>

        {/* ── Logo ── */}
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

        {/* ── Center nav links (desktop) ── */}
        <div className="sb-center-nav" style={{
          display:   "flex",
          position:  "absolute",
          left:      "50%",
          transform: "translateX(-50%)",
        }}>
          {navPages.map((p) => (
            <NavLink
              key={p}
              label={p}
              active={page === p}
              onClick={() => setPage(p)}
            />
          ))}
        </div>

        {/* ── Right side ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          {/* Reserve CTA (desktop) */}
          <button
            className="sb-reserve-btn"
            onClick={() => setPage("reservation")}
            onMouseEnter={() => setReserveHovered(true)}
            onMouseLeave={() => setReserveHovered(false)}
            style={{
              padding:       "10px 24px",
              background:    reserveHovered ? colors.accent : colors.ink,
              color:         "#fff",
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

          {/* Login button OR Profile icon */}
          {user ? (
            <ProfileIcon user={user} onLogout={onLogout} />
          ) : (
            <button
              onClick={() => setPage("login")}
              style={{
                padding:       "10px 20px",
                background:    "none",
                border:        `1px solid ${colors.ink}`,
                fontFamily:    fonts.sans,
                fontSize:      "0.72rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color:         colors.ink,
                cursor:        "pointer",
                transition:    "background 0.25s, color 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.ink;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = colors.ink;
              }}
            >
              Login
            </button>
          )}

          {/* Hamburger (mobile) */}
          <button
            className="sb-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display:        "none", // overridden by media query
              flexDirection:  "column",
              gap:            5,
              background:     "none",
              border:         "none",
              cursor:         "pointer",
              padding:        4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display:      "block",
                width:        22,
                height:       1.5,
                background:   colors.ink,
                transition:   "transform 0.2s, opacity 0.2s",
                transform:
                  menuOpen && i === 0 ? "translateY(6.5px) rotate(45deg)" :
                  menuOpen && i === 2 ? "translateY(-6.5px) rotate(-45deg)" :
                  "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown menu ── */}
      <div
        className="sb-mobile-menu"
        style={{
          position:   "fixed",
          top:        scrolled ? "64px" : "72px",
          left:       0,
          right:      0,
          zIndex:     199,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.line || "#e8e2d9"}`,
          display:    menuOpen ? "flex" : "none",
          flexDirection: "column",
          padding:    "16px 0 24px",
        }}
      >
        {navPages.map((p) => (
          <button
            key={p}
            onClick={() => { setPage(p); setMenuOpen(false); }}
            style={{
              padding:       "14px 32px",
              background:    page === p ? "#faf7f3" : "none",
              border:        "none",
              textAlign:     "left",
              fontFamily:    fonts.sans,
              fontSize:      "0.78rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color:         page === p ? colors.ink : colors.muted,
              cursor:        "pointer",
            }}
          >
            {p}
          </button>
        ))}

        {/* Reserve + Login in mobile menu */}
        <div style={{ borderTop: `1px solid ${colors.line || "#e8e2d9"}`, margin: "12px 0 0" }}>
          <button
            onClick={() => { setPage("reservation"); setMenuOpen(false); }}
            style={{
              padding:       "14px 32px",
              background:    "none",
              border:        "none",
              textAlign:     "left",
              fontFamily:    fonts.sans,
              fontSize:      "0.78rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color:         colors.accent,
              cursor:        "pointer",
              width:         "100%",
            }}
          >
            Reserve a Table
          </button>

          {user ? (
            <button
              onClick={() => { onLogout(); setMenuOpen(false); }}
              style={{
                padding:       "14px 32px",
                background:    "none",
                border:        "none",
                textAlign:     "left",
                fontFamily:    fonts.sans,
                fontSize:      "0.78rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color:         colors.muted,
                cursor:        "pointer",
                width:         "100%",
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => { setPage("login"); setMenuOpen(false); }}
              style={{
                padding:       "14px 32px",
                background:    "none",
                border:        "none",
                textAlign:     "left",
                fontFamily:    fonts.sans,
                fontSize:      "0.78rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color:         colors.ink,
                cursor:        "pointer",
                width:         "100%",
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Nav;