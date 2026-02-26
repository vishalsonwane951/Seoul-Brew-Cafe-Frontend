import { createContext, useState, useEffect } from "react";
import API from '../services/api'

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await API.get("http://localhost:5000/api/menu");
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

  return (
    <MenuContext.Provider value={{ menu, loading,setMenu, error, fetchMenu }}>
      {children}
    </MenuContext.Provider>
  );
};