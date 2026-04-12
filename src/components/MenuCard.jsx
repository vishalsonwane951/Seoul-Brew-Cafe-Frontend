import { useState } from "react";
import { colors, fonts } from "../tokens";

const isImage = (val) =>
  val && (val.startsWith("data:") || val.startsWith("http"));

const MenuCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? colors.off : colors.white,
        padding: "28px 32px",
        cursor: "pointer",
        margin: "5px",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontFamily: fonts.serif,
            fontSize: "1rem",
            color: colors.ink,
          }}
        >
          {item.title}
        </span>
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: "0.85rem",
            fontWeight: 500,
            color: colors.accent,
            whiteSpace: "nowrap",
          }}
        >
          ₹{item.price}
        </span>
      </div>

      {isImage(item.imageUrl) && !imgError ? (
        <div style={{
          width: "100%",
          height: "200px",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "12px",
        }}>
          <img
            src={item.imageUrl}
            alt={item.title}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ) : (
        <div style={{
          width: "100%",
          height: "200px",
          borderRadius: "8px",
          marginBottom: "12px",
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
        }}>
          {!isImage(item.imageUrl) && item.imageUrl ? item.imageUrl : "☕"}
        </div>
      )}

      <p
        style={{
          fontFamily: fonts.sans,
          fontSize: "0.82rem",
          color: colors.muted,
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {item.description}
      </p>
    </div>
  );
};

export default MenuCard;