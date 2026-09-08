import { useState } from "react";

const fonts = { serif: "Playfair Display, serif", sans: "Inter, sans-serif" };
const colors = { white: "#ffffff", accent: "#c8a97e" };

const isImage = (val) =>
  val && (val.startsWith("data:") || val.startsWith("http"));

const OurStoryCard = ({ item }) => {
  const [h, setH] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: "rgba(255,255,255,0.03)",
        transition: "all 0.3s ease",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Photo (hero, fills top) ── */}
      <div style={{
        width: "100%",
        height: "clamp(200px, 28vw, 280px)",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}>
        {isImage(item.imageUrl) && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.5s ease",
              transform: h ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3.5rem",
          }}>
            {!isImage(item.imageUrl) && item.imageUrl ? item.imageUrl : "📷"}
          </div>
        )}

        {/* subtle dark gradient over bottom of photo for legibility */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "50%",
          background: "linear-gradient(to bottom, transparent, rgba(10,5,2,0.55))",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── Caption block ── */}
      <div style={{
        padding: "clamp(16px, 3vw, 28px) clamp(16px, 3vw, 28px)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flex: 1,
      }}>

        {/* Title */}
        <div style={{
          fontFamily: fonts.serif,
          fontSize: "clamp(1rem, 2vw, 1.15rem)",
          fontWeight: 400,
          color: colors.white,
          lineHeight: 1.35,
        }}>
          {item.title}
        </div>

        {/* Description / excerpt */}
        {item.description && (
          <div style={{
            fontFamily: fonts.sans,
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.75,
            fontWeight: 300,
          }}>
            {item.description}
          </div>
        )}

        {/* Author + Date row — pushed to bottom */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          {item.author && (
            <span style={{
              fontFamily: fonts.sans,
              fontSize: "0.7rem",
              color: colors.accent,
              letterSpacing: "0.5px",
            }}>
              — {item.author}
            </span>
          )}
          {item.date && (
            <span style={{
              fontFamily: fonts.sans,
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}>
              {item.date}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurStoryCard;