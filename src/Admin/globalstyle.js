// ── Design Tokens ──────────────────────────────────────────
export const T = {
  // Admin palette — dark espresso
  adminBg:      '#1a0f0a',
  adminSurface: '#2c1a10',
  adminBorder:  'rgba(196,137,42,0.18)',
  adminAmber:   '#c4892a',
  adminCream:   '#f5f0e8',

  // Customer palette — warm cream
  custBg:       '#faf6f0',
  custSurface:  '#ffffff',
  custBorder:   'rgba(61,31,13,0.1)',
  custBrown:    '#3d1f0d',
  custAmber:    '#c4892a',
  custAccent:   '#e8552a',

  // Shared
  green:  '#2a5c3f',
  red:    '#8b2020',
  mono:   "'Space Mono', monospace",
  serif:  "'Noto Serif KR', serif",
  display:"'Bebas Neue', sans-serif",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600;700&family=Space+Mono:ital,wght@0,400;0,700&family=Bebas+Neue&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ${T.serif}; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { background: ${T.adminAmber}; border-radius: 2px; }
  input, select, textarea, button { font-family: inherit; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  .fade-up    { animation: fadeUp  0.35s ease both; }
  .pulse-dot  { animation: pulse   2s infinite; }
`;