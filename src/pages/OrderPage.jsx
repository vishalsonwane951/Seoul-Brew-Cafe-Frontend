import { useContext, useState, useEffect } from "react";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";
import Toast from "../components/Toast";
import { MenuContext } from "../context/MenuContext";
import { CartContext } from "../context/CartContext";
import API from '../services/api.js'
import axios from "axios";

// ── Order Row ───────────────────────────────────────────────
const OrderRow = ({ item, onAdd }) => {
  const [hover, setHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "18px 24px",
        background: colors.white,
        border: `1px solid ${hover ? colors.ink : colors.line}`,
        transition: "border-color 0.2s",
        marginBottom: "8px",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: "0.95rem", color: colors.ink, marginBottom: "3px" }}>
          {item.title}
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: "0.78rem", color: colors.muted, fontWeight: 300 }}>
          {item.description}
        </div>
      </div>
      <div style={{ fontFamily: fonts.sans, fontSize: "0.88rem", fontWeight: 500, color: colors.accent, whiteSpace: "nowrap" }}>
        ₹{item.price}
      </div>
      <button
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
        onClick={() => onAdd(item)}
        style={{
          width: "34px",
          height: "34px",
          border: `1px solid ${btnHover ? colors.ink : colors.line}`,
          background: "none",
          color: btnHover ? colors.ink : colors.muted,
          fontSize: "1.1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          flexShrink: 0,
        }}
      >
        +
      </button>
    </div>
  );
};

// ── Qty Button ─────────────────────────────────────────────
const QtyBtn = ({ children, onClick }) => {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        width: "22px",
        height: "22px",
        border: `1px solid ${h ? colors.ink : colors.line}`,
        background: "none",
        color: h ? colors.ink : colors.muted,
        fontSize: "0.85rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
};

// ── Cart Component ─────────────────────────────────────────
const Cart = ({ cartArr, total, orderType, onChangeQty, onPlace, placing }) => {
  const [btnHover, setBtnHover] = useState(false);
  const disabled = cartArr.length === 0 || placing;

  return (
    <div style={{ background: colors.white, border: `1px solid ${colors.line}`, position: "sticky", top: "84px" }}>
      {/* Head */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${colors.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: fonts.serif, fontSize: "1rem", color: colors.ink }}>Your Order</span>
        {cartArr.length > 0 && (
          <div style={{ width: "22px", height: "22px", background: colors.ink, color: colors.white, borderRadius: "50%", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.sans }}>
            {cartArr.reduce((s, i) => s + i.qty, 0)}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        {cartArr.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", fontFamily: fonts.sans, fontSize: "0.85rem", color: colors.muted, fontStyle: "italic", fontWeight: 300 }}>
            Nothing added yet.<br />Pick something delicious.
          </div>
        ) : (
          cartArr.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${colors.line}` }}>
              <span style={{ fontFamily: fonts.sans, fontSize: "0.83rem", color: colors.body, fontWeight: 300, flex: 1, marginRight: "8px" }}>{item.title}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <QtyBtn onClick={() => onChangeQty(item.id, -1)}>−</QtyBtn>
                <span style={{ fontFamily: fonts.sans, fontSize: "0.82rem", color: colors.body, minWidth: "16px", textAlign: "center" }}>{item.qty}</span>
                <QtyBtn onClick={() => onChangeQty(item.id, 1)}>+</QtyBtn>
                <span style={{ fontFamily: fonts.sans, fontSize: "0.82rem", color: colors.accent, minWidth: "52px", textAlign: "right" }}>₹{item.price * item.qty}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${colors.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
          <span style={{ fontFamily: fonts.sans, fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.muted }}>Total</span>
          <span style={{ fontFamily: fonts.serif, fontSize: "1.3rem", color: colors.ink }}>₹{total}</span>
        </div>
        <button
          disabled={disabled}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={onPlace}
          style={{
            width: "100%",
            padding: "14px",
            background: disabled ? colors.line : btnHover ? colors.accent : colors.ink,
            color: disabled ? colors.muted : colors.white,
            border: "none",
            fontFamily: fonts.sans,
            fontSize: "0.72rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: 400,
            cursor: disabled ? "default" : "pointer",
            transition: "background 0.25s",
          }}
        >
          {placing ? "Placing…" : `Place ${orderType} Order`}
        </button>
      </div>
    </div>
  );
};

// ── Confirmation Banner ──────────────────────────────────────
const ConfirmBanner = ({ result, onDismiss }) => (
  <div style={{ padding: "20px 28px", background: "#f0faf3", border: `1px solid #a8d5b5`, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      <span style={{ fontSize: "1.3rem" }}>✓</span>
      <div>
        <div style={{ fontFamily: fonts.sans, fontSize: "0.88rem", color: "#1a6b35", fontWeight: 500 }}>Order {result.id}  Placed!</div>
        <div style={{ fontFamily: fonts.sans, fontSize: "0.8rem", color: "#3a8a55", fontWeight: 300, marginTop: "2px" }}>Status: {result.status}</div>
      </div>
    </div>
    <button onClick={onDismiss} style={{ background: "none", border: "none", color: "#3a8a55", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}>×</button>
  </div>
);

// ── Order Page ─────────────────────────────────────────────
const ORDER_TYPES = ["Dine-In", "Takeaway", "Delivery"];

const OrderPage = () => {
  const { menu, loading, error } = useContext(MenuContext);
  const { cart, addToCart, changeQty, clearCart } = useContext(CartContext);
  const [orderType, setOrderType] = useState("Dine-In");
  const [toast, setToast] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  if (loading) return <div style={{ padding: "32px" }}>Loading menu…</div>;
  if (error) return <div style={{ padding: "32px", color: "red" }}>{error}</div>;

  const cartArr = Object.values(cart);
  const total = cartArr.reduce((s, i) => s + i.price * i.qty, 0);

  const handleAdd = (item) => {
    addToCart(item);
    setToast(`${item.title} added to cart`);
  };


const handlePlace = async () => {
  if (!cartArr.length) return;

  const payload = {
    orderType, // "Dine-In", "Takeaway", "Delivery"
    items: cartArr.map((i) => ({
      menuItemId: i._id,
      title: i.title,
      quantity: i.qty,
      price: i.price,
    })),
    totalAmount: total,
    customerName: "John Doe", // replace with actual customer info
    email: "john@example.com", // replace with actual customer info
  };

  try {
    const res = await API.post("/orders", payload);
    const result = res.data;
    setConfirmation(result); // show confirmation banner
    setToast("Order placed! ☕");
    clearCart();
  } catch (err) {
    console.error(err);
    setToast("Failed to place order.");
  }
};

  // Poll for order status updates
  useEffect(() => {
    if (!confirmation) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${confirmation._id}`);
        const updated = await res.json();
        setConfirmation(updated);
      } catch {}
    }, 5000); // every 5s
    return () => clearInterval(interval);
  }, [confirmation]);

  return (
    <div style={{ paddingTop: "72px", animation: "pageFade 0.4s ease forwards" }}>
      <section style={{ background: colors.off, padding: "60px 56px 120px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Eyebrow text="Quick Order" />
          <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(2rem,3.5vw,3rem)", fontWeight: 400, color: colors.ink, lineHeight: 1.15, margin: "0 0 32px 0" }}>
            Order <em style={{ fontStyle: "italic", color: colors.accent }}>Online</em>
          </h2>

          {confirmation && <ConfirmBanner result={confirmation} onDismiss={() => setConfirmation(null)} />}

          {/* Order type */}
          <div style={{ display: "flex", border: `1px solid ${colors.line}`, width: "fit-content", marginBottom: "32px" }}>
            {ORDER_TYPES.map((t) => (
              <button key={t} onClick={() => setOrderType(t)} style={{
                padding: "11px 24px",
                background: orderType === t ? colors.ink : colors.white,
                color: orderType === t ? colors.white : colors.muted,
                border: "none",
                cursor: "pointer",
              }}>{t}</button>
            ))}
          </div>

          {/* 2-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }}>
            <div>
              {Object.keys(menu).map((category) => {
                const items = menu[category]?.filter((i) => i.available !== false) || [];
                if (items.length === 0) return null;

                return (
                  <div key={category} style={{ marginBottom: "40px" }}>
                    <h3 style={{
                      fontFamily: fonts.sans,
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      color: colors.ink,
                      marginBottom: "16px"
                    }}>
                      {category}
                    </h3>
                    {items.map((item) => <OrderRow key={item._id} item={item} onAdd={handleAdd} />)}
                  </div>
                );
              })}
            </div>

            <Cart
              cartArr={cartArr}
              total={total}
              orderType={orderType}
              onChangeQty={changeQty}
              onPlace={handlePlace}
              placing={false}
            />
          </div>

          {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
        </div>
      </section>
    </div>
  );
};

export default OrderPage;