import { createContext, useContext, useEffect, useRef, useState } from 'react';
import API from '../../services/api';

const AppContext = createContext({});
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [cart, setCart] = useState([]);

  const [loadingMenu, setLoadingMenu] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [menuError, setMenuError] = useState(null);
  const [reservationError, setReservationError] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // ✅ FIX: Read user + token from localStorage, not hardcoded
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ✅ FIX: Always read token from localStorage via interceptor — no need to pass manually
  const token = localStorage.getItem("token") || user?.token;

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
  const fetchMenu = async () => {
    try {
      setLoadingMenu(true);
      setMenuError(null);

      const res = await API.get("/menu/user");

      setMenu((res.data || []).map(m => ({
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
        recipe: m.recipe || [],
      })));

    } catch (err) {
      setMenuError("Failed to fetch menu");
      showToast("Failed to fetch menu items.");
    } finally {
      setLoadingMenu(false);
    }
  };

  // Menu is public — browsing it never requires login. Fetch once on
  // mount regardless of auth state (previously this was gated behind
  // `if (!token) return`, which left the menu empty for guests).
  useEffect(() => {
    fetchMenu();
  }, []);

  // ── Fetch Reservations ─────────────────────────────────
  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      setReservationError(null);

      const res = await API.get("/reservations");

      setReservations(
        Array.isArray(res.data)
          ? res.data
          : res.data?.reservations || []
      );

    } catch (error) {
      setReservationError("Failed to fetch reservations");
      setReservations([]);
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // ── Create Reservation ─────────────────────────────────
  const createReservation = async (formData) => {
    try {
      const res = await API.post("/reservations", formData);

      setReservations(prev => [
        res.data?.reservation,
        ...(Array.isArray(prev) ? prev : [])
      ].filter(Boolean));

      showToast("Reservation added!");
      return true;

    } catch (error) {
      showToast("Failed to add reservation");
      return false;
    }
  };

  // ── Cart Handlers ──────────────────────────────────────
  const addToCart = (item, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c =>
          c.id === item.id ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prev, { ...item, qty }];
    });
    showToast(`${item.name} added to cart!`);
  };

  const removeFromCart = (id) =>
    setCart(prev => prev.filter(c => c.id !== id));

  const updateCartQty = (id, qty) =>
    setCart(prev =>
      qty <= 0
        ? prev.filter(c => c.id !== id)
        : prev.map(c => c.id === id ? { ...c, qty } : c)
    );

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  // ── Place Order ────────────────────────────────────────
  // Login is required here — and only here — not for browsing the menu
  // or adding items to the cart.
  const placeOrder = (customerName) => {
    if (!token || !user) {
      showToast('Please log in to place an order.');
      return null;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return null;
    }

    const newOrder = {
      id: String(Date.now()).slice(-4),
      customer: customerName || user?.name,
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
    <AppContext.Provider
      value={{
        menu,
        loadingMenu,
        fetchMenu,

        orders,
        setOrders,

        reservations,
        loadingReservations,
        fetchReservations,
        createReservation,

        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartCount,
        reservationError,
        menuError,

        placeOrder,
        toast,
        showToast,
        setMenu,

        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}