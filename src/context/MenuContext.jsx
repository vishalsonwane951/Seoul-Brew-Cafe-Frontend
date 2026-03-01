import { createContext, useState, useEffect } from "react";
import API from "../services/api";
import { socket } from "../Soket";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get("/menu");
      setMenu(res.data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch menu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    socket.on("menu:refresh", fetchMenu);
    return () => socket.off("menu:refresh", fetchMenu);
  }, []);

  return (
    <MenuContext.Provider value={{ menu, loading, setMenu, error, fetchMenu }}>
      {children}
    </MenuContext.Provider>
  );
};