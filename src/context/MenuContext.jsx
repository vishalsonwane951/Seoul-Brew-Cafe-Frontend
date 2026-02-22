import { createContext, useState, useEffect } from "react";
import axios from "axios";
import API from '../services/api'

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState({ coffee: [], matcha: [], food: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get("/menu");
      setMenu(res.data || { coffee: [], matcha: [], food: [] });
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

  return (
    <MenuContext.Provider value={{ menu, loading, error, fetchMenu }}>
      {children}
    </MenuContext.Provider>
  );
};