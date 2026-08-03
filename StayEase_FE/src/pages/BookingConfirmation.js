import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
function formatDate(value) {
    return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" })
        .format(new Date(`${value}T00:00:00`));
}
function getNights(checkIn, checkOut) {
    const start = new Date(`${checkIn}T00:00:00`).getTime();
    const end = new Date(`${checkOut}T00:00:00`).getTime();
    return Math.max(1, Math.round((end - start) / 86400000));
}
export default function BookingConfirmation() {
    const location = useLocation();
    const booking = location.state;
    if (!booking) {
        return _jsxs("main", { className: "page-message", children: [_jsx("h1", { children: "No booking selected" }), _jsx(Link, { to: "/", children: "Find a stay" })] });
    }
    const nights = getNights(booking.search.checkIn, booking.search.checkOut);
    const total = nights * booking.room.price;
    return (_jsxs("main", { className: "confirmation-page", children: [_jsx("header", { className: "site-header", children: _jsxs(Link, { className: "brand", to: "/", "aria-label": "StayEase home", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }) }), _jsxs("section", { className: "confirmation-wrap", children: [_jsxs("div", { className: "confirmation-status", children: [_jsx("span", { children: "\u2713" }), _jsx("p", { className: "eyebrow", children: "BOOKING CONFIRMED" }), _jsx("h1", { children: "Your stay is reserved." }), _jsx("p", { children: "We look forward to welcoming you. Your booking details are below." })] }), _jsxs("article", { className: "booking-card", children: [_jsx("img", { src: booking.hotel.image, alt: booking.hotel.name }), _jsxs("div", { className: "booking-card-content", children: [_jsxs("div", { className: "booking-id", children: [_jsx("span", { children: "Booking ID" }), _jsx("strong", { children: booking.bookingId })] }), _jsx("p", { className: "city-label", children: booking.hotel.city }), _jsx("h2", { children: booking.hotel.name }), _jsxs("div", { className: "booking-details", children: [_jsxs("div", { children: [_jsx("span", { children: "Room" }), _jsxs("strong", { children: [booking.room.category, " Room"] })] }), _jsxs("div", { children: [_jsx("span", { children: "Guests" }), _jsxs("strong", { children: ["Up to ", booking.room.maxOccupancy, " pax"] })] }), _jsxs("div", { children: [_jsx("span", { children: "Check-in" }), _jsx("strong", { children: formatDate(booking.search.checkIn) })] }), _jsxs("div", { children: [_jsx("span", { children: "Check-out" }), _jsx("strong", { children: formatDate(booking.search.checkOut) })] })] }), _jsxs("div", { className: "booking-total", children: [_jsxs("div", { children: [_jsxs("span", { children: ["\u20B9", booking.room.price.toLocaleString("en-IN"), " \u00D7 ", nights, " ", nights === 1 ? "night" : "nights"] }), _jsx("strong", { children: "Total price" })] }), _jsxs("strong", { children: ["\u20B9", total.toLocaleString("en-IN")] })] })] })] }), _jsx(Link, { className: "return-home", to: "/", children: "Return to home" })] })] }));
}
