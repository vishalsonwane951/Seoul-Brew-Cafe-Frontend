import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Styles/custom.css';
import { MenuProvider } from "./context/MenuContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AppProvider } from "./Admin/context/AppContext.jsx";
 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MenuProvider>
        <CartProvider>
          <AppProvider>
          <App />
          </AppProvider>
        </CartProvider>
      </MenuProvider>
    </AuthProvider>
  </React.StrictMode>
);