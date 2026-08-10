import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
export default function AdminDashboard() {
    const { hotels, isLoading } = useAdmin();
    const cities = new Set(hotels.map((hotel) => hotel.city)).size;
    const highlyRated = hotels.filter((hotel) => hotel.starRating >= 4).length;
    return (_jsxs("section", { className: "manager-page", children: [_jsx("div", { className: "manager-page__intro", children: _jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "STAYEASE ADMINISTRATION" }), _jsx("h1", { children: "Hotel operations, all in one place." }), _jsx("p", { children: "Manage hotel listings and keep the public directory up to date." })] }) }), _jsxs("div", { className: "manager-stats", children: [_jsxs("article", { children: [_jsx("span", { children: "Total hotels" }), _jsx("strong", { children: isLoading ? "—" : hotels.length }), _jsx("small", { children: "In the directory" })] }), _jsxs("article", { children: [_jsx("span", { children: "Cities covered" }), _jsx("strong", { children: isLoading ? "—" : cities }), _jsx("small", { children: "Across the directory" })] }), _jsxs("article", { children: [_jsx("span", { children: "Highly rated stays" }), _jsx("strong", { children: isLoading ? "—" : highlyRated }), _jsx("small", { children: "Rated four stars or more" })] })] }), _jsx("div", { className: "manager-actions", children: _jsxs(Link, { to: "/admin/home/hotels", children: [_jsx("span", { children: "\u2302" }), _jsxs("div", { children: [_jsx("h2", { children: "Manage hotel directory" }), _jsx("p", { children: "Add, update, or remove hotel listings." })] }), _jsx("b", { children: "\u2192" })] }) })] }));
}
