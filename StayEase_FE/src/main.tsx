import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";
import { ManagerProvider } from "./context/ManagerContext";
import { HotelProvider } from "./context/HotelContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ManagerProvider>
        <HotelProvider>
          <BookingProvider>
            <App />
          </BookingProvider>
        </HotelProvider>
      </ManagerProvider>
    </AuthProvider>
  </BrowserRouter>,
);
