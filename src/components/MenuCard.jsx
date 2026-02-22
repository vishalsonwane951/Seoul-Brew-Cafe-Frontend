import { useState } from "react";
import { colors, fonts } from "../tokens";

const MenuCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? colors.off : colors.white,
        padding: "28px 32px",
        cursor: "pointer",
        margin:'5px',
        transition: "background 0.2s",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "8px",
      }}>
        <span style={{
          fontFamily: fonts.serif,
          fontSize: "1rem",
          color: colors.ink,
        }}>
          {item.title}
        </span>
        <span style={{
          fontFamily: fonts.sans,
          fontSize: "0.85rem",
          fontWeight: 500,
          color: colors.accent,
          whiteSpace: "nowrap",
        }}>
          ₹{item.price}
        </span>
      </div>

      <p style={{
        fontFamily: fonts.sans,
        fontSize: "0.82rem",
        color: colors.muted,
        lineHeight: 1.65,
      }}>
        {item.description}
      </p>
    </div>
  );
};

export default MenuCard;