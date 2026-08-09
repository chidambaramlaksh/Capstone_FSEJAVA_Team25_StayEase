import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };
    return (_jsxs("main", { className: "manager-shell", children: [_jsxs("header", { className: "manager-header", children: [_jsxs(NavLink, { className: "brand", to: "/admin/home", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }), _jsxs("nav", { className: "manager-nav", "aria-label": "Admin navigation", children: [_jsx(NavLink, { end: true, to: "/admin/home", children: "Dashboard" }), _jsx(NavLink, { to: "/admin/home/hotels", children: "Hotel directory" })] }), _jsxs("div", { className: "manager-user", children: [_jsx("span", { children: user?.name }), _jsx("button", { type: "button", onClick: handleLogout, children: "Log out" })] })] }), _jsx(Outlet, {})] }));
}
