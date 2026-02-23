import { useState } from "react";

const FeaturedCard = ({ item }) => {
  const [h, setH] = useState(false); 

const fonts = {
  serif: "Playfair Display, serif",
  sans: "Inter, sans-serif"
}
const colors = {
  white: "#ffffff",
  accent: "#c8a97e"
};
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.03)",
        padding: "40px 32px",
        transition: "all 0.3s ease",
        transform: h ? "translateY(-6px)" : "translateY(0)",
        cursor: "default",
      }}
    >
      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: "1.1rem",
          fontWeight: 400,
          color: colors.white,
          marginBottom: "10px",
        }}
      >
        {item.title}
      </div>

      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: "0.83rem",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.7,
          fontWeight: 300,
        }}
      >
        {item.description}
      </div>

      <div
        style={{
          marginTop: "20px",
          fontFamily: fonts.sans,
          fontSize: "0.9rem",
          fontWeight: 500,
          color: colors.accent,
        }}
      >
        ₹{item.price}
      </div>

      {item.badge && (
        <span
          style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "3px 10px",
            fontFamily: fonts.sans,
            fontSize: "0.6rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
            border: `1px solid ${colors.accent}`,
            color: colors.accent,
          }}
        >
          {item.badge}
        </span>
      )}
    </div>
  );
};

export default FeaturedCard;