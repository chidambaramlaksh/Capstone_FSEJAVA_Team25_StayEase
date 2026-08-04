import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import Bookings from "./pages/Bookings";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/hotel/:hotelId", element: _jsx(HotelDetails, {}) }), _jsx(Route, { path: "/booking-confirmation", element: _jsx(BookingConfirmation, {}) }), _jsx(Route, { path: "/bookings", element: _jsx(Bookings, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin/home", element: _jsx(AdminHome, {}) })] }));
}
