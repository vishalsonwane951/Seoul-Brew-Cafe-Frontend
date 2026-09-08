import { colors, fonts, fontSizes } from "../tokens";

const Eyebrow = ({ text }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "clamp(12px, 2vw, 20px)", // ← responsive spacing
  }}>
    <div style={{
      width: "32px",
      height: "1px",
      background: colors.accent,
      flexShrink: 0,
    }} />
    <span style={{
      fontFamily: fonts.sans,
      fontSize: fontSizes.eyebrow,
      letterSpacing: "4px",
      textTransform: "uppercase",
      color: colors.accent,
      fontWeight: 400,
    }}>
      {text}
    </span>
  </div>
);

export default Eyebrow;