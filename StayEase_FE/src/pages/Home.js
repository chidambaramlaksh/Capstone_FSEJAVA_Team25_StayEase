import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
const emptySearch = { city: "", checkIn: "", checkOut: "" };
function formatDate(value) {
    if (!value)
        return "";
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
}
export default function Home() {
    const location = useLocation();
    const savedSearch = location.state?.activeSearch ?? null;
    const [hotels, setHotels] = useState([]);
    const [search, setSearch] = useState(() => savedSearch ?? emptySearch);
    const [activeSearch, setActiveSearch] = useState(() => savedSearch);
    const [isSearchOpen, setIsSearchOpen] = useState(() => !savedSearch);
    useEffect(() => {
        fetch("/mockAPI.json")
            .then((response) => response.json())
            .then((data) => setHotels(data.hotels));
    }, []);
    const isValid = Boolean(search.city && search.checkIn && search.checkOut && search.checkOut > search.checkIn);
    const displayedHotels = useMemo(() => activeSearch ? hotels.filter((hotel) => hotel.city === activeSearch.city) : [], [activeSearch, hotels]);
    const submitSearch = () => {
        if (!isValid)
            return;
        setActiveSearch(search);
        setIsSearchOpen(false);
    };
    return (_jsxs("main", { children: [_jsxs("header", { className: "site-header", children: [_jsxs("a", { className: "brand", href: "/", "aria-label": "StayEase home", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }), activeSearch && _jsx("button", { className: "change-search", onClick: () => setIsSearchOpen(true), children: "Change search" })] }), _jsxs("section", { className: "hero", children: [_jsx("p", { className: "eyebrow", children: "FIND YOUR PERFECT STAY" }), _jsxs("h1", { children: ["Comfort, wherever", _jsx("br", {}), "you\u2019re going."] }), _jsx("p", { children: "Thoughtfully selected stays in the cities you love." })] }), activeSearch ? (_jsxs("section", { className: "results", "aria-live": "polite", children: [_jsxs("div", { className: "results-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "AVAILABLE STAYS" }), _jsxs("h2", { children: ["Hotels in ", activeSearch.city] })] }), _jsxs("div", { className: "trip-dates", children: [_jsx("span", { children: formatDate(activeSearch.checkIn) }), _jsx("i", { "aria-hidden": "true", children: "\u2192" }), _jsx("span", { children: formatDate(activeSearch.checkOut) })] })] }), displayedHotels.length ? (_jsx("div", { className: "hotel-grid", children: displayedHotels.map((hotel) => (_jsx(Link, { className: "hotel-card", to: `/hotel/${hotel.id}`, state: { activeSearch }, children: _jsxs("article", { children: [_jsx("img", { src: hotel.image, alt: hotel.name }), _jsxs("div", { className: "hotel-content", children: [_jsxs("div", { className: "hotel-title-row", children: [_jsxs("div", { children: [_jsx("p", { className: "city-label", children: hotel.city }), _jsx("h3", { children: hotel.name })] }), _jsxs("span", { className: "rating", children: ["\u2605 ", hotel.rating] })] }), _jsx("p", { className: "description", children: hotel.description }), _jsxs("p", { className: "price", children: [_jsxs("strong", { children: ["\u20B9", hotel.price.toLocaleString("en-IN")] }), " / night"] })] })] }) }, hotel.id))) })) : _jsx("p", { className: "empty-state", children: "No stays found for these dates." })] })) : _jsx("section", { className: "pre-search", children: _jsx("p", { children: "Your next memorable stay is just a search away." }) }), isSearchOpen && (_jsx("div", { className: "modal-backdrop", role: "presentation", children: _jsxs("section", { className: "search-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "search-title", children: [_jsx("span", { className: "modal-icon", "aria-hidden": "true", children: "\u2302" }), _jsx("p", { className: "eyebrow", children: "PLAN YOUR STAY" }), _jsx("h2", { id: "search-title", children: "Where are you going?" }), _jsx("p", { className: "modal-copy", children: "Choose a city and dates to discover your ideal stay." }), _jsxs("div", { className: "form-grid", children: [_jsxs("label", { children: [_jsx("span", { children: "City" }), _jsxs("select", { value: search.city, onChange: (event) => setSearch({ ...search, city: event.target.value }), children: [_jsx("option", { value: "", disabled: true, children: "Select city" }), _jsx("option", { value: "Mumbai", children: "Mumbai" }), _jsx("option", { value: "Pune", children: "Pune" })] })] }), _jsxs("label", { children: [_jsx("span", { children: "Check-in" }), _jsx("input", { type: "date", value: search.checkIn, onChange: (event) => setSearch({ ...search, checkIn: event.target.value }) })] }), _jsxs("label", { children: [_jsx("span", { children: "Check-out" }), _jsx("input", { type: "date", min: search.checkIn || undefined, value: search.checkOut, onChange: (event) => setSearch({ ...search, checkOut: event.target.value }) })] })] }), search.checkIn && search.checkOut && search.checkOut <= search.checkIn && _jsx("p", { className: "validation", children: "Check-out must be after check-in." }), _jsxs("button", { className: "search-button", disabled: !isValid, onClick: submitSearch, children: ["Search hotels ", _jsx("span", { children: "\u2192" })] })] }) }))] }));
}
