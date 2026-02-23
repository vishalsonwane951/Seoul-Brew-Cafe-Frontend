import { useContext, useState } from "react";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";
import MenuCard from "../components/MenuCard";
import { MenuContext } from "../context/MenuContext";

const TabBtn = ({ label, count, active, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "14px 28px",
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
  const { menu, loading, error, fetchMenu } = useContext(MenuContext);
  const [activeTab, setActiveTab] = useState("coffee");

  const tabs = ["coffee", "matcha", "food"];
  const items = Array.isArray(menu?.[activeTab]) ? menu[activeTab] : [];
  const available = items.filter((i) => i.available !== false);
  const unavailable = items.filter((i) => i.available === false);

  if (loading) return <div style={{ padding: "32px" }}>Loading menu…</div>;
  if (error)
    return (
      <div style={{ padding: "32px", color: "red" }}>
        {error} <button onClick={fetchMenu}>Retry</button>
      </div>
    );

  return (
    <div style={{ paddingTop: "72px" }}>
      <section style={{ background: colors.white, padding: "60px 56px 120px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Eyebrow text="What We Serve" />
          <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 400, color: colors.ink, lineHeight: 1.15, margin: "0 0 40px 0" }}>
            The <em style={{ fontStyle: "italic", color: colors.accent }}>Menu</em>
          </h2>

          <div style={{ display: "flex", borderBottom: `1px solid ${colors.line}`, marginBottom: "48px" }}>
            {tabs.map((tab) => (
              <TabBtn key={tab} label={tab} count={menu[tab]?.length} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
            ))}
          </div>

          {available.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1px", background: colors.line, border: `1px solid ${colors.line}`, marginBottom: unavailable.length > 0 ? "40px" : 0 }}>
              {available.map((item) => <MenuCard key={item._id} item={item}/>)}
            </div>
          )}

          {unavailable.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "0 0 16px" }}>
                <div style={{ width: "24px", height: "1px", background: colors.line }} />
                <span style={{ fontFamily: fonts.sans, fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: colors.muted }}>Currently Unavailable</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1px", background: colors.line, border: `1px solid ${colors.line}`, opacity: 0.45 }}>
                {unavailable.map((item) => <MenuCard key={item._id} item={item} />)}
              </div>
            </>
          )}

          {/* If Empty */}
          {items.length === 0 && (
            <div style={{ padding: "64px", textAlign: "center", fontFamily: fonts.sans, color: colors.muted, fontSize: "0.88rem", fontStyle: "italic", border: `1px solid ${colors.line}` }}>
              No items in this category right now.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuPage;