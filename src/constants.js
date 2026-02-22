/* ─────────────────────────────────────────
   SEOUL BREW — Shared Design Tokens
───────────────────────────────────────── */

export const C = {
  cream:    "#f5f0e8",
  espresso: "#1a0f0a",
  mocha:    "#3d1f0f",
  latte:    "#c49a6c",
  foam:     "#ede8df",
  blush:    "#d4846a",
  dark:     "#120a06",
};

export const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Nanum+Myeongjo:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap";

export const KEYFRAMES = `
  *, *::before, *::after { box-sizing: border-box; }
  @keyframes sb-slideLeft  { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes sb-slideRight { from{transform:translateX(100%);opacity:0}  to{transform:translateX(0);opacity:1} }
  @keyframes sb-fadeUp     { from{transform:translateY(24px);opacity:0}  to{transform:translateY(0);opacity:1} }
  @keyframes sb-formSwap   { from{opacity:0;transform:translateY(8px)}   to{opacity:1;transform:translateY(0)} }
  @keyframes sb-steam {
    0%   { transform:translateY(0) scale(1);        opacity:0; }
    25%  { opacity:.55; }
    100% { transform:translateY(-170px) scale(2.8); opacity:0; }
  }
  @keyframes sb-bean {
    from { transform:translateY(0) rotate(0deg); }
    to   { transform:translateY(-18px) rotate(22deg); }
  }
  @keyframes sb-tabLine {
    from { transform:scaleX(0); }
    to   { transform:scaleX(1); }
  }
  @keyframes sb-spin { to { transform: rotate(360deg); } }
  .sb-input::placeholder { color:rgba(26,15,10,0.28) !important; }
  .sb-input:focus {
    border-color:#d4846a !important;
    box-shadow:0 0 0 3px rgba(212,132,106,0.14) !important;
  }
  .sb-btn-main:hover  { background:#3d1f0f !important; transform:translateY(-1px) !important; }
  .sb-btn-main:active { transform:translateY(0) !important; }
  .sb-social:hover    { border-color:#c49a6c !important; background:#ede8df !important; }
  .sb-link:hover      { text-decoration:underline !important; }
`;