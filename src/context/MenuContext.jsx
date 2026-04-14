// context/MenuContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";
import socket from "../services/Soket.js";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ FIX: Removed stale `menu.length` check — it always read 0 due to
  //    empty deps array (stale closure). Server-side cache handles deduplication.
  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/menu/user");
      setMenu(res.data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch menu");
      console.error("Menu fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []); // stable reference, no deps needed

  // Initial fetch on mount
  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // ✅ Force refresh when admin changes menu via socket
  useEffect(() => {
    socket.on("menu:refresh", fetchMenu);
    return () => socket.off("menu:refresh", fetchMenu);
  }, [fetchMenu]);

  return (
    <MenuContext.Provider value={{ menu, loading, setMenu, error, fetchMenu }}>
      {children}
    </MenuContext.Provider>
  );
};