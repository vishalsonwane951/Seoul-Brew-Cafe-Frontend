import { useContext, useState } from "react";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";
import MenuCard from "../components/MenuCard";
import { useApp } from "../Admin/context/AppContext";

const TabBtn = ({ label, count, active, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "12px 20px",           // ← slightly tighter on mobile
        background: "none",
        border: "none",
        borderBottom: active ? `1px solid ${colors.ink}` : "1px solid transparent",
        marginBottom: "-1px",
        fontFamily: fonts.sans,
        fontSize: "0.75rem",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontWeight: 400,
        color: active ? colors.ink : h ? colors.body : colors.muted,
        cursor: "pointer",
        transition: "color 0.2s, border-color 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        whiteSpace: "nowrap",          // ← prevents wrapping in scroll
        flexShrink: 0,                 // ← keeps tab width stable
      }}
    >
      {label}
      {count != null && (
        <span style={{ fontSize: "0.6rem", color: active ? colors.accent : colors.muted }}>
          ({count})
        </span>
      )}
    </button>
  );
};

const MenuPage = () => {
  const { menu } = useApp();
  const [activeTab, setActiveTab] = useState("matcha");
  const tabs = [...new Set(menu.map(item => item.category.toLowerCase()))];
  const items = menu.filter(item => item.category.toLowerCase() === activeTab.toLowerCase());
  const available = items.filter((i) => i.stock === true);
  const unavailable = items.filter((i) => i.stock === false);

  return (
    <div style={{ paddingTop: "72px" }}>
      <section style={{
        background: colors.white,
        padding: "clamp(32px, 6vw, 60px) clamp(16px, 5vw, 56px) clamp(60px, 10vw, 120px)", // ← fluid padding
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Eyebrow text="What We Serve" />
          <h2 style={{
            fontFamily: fonts.serif,
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            fontWeight: 400,
            color: colors.ink,
            lineHeight: 1.15,
            margin: "0 0 32px 0",
          }}>
            The <em style={{ fontStyle: "italic", color: colors.accent }}>Menu</em>
          </h2>

          {/* Tab bar — horizontal scroll on mobile */}
          <div style={{
            display: "flex",
            borderBottom: `1px solid ${colors.line}`,
            marginBottom: "clamp(24px, 4vw, 48px)",
            overflowX: "auto",           // ← scroll on mobile
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",      // hide scrollbar Firefox
            msOverflowStyle: "none",     // hide scrollbar IE
          }}>
            {tabs.map((tab) => (
              <TabBtn
                key={tab}
                label={tab}
                count={menu.filter(item => item.category.toLowerCase() === tab).length}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>

          {available.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", // ← 1 col on mobile
              gap: "1px",
              background: colors.line,
              border: `1px solid ${colors.line}`,
              marginBottom: unavailable.length > 0 ? "40px" : 0,
            }}>
              {available.map((item) => <MenuCard key={item._id} item={item} />)}
            </div>
          )}

          {unavailable.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 0 16px" }}>
                <div style={{ width: "24px", height: "1px", background: colors.line }} />
                <span style={{
                  fontFamily: fonts.sans,
                  fontSize: "0.65rem",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: colors.muted,
                }}>Currently Unavailable</span>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                gap: "1px",
                background: colors.line,
                border: `1px solid ${colors.line}`,
                opacity: 0.45,
              }}>
                {unavailable.map((item) => <MenuCard key={item._id} item={item} />)}
              </div>
            </>
          )}

          {items.length === 0 && (
            <div style={{
              padding: "clamp(32px, 6vw, 64px)",
              textAlign: "center",
              fontFamily: fonts.sans,
              color: colors.muted,
              fontSize: "0.88rem",
              fontStyle: "italic",
              border: `1px solid ${colors.line}`,
            }}>
              No items in this category right now.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuPage;