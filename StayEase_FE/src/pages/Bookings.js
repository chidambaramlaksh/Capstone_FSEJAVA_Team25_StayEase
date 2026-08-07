import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cancelBooking, getMyBookings, } from "../services/bookingsApi";
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
function formatDateTime(value) {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime()))
        return "—";
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(parsedDate);
}
export default function Bookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [cancelError, setCancelError] = useState("");
    const [cancellingBookingId, setCancellingBookingId] = useState(null);
    useEffect(() => {
        if (!user?.token) {
            setBookings([]);
            return;
        }
        let isCurrentRequest = true;
        setIsLoading(true);
        setError("");
        getMyBookings(user.token)
            .then((userBookings) => {
            if (isCurrentRequest)
                setBookings(userBookings);
        })
            .catch(() => {
            if (isCurrentRequest) {
                setBookings([]);
                setError("Unable to load your bookings. Please try again.");
            }
        })
            .finally(() => {
            if (isCurrentRequest)
                setIsLoading(false);
        });
        return () => {
            isCurrentRequest = false;
        };
    }, [user?.token]);
    async function handleCancelBooking(booking) {
        if (!user?.token || cancellingBookingId !== null)
            return;
        const confirmed = window.confirm(`Cancel booking ${booking.bookingRef}? This action cannot be undone.`);
        if (!confirmed)
            return;
        setCancellingBookingId(booking.id);
        setCancelError("");
        try {
            await cancelBooking(user.token, booking.id);
            setBookings((currentBookings) => currentBookings.map((currentBooking) => currentBooking.id === booking.id
                ? { ...currentBooking, status: "CANCELLED" }
                : currentBooking));
        }
        catch {
            setCancelError("Unable to cancel this booking. Please try again.");
        }
        finally {
            setCancellingBookingId(null);
        }
    }
    return (_jsxs("main", { className: "confirmation-page", children: [_jsx("header", { className: "site-header", children: _jsxs(Link, { className: "brand", to: "/", "aria-label": "StayEase home", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }) }), _jsxs("section", { className: "confirmation-wrap", children: [_jsxs("div", { className: "confirmation-status", children: [_jsx("span", { children: "\uD83E\uDDF3" }), _jsx("p", { className: "eyebrow", children: "YOUR BOOKINGS" }), _jsx("h1", { children: "All your stays in one place." }), _jsx("p", { children: "Review current and past reservations whenever you need them." })] }), cancelError && _jsx("p", { className: "validation", role: "alert", children: cancelError }), !user ? (_jsx("div", { className: "booking-card", children: _jsx("div", { className: "booking-card-content", children: _jsx("p", { className: "modal-copy", children: "Please log in to view your bookings." }) }) })) : isLoading ? (_jsx("div", { className: "booking-card", children: _jsx("div", { className: "booking-card-content", children: _jsx("p", { className: "modal-copy", children: "Loading your bookings\u2026" }) }) })) : error ? (_jsx("div", { className: "booking-card", children: _jsx("div", { className: "booking-card-content", children: _jsx("p", { className: "validation", children: error }) }) })) : bookings.length ? (_jsx("div", { className: "room-list", children: bookings.map((booking) => (_jsx("article", { className: "booking-card", children: _jsxs("div", { className: "booking-card-content", children: [_jsxs("div", { className: "booking-id", children: [_jsx("span", { children: "Booking reference" }), _jsx("strong", { children: booking.bookingRef })] }), _jsx("p", { className: "city-label", children: booking.status }), _jsx("h2", { children: booking.hotelName }), _jsxs("div", { className: "booking-details", children: [_jsxs("div", { children: [_jsx("span", { children: "Guest" }), _jsx("strong", { children: booking.guestEmail })] }), _jsxs("div", { children: [_jsx("span", { children: "Room ID" }), _jsx("strong", { children: booking.roomId })] }), _jsxs("div", { children: [_jsx("span", { children: "Check-in" }), _jsx("strong", { children: formatDate(booking.checkInDate) })] }), _jsxs("div", { children: [_jsx("span", { children: "Check-out" }), _jsx("strong", { children: formatDate(booking.checkOutDate) })] })] }), _jsxs("div", { className: "booking-total", children: [_jsxs("div", { children: [_jsxs("span", { children: ["Booked on ", formatDateTime(booking.createdAt)] }), _jsx("strong", { children: "Total price" })] }), _jsxs("strong", { children: ["\u20B9", Number(booking.totalPrice).toLocaleString("en-IN")] })] }), _jsx("div", { className: "booking-actions", children: String(booking.status).toUpperCase() === "CANCELLED" ||
                                            String(booking.status).toUpperCase() === "CANCELED" ? (_jsx("span", { className: "booking-cancelled", children: "Booking cancelled" })) : (_jsx("button", { className: "booking-cancel-button", type: "button", disabled: cancellingBookingId === booking.id, onClick: () => handleCancelBooking(booking), children: cancellingBookingId === booking.id
                                                ? "Cancelling…"
                                                : "Cancel booking" })) })] }) }, booking.bookingRef))) })) : (_jsx("div", { className: "booking-card", children: _jsx("div", { className: "booking-card-content", children: _jsx("p", { className: "modal-copy", children: "No bookings yet. Reserve a room to see it here." }) }) })), _jsx(Link, { className: "return-home", to: "/", children: "Return to home" })] })] }));
}
