import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUpcomingBookings } from "../../services/managerApi";
const formatDate = (value) => new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
}).format(new Date(`${value}T00:00:00`));
export default function UpcomingBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        if (!user?.token || typeof user.managedHotelId !== "number") {
            setBookings([]);
            setLoading(false);
            return;
        }
        let isCurrentRequest = true;
        setLoading(true);
        setError("");
        getUpcomingBookings(user.token)
            .then((upcomingBookings) => {
            if (isCurrentRequest)
                setBookings(upcomingBookings);
        })
            .catch(() => {
            if (isCurrentRequest) {
                setBookings([]);
                setError("Unable to load upcoming bookings. Please try again.");
            }
        })
            .finally(() => {
            if (isCurrentRequest)
                setLoading(false);
        });
        return () => {
            isCurrentRequest = false;
        };
    }, [user?.managedHotelId, user?.token]);
    const filtered = useMemo(() => bookings.filter((booking) => (booking.guestName + booking.guestEmail + booking.roomNumber)
        .toLowerCase()
        .includes(query.toLowerCase()) &&
        (status === "all" || booking.status === status)), [bookings, query, status]);
    return (_jsxs("section", { className: "manager-page", children: [_jsx("div", { className: "manager-page__heading", children: _jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "GUEST STAYS" }), _jsx("h1", { children: "Upcoming bookings" }), _jsx("p", { children: "Reservations arriving soon at The Marine House." })] }) }), _jsxs("div", { className: "manager-toolbar", children: [_jsx("input", { "aria-label": "Search bookings", placeholder: "Search guest, email, or room\u2026", value: query, onChange: (event) => setQuery(event.target.value) }), _jsxs("select", { "aria-label": "Filter bookings by status", value: status, onChange: (event) => setStatus(event.target.value), children: [_jsx("option", { value: "all", children: "All booking statuses" }), _jsx("option", { value: "BOOKED", children: "Confirmed" })] })] }), error ? (_jsx("p", { className: "manager-empty", role: "alert", children: error })) : loading ? (_jsx("p", { className: "manager-empty", children: "Loading bookings\u2026" })) : (_jsxs("div", { className: "booking-table-wrap", children: [_jsxs("table", { className: "booking-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Guest" }), _jsx("th", { children: "Room" }), _jsx("th", { children: "Stay" }), _jsx("th", { children: "Status" })] }) }), _jsx("tbody", { children: filtered.map((booking) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("strong", { children: booking.guestName }), _jsx("span", { children: booking.guestEmail })] }), _jsxs("td", { children: [_jsx("strong", { children: booking.roomNumber }), _jsx("span", { children: booking.roomType })] }), _jsxs("td", { children: [_jsx("strong", { children: formatDate(booking.checkInDate) }), _jsxs("span", { children: ["to ", formatDate(booking.checkOutDate)] })] }), _jsx("td", { children: _jsx("span", { className: "status status--active", children: "Confirmed" }) })] }, booking.id))) })] }), !filtered.length && (_jsx("p", { className: "manager-empty", children: "No upcoming bookings match these filters." }))] }))] }));
}
