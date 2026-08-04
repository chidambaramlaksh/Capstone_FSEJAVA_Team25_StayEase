import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";
import { ManagerProvider } from "./context/ManagerContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ManagerProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
      </ManagerProvider>
    </AuthProvider>
  </BrowserRouter>,
);
