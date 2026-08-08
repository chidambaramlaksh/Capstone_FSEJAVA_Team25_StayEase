import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function ManagerLayout() {
    const { user, logout } = useAuth();
    const handleLogout = () => {
        logout();
    };
    return (_jsxs("main", { className: "manager-shell", children: [_jsxs("header", { className: "manager-header", children: [_jsxs(NavLink, { className: "brand", to: "/manager", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }), _jsxs("nav", { className: "manager-nav", "aria-label": "Manager navigation", children: [_jsx(NavLink, { end: true, to: "/manager", children: "Dashboard" }), _jsx(NavLink, { to: "/manager/rooms", children: "Rooms" }), _jsx(NavLink, { to: "/manager/bookings", children: "Upcoming bookings" })] }), _jsxs("div", { className: "manager-user", children: [_jsx("span", { children: user?.name }), _jsx("button", { type: "button", onClick: handleLogout, children: "Log out" })] })] }), _jsx(Outlet, {})] }));
}
