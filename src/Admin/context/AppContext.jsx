import { createContext, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import API from '../../services/api';

const AppContext = createContext({});
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  // const [user, setUser] = useState({ name: 'Guest', loggedIn: false, role: 'guest' });

  const [user, setUser] = useState({
  name: "Admin",
  loggedIn: true,
  admin: true,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTlkYjEwYzhmYmRjMDQ5ZTBiMDdmNWMiLCJlbWFpbCI6InZpc2hhbHNvbndhbmU5NTFAZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTc3MjAzODYyNSwiZXhwIjoxNzcyNjQzNDI1fQ.xdcItDJpvslsXQlU6txeBDNwP456nwhXe347zkpRv5g"  // <-- must be a real token issued by your backend
});

  const token = user?.token; // ensure you store the auth token in user object

  // ── Toast ──────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 5000);
  };

  // ── Fetch Menu ─────────────────────────────────────────
  useEffect(() => {
  if (!token || !user || !user.admin) return;

  const fetchMenu = async () => {
    try {
      const res = await API.get("/menu/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMenuItems(
        res.data.map((m) => ({
          _id: m._id,
          title: m.title,
          category: m.category,
          price: m.price,
          description: m.description || "",
          allergens: m.allergens || "",
          available: m.available,
          sales: m.sales || 0,
          stock: m.stock,
          imageUrl: m.imageUrl || "☕",
          kcal: m.kcal || 0,
        }))
      );
    } catch (err) {
      showToast("Failed to fetch menu items.");
    }
  };

  // call immediately first time
  fetchMenu();

  // recall every 5 seconds
  // const interval = setInterval(() => {
  //   fetchMenu();
  // },[]);

  // // cleanup to prevent memory leak
  // return () => clearInterval(interval);

}, [token, user]); //showToast

  // Reservation

const fetchReservations = async () => {
  try {
    const res = await API.get("/reservations");

      setReservations(res.data);
    

  } catch (error) {
    console.error("Fetch reservations error:", error);
  }
};
useEffect(() => {
  fetchReservations();
}, []);

const createReservation = async (formData) => {
  try {
    const res = await API.post("/reservations",formData);

      setReservations(prev => [
        res.data.reservation,
        ...prev
      ]);

      showToast("Reservation added!");
      return true;
    

  } catch (error) {
    showToast("Failed to add reservation");
    return false;
  }
};
  // ── Cart Handlers ───────────────────────────────────────
  const addToCart = (item, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { ...item, qty }];
    });
    showToast(`${item.name} added to cart!`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateCartQty = (id, qty) => setCart(prev => qty <= 0 ? prev.filter(c => c.id !== id) : prev.map(c => c.id === id ? { ...c, qty } : c));
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  const placeOrder = (customerName) => {
    const newOrder = {
      id: String(Date.now()).slice(-4),
      customer: customerName || user.name,
      items: cart.map(c => `${c.name}×${c.qty}`).join(', '),
      total: cartTotal,
      time: 'Just now',
      status: 'Waiting',
      table: 'Takeout',
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    showToast('Order placed! 🎉');
    return newOrder.id;
  };

  return (
    <AppContext.Provider value={{
      menuItems, setMenuItems,
      orders, setOrders,
      reservations, setReservations,fetchReservations,createReservation,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
      placeOrder, toast, showToast,
      user, setUser
    }}>
      {children}
    </AppContext.Provider>
  );
}