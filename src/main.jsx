import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <OrderProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </OrderProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
