import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useManager } from "../../context/ManagerContext";
export default function ManagerDashboard() {
    const { user } = useAuth();
    const { rooms } = useManager();
    const hotelRooms = rooms.filter((room) => room.hotelId === user?.hotelId);
    const activeRooms = hotelRooms.filter((room) => room.isActive).length;
    return (_jsxs("section", { className: "manager-page", children: [_jsx("div", { className: "manager-page__intro", children: _jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "THE MARINE HOUSE \u00B7 MUMBAI" }), _jsxs("h1", { children: ["Good morning, ", user?.name.split(" ")[0], "."] }), _jsx("p", { children: "Here is a quick overview of your hotel today." })] }) }), _jsxs("div", { className: "manager-stats", children: [_jsxs("article", { children: [_jsx("span", { children: "Total rooms" }), _jsx("strong", { children: hotelRooms.length }), _jsx("small", { children: "In your inventory" })] }), _jsxs("article", { children: [_jsx("span", { children: "Active rooms" }), _jsx("strong", { children: activeRooms }), _jsx("small", { children: "Available to guests" })] }), _jsxs("article", { children: [_jsx("span", { children: "Inactive rooms" }), _jsx("strong", { children: hotelRooms.length - activeRooms }), _jsx("small", { children: "Currently hidden" })] })] }), _jsxs("div", { className: "manager-actions", children: [_jsxs(Link, { to: "/manager/rooms", children: [_jsx("span", { children: "\u2302" }), _jsxs("div", { children: [_jsx("h2", { children: "Manage rooms" }), _jsx("p", { children: "Add, update, activate, or remove room inventory." })] }), _jsx("b", { children: "\u2192" })] }), _jsxs(Link, { to: "/manager/bookings", children: [_jsx("span", { children: "\u25A3" }), _jsxs("div", { children: [_jsx("h2", { children: "Upcoming bookings" }), _jsx("p", { children: "Review guests arriving at your hotel." })] }), _jsx("b", { children: "\u2192" })] })] })] }));
}
