import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Styles/custom.css';
import { MenuProvider } from "./context/MenuContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MenuProvider >
      <CartProvider>
        <App />
      </CartProvider>
    </MenuProvider>
    </React.StrictMode>
);