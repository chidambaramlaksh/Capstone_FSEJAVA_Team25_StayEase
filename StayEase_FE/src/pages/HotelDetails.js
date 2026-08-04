import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useBookings } from "../context/BookingContext";
function getNights(checkIn, checkOut) {
    const start = new Date(`${checkIn}T00:00:00`).getTime();
    const end = new Date(`${checkOut}T00:00:00`).getTime();
    return Math.max(1, Math.round((end - start) / 86400000));
}
export default function HotelDetails() {
    const { hotelId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { addBooking } = useBookings();
    const [hotel, setHotel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const activeSearch = location.state
        ?.activeSearch;
    useEffect(() => {
        fetch("/mockAPI.json")
            .then((response) => response.json())
            .then((data) => {
            setHotel(data.hotels.find((item) => item.id === Number(hotelId)) ?? null);
        })
            .finally(() => setIsLoading(false));
    }, [hotelId]);
    if (isLoading)
        return _jsx("main", { className: "page-message", children: "Loading hotel details\u2026" });
    if (!hotel) {
        return (_jsxs("main", { className: "page-message", children: [_jsx("h1", { children: "Hotel not found" }), _jsx(Link, { to: "/", children: "Back to stays" })] }));
    }
    const reserveRoom = (room) => {
        if (room.available <= 0)
            return;
        const bookingSearch = activeSearch ?? {
            city: hotel.city,
            checkIn: "",
            checkOut: "",
        };
        const bookingId = `SE-${Date.now().toString().slice(-8)}-${hotel.id}${room.category.charAt(0)}`;
        const bookingEntry = {
            bookingId,
            hotelName: hotel.name,
            hotelCity: hotel.city,
            hotelImage: hotel.image,
            roomCategory: room.category,
            roomPrice: room.price,
            maxOccupancy: room.maxOccupancy,
            checkIn: bookingSearch.checkIn,
            checkOut: bookingSearch.checkOut,
            totalPrice: getNights(bookingSearch.checkIn, bookingSearch.checkOut) * room.price,
            bookedOn: new Date().toISOString(),
            userEmail: window.localStorage.getItem("stayease-user-email") ?? undefined,
        };
        addBooking(bookingEntry);
        navigate("/booking-confirmation", {
            state: { bookingId, hotel, room, search: bookingSearch, bookingEntry },
        });
    };
    return (_jsxs("main", { className: "details-page", children: [_jsxs("header", { className: "site-header", children: [_jsxs(Link, { className: "brand", to: "/", "aria-label": "StayEase home", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }), _jsx(Link, { className: "change-search", to: "/", state: location.state, children: "\u2190 All hotels" })] }), _jsx("section", { className: "hotel-hero", style: {
                    backgroundImage: `linear-gradient(90deg, rgba(13, 45, 39, .88), rgba(13, 45, 39, .35)), url(${hotel.image})`,
                }, children: _jsxs("div", { children: [_jsxs("p", { className: "eyebrow", children: [hotel.city.toUpperCase(), " \u00B7 BOUTIQUE STAY"] }), _jsx("h1", { children: hotel.name }), _jsx("p", { className: "details-description", children: hotel.description }), _jsxs("span", { className: "detail-rating", children: ["\u2605 ", hotel.rating, " guest rating"] })] }) }), _jsxs("section", { className: "rooms-section", children: [_jsxs("div", { className: "rooms-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "CHOOSE YOUR ROOM" }), _jsx("h2", { children: "Available rooms" })] }), _jsx("p", { children: "All prices are per night, inclusive of taxes." })] }), _jsx("div", { className: "room-list", children: hotel.rooms.map((room) => {
                            const isAvailable = room.available > 0;
                            return (_jsxs("article", { className: `room-card${isAvailable ? "" : " room-card--unavailable"}`, children: [_jsx("div", { className: `room-icon ${room.category.toLowerCase()}`, "aria-hidden": "true", children: room.category === "Suite" ? "✦" : "⌂" }), _jsxs("div", { className: "room-info", children: [_jsxs("h3", { children: [room.category, " Room"] }), _jsx("p", { children: room.description }), _jsxs("span", { children: [room.available, " rooms available \u00B7 Max ", room.maxOccupancy, " ", "pax"] })] }), _jsxs("div", { className: "room-price", children: [_jsxs("strong", { children: ["\u20B9", room.price.toLocaleString("en-IN")] }), _jsx("span", { children: "per night" }), _jsx("button", { type: "button", disabled: !isAvailable, onClick: () => reserveRoom(room), children: isAvailable ? "Reserve room" : "Sold out" })] })] }, room.category));
                        }) })] })] }));
}
