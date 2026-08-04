import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useBookings } from "../context/BookingContext";
function formatDate(value) {
    if (!value) {
        return "—";
    }
    const parsedDate = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(parsedDate);
}
export default function Bookings() {
    const { getBookingsForUser } = useBookings();
    const userEmail = typeof window !== "undefined" ? window.localStorage.getItem("stayease-user-email") : null;
    const bookings = getBookingsForUser(userEmail);
    return (_jsxs("main", { className: "confirmation-page", children: [_jsx("header", { className: "site-header", children: _jsxs(Link, { className: "brand", to: "/", "aria-label": "StayEase home", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }) }), _jsxs("section", { className: "confirmation-wrap", children: [_jsxs("div", { className: "confirmation-status", children: [_jsx("span", { children: "\uD83E\uDDF3" }), _jsx("p", { className: "eyebrow", children: "YOUR BOOKINGS" }), _jsx("h1", { children: "All your stays in one place." }), _jsx("p", { children: "Review current and past reservations whenever you need them." })] }), !userEmail ? (_jsx("div", { className: "booking-card", children: _jsx("div", { className: "booking-card-content", children: _jsx("p", { className: "modal-copy", children: "Please log in to view your bookings." }) }) })) : bookings.length ? (_jsx("div", { className: "room-list", children: bookings.map((booking) => (_jsxs("article", { className: "booking-card", children: [_jsx("img", { src: booking.hotelImage, alt: booking.hotelName }), _jsxs("div", { className: "booking-card-content", children: [_jsxs("div", { className: "booking-id", children: [_jsx("span", { children: "Booking ID" }), _jsx("strong", { children: booking.bookingId })] }), _jsx("p", { className: "city-label", children: booking.hotelCity }), _jsx("h2", { children: booking.hotelName }), _jsxs("div", { className: "booking-details", children: [_jsxs("div", { children: [_jsx("span", { children: "Room" }), _jsxs("strong", { children: [booking.roomCategory, " Room"] })] }), _jsxs("div", { children: [_jsx("span", { children: "Guests" }), _jsxs("strong", { children: ["Up to ", booking.maxOccupancy, " pax"] })] }), _jsxs("div", { children: [_jsx("span", { children: "Check-in" }), _jsx("strong", { children: formatDate(booking.checkIn) })] }), _jsxs("div", { children: [_jsx("span", { children: "Check-out" }), _jsx("strong", { children: formatDate(booking.checkOut) })] })] }), _jsxs("div", { className: "booking-total", children: [_jsxs("div", { children: [_jsxs("span", { children: ["Booked on ", formatDate(booking.bookedOn)] }), _jsx("strong", { children: "Total price" })] }), _jsxs("strong", { children: ["\u20B9", booking.totalPrice.toLocaleString("en-IN")] })] })] })] }, booking.bookingId))) })) : (_jsx("div", { className: "booking-card", children: _jsx("div", { className: "booking-card-content", children: _jsx("p", { className: "modal-copy", children: "No bookings yet. Reserve a room to see it here." }) }) })), _jsx(Link, { className: "return-home", to: "/", children: "Return to home" })] })] }));
}
