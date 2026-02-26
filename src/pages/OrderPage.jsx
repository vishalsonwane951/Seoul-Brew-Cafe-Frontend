import { useContext, useState, useEffect } from "react";
import { colors, fonts } from "../tokens";
import Eyebrow from "../components/Eyebrow";
import Toast from "../components/Toast";
import { MenuContext } from "../context/MenuContext";
import { CartContext } from "../context/CartContext";
import API from "../services/api.js";
import { socket } from "../Soket.js";
import axios from "axios";

/* ===========================
   Order Row
=========================== */

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

      <div style={{ fontFamily: fonts.sans, fontSize: "0.88rem", fontWeight: 500, color: colors.accent }}>
        ₹{Number(item.price) || 0}
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

/* ===========================
   Quantity Button
=========================== */

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
      }}
    >
      {children}
    </button>
  );
};

/* ===========================
   Cart Component
=========================== */

const Cart = ({ cartArr, total, orderType, onChangeQty, onPlace, placing }) => {
  const [btnHover, setBtnHover] = useState(false);
  const disabled = !Array.isArray(cartArr) || cartArr.length === 0 || placing;

  const totalQty = Array.isArray(cartArr)
    ? cartArr.reduce((s, i) => s + (Number(i.qty) || 0), 0)
    : 0;

  return (
    <div style={{ background: colors.white, border: `1px solid ${colors.line}`, position: "sticky", top: "84px" }}>

      {/* Head */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${colors.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: fonts.serif, fontSize: "1rem", color: colors.ink }}>
          Your Order
        </span>

        {totalQty > 0 && (
          <div style={{ width: "22px", height: "22px", background: colors.ink, color: colors.white, borderRadius: "50%", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.sans }}>
            {totalQty}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        {totalQty === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", fontFamily: fonts.sans, fontSize: "0.85rem", color: colors.muted, fontStyle: "italic", fontWeight: 300 }}>
            Nothing added yet.<br />Pick something delicious.
          </div>
        ) : (
          cartArr.map((item) => {
            const safeQty = Number(item.qty) || 0;
            const safePrice = Number(item.price) || 0;

            return (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: `1px solid ${colors.line}`,
                }}
              >
                <span style={{ fontFamily: fonts.sans, fontSize: "0.83rem", color: colors.body, fontWeight: 300, flex: 1, marginRight: "8px" }}>
                  {item.title}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <QtyBtn onClick={() => onChangeQty(item._id, -1)}>−</QtyBtn>

                  <span style={{ fontFamily: fonts.sans, fontSize: "0.82rem", color: colors.body, minWidth: "16px", textAlign: "center" }}>
                    {safeQty}
                  </span>

                  <QtyBtn onClick={() => onChangeQty(item._id, 1)}>+</QtyBtn>

                  <span style={{ fontFamily: fonts.sans, fontSize: "0.82rem", color: colors.accent, minWidth: "52px", textAlign: "right" }}>
                    ₹{safePrice * safeQty}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${colors.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
          <span style={{ fontFamily: fonts.sans, fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.muted }}>
            Total
          </span>
          <span style={{ fontFamily: fonts.serif, fontSize: "1.3rem", color: colors.ink }}>
            ₹{Number(total) || 0}
          </span>
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

/* ===========================
   Order Page
=========================== */


const ORDER_TYPES = ["Dine-In", "Takeaway", "Delivery"];

const OrderPage = () => {
  const { menu, loading: menuLoading, error } = useContext(MenuContext);
  const { cart, addToCart, changeQty, clearCart } = useContext(CartContext);

  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [orderType, setOrderType] = useState("Dine-In");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const cartArr = Object.values(cart);

  const total = cartArr.reduce((s, i) => {
    const price = Number(i.price) || 0;
    const qty = Number(i.qty) || 0;
    return s + price * qty;
  }, 0);

  const handleAdd = (item) => {
    addToCart(item);
    setToast(`${item.title} added to cart`);
  };

  const handlePlace = async () => {

    /* ✅ CHECK LOGIN */
    const token = localStorage.getItem("token");

    if (!token) {
      setToast("Please login to place order");
      return;
    }

    if (!cartArr.length) {
      setToast("Cart is empty!");
      return;
    }

    const payload = {
      orderType,
      items: cartArr.map((i) => ({
        menuItemId: i._id,
        title: i.title,
        name: localStorage.getItem('name'),
        email: localStorage.getItem("email"),
        quantity: Number(i.qty) || 0,
        price: Number(i.price) || 0,
      })),
      total: total,
    };

    console.log("cartArr:", cartArr);
    console.log("items:", payload.items);
    console.log("totalAmount:", payload.totalAmount);

    try {

      setLoading(true);

      const res = await API.post("/orders", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      /* ✅ SAVE CURRENT ORDER */
      setCurrentOrderId(res.data._id);
      setCurrentStatus(res.data.status);

      /* ✅ SAVE FOR PROFILE PAGE */
      localStorage.setItem("currentOrderId", res.data._id);

      setToast("Order placed! ☕");

      clearCart();

    } catch (err) {

      if (err.response?.status === 401) {
        setToast("Session expired. Please login again.");
      } else {
        setToast("Failed to place order.");
      }

    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {

    const orderId = localStorage.getItem("currentOrderId");
    const token = localStorage.getItem("token");

    if (!orderId || !token) return;

    // Fetch order with auth header
    API.get(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setOrder(res.data);
      })
      .catch(err => {
        console.error("Error fetching order:", err.response?.data || err.message);
      });

    // Listen for socket updates
    socket.on("orderStatusUpdated", (data) => {

      if (data.id === orderId) {

        setOrder(prev => ({
          ...prev,
          status: data.status,
          statusTimestamps: data.statusTimestamps
        }));

      }

    });

    return () => socket.off("orderStatusUpdated");

  }, []);

  if (menuLoading) return <div style={{ padding: "32px" }}>Loading menu…</div>;
  if (error) return <div style={{ padding: "32px", color: "red" }}>{error}</div>;

  // Group menu items by category if menu is an array
  const groupedMenu = Array.isArray(menu)
    ? menu.reduce((acc, item) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {})
    : menu;

  return (
    <div style={{ paddingTop: "72px" }}>
      <section style={{ background: colors.off, padding: "60px 56px 120px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Eyebrow text="Quick Order" />
          <h2
            style={{
              fontFamily: fonts.serif,
              fontSize: "clamp(2rem,3.5vw,3rem)",
              fontWeight: 400,
              color: colors.ink,
            }}
          >
            Order <em style={{ fontStyle: "italic", color: colors.accent }}>Online</em>
          </h2>

          {/* Order Type Buttons */}
          <div style={{ margin: "24px 0" }}>
            {ORDER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                style={{
                  marginRight: "12px",
                  padding: "6px 16px",
                  border: orderType === type ? `2px solid ${colors.accent}` : `1px solid ${colors.line}`,
                  background: "white",
                  cursor: "pointer",
                  fontFamily: fonts.sans,
                  fontSize: "0.85rem",
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px" }}>
            {/* Menu Items */}
            <div>
              {Object.keys(groupedMenu).map((category) => {
                const items = groupedMenu[category]?.filter((i) => i.available !== false) || [];
                if (!items.length) return null;

                return (
                  <div key={category} style={{ marginBottom: "40px" }}>
                    <h3
                      style={{
                        fontFamily: fonts.serif,
                        fontSize: "1rem",
                        color: colors.ink,
                        marginBottom: "12px",
                      }}
                    >
                      {category}
                    </h3>
                    {items.map((item) => (
                      <OrderRow key={item._id} item={item} onAdd={handleAdd} />
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Cart */}
            <Cart
              cartArr={cartArr}
              total={total}
              orderType={orderType}
              onChangeQty={changeQty}
              onPlace={handlePlace}
              placing={loading}
            />
          </div>

          {/* Toast/Confirmation */}
          {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
        </div>
      </section>
    </div>
  );
};

export default OrderPage;