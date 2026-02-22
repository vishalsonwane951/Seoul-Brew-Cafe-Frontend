import { useEffect } from "react";
import { colors, fonts } from "../tokens";

// ─── TOAST ───────────────────────────────────────────────────────
// Auto-dismiss notification shown at bottom-right

const Toast = ({ msg, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position:    "fixed",
      bottom:      "32px",
      right:       "32px",
      background:  colors.ink,
      color:       colors.white,
      padding:     "14px 24px",
      zIndex:      9999,
      fontFamily:  fonts.sans,
      fontSize:    "0.78rem",
      letterSpacing: "1px",
      fontWeight:  300,
      borderLeft:  `3px solid ${colors.accent}`,
      animation:   "slideToast 0.3s ease",
    }}>
      <style>{`
        @keyframes slideToast {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {msg}
    </div>
  );
};

export default Toast;