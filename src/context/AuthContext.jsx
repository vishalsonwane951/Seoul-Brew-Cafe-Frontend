import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // full user object
  const [token, setToken] = useState(null); // JWT token
  const [role, setRole] = useState(null); // user role (admin/user)
  const [loading, setLoading] = useState(true); // indicates auth is being loaded

  useEffect(() => {
    // Load user and token from localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser); // parse JSON
      setUser(parsedUser);
      setToken(storedToken);
      // setRole(parsedUser.role); // ✅ get role from user object
    }

    setLoading(false); // auth context is now ready
  }, []);

  // Login function
  const login = ({ userData, token }) => {
    setUser(userData);
    setToken(token);
    // setRole(userData.role); // get role from userData

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    // ✅ do NOT store role separately
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);