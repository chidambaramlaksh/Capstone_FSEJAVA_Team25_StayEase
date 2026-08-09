import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import HotelDetails from "./pages/HotelDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import Bookings from "./pages/Bookings";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HotelManagement from "./pages/admin/HotelManagement";
import AdminLayout from "./components/admin/AdminLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import RoomManagement from "./pages/manager/RoomManagement";
import UpcomingBookings from "./pages/manager/UpcomingBookings";
import ProtectedRoute from "./components/manager/ProtectedRoute";
import ManagerLayout from "./components/manager/ManagerLayout";
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/hotel/:hotelId", element: _jsx(HotelDetails, {}) }), _jsx(Route, { path: "/booking-confirmation", element: _jsx(BookingConfirmation, {}) }), _jsx(Route, { path: "/bookings", element: _jsx(Bookings, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminLogin, {}) }), _jsx(Route, { element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"] }), children: _jsxs(Route, { path: "/admin/home", element: _jsx(AdminLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "hotels", element: _jsx(HotelManagement, {}) })] }) }), _jsx(Route, { element: _jsx(ProtectedRoute, { allowedRoles: ["HOTEL_MANAGER"] }), children: _jsxs(Route, { path: "/manager", element: _jsx(ManagerLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(ManagerDashboard, {}) }), _jsx(Route, { path: "rooms", element: _jsx(RoomManagement, {}) }), _jsx(Route, { path: "bookings", element: _jsx(UpcomingBookings, {}) })] }) })] }));
}
