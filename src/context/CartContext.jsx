import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  const addToCart = (item) => {
    setCart((c) => ({
      ...c,
      [item._id]: { ...item, qty: (c[item._id]?.qty || 0) + 1 },
    }));
  };

  const changeQty = (id, delta) => {
    setCart((c) => {
      const nq = (c[id]?.qty || 0) + delta;
      if (nq <= 0) {
        const n = { ...c };
        delete n[id];


        return n;
      }
      return { ...c, [id]: { ...c[id], qty: nq } };
    });
  };


  const clearCart = () => setCart({});

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};