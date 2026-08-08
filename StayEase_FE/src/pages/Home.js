import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useHotels } from "../context/HotelContext";
import { getHotelsByCity } from "../services/hotelApi";
const emptySearch = { city: "", checkIn: "", checkOut: "" };
const searchStorageKey = "stayease-last-search";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function formatDate(value) {
    if (!value)
        return "";
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
}
export default function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, login, logout: endSession } = useAuth();
    const savedSearch = location.state?.activeSearch ?? null;
    const { hotels, setHotels } = useHotels();
    const [search, setSearch] = useState(() => {
        if (savedSearch) {
            return savedSearch;
        }
        if (typeof window === "undefined") {
            return emptySearch;
        }
        const storedSearch = window.localStorage.getItem(searchStorageKey);
        if (!storedSearch) {
            return emptySearch;
        }
        try {
            const parsedSearch = JSON.parse(storedSearch);
            return parsedSearch && typeof parsedSearch === "object"
                ? parsedSearch
                : emptySearch;
        }
        catch {
            return emptySearch;
        }
    });
    const [activeSearch, setActiveSearch] = useState(() => savedSearch);
    const [isSearchOpen, setIsSearchOpen] = useState(() => !savedSearch);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });
    const [loginError, setLoginError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingHotels, setIsLoadingHotels] = useState(false);
    const [hotelError, setHotelError] = useState("");
    useEffect(() => {
        if (!activeSearch?.city) {
            return;
        }
        let isCurrentRequest = true;
        setIsLoadingHotels(true);
        setHotelError("");
        getHotelsByCity(activeSearch.city)
            .then((hotelsForCity) => {
            if (isCurrentRequest)
                setHotels(hotelsForCity);
        })
            .catch(() => {
            if (isCurrentRequest) {
                setHotels([]);
                setHotelError("Unable to load hotels for this city.");
            }
        })
            .finally(() => {
            if (isCurrentRequest)
                setIsLoadingHotels(false);
        });
        return () => {
            isCurrentRequest = false;
        };
    }, [activeSearch?.city, setHotels]);
    const isValid = Boolean(search.city &&
        search.checkIn &&
        search.checkOut &&
        search.checkOut > search.checkIn);
    const isLoginValid = emailPattern.test(loginForm.email.trim()) &&
        loginForm.password.trim().length >= 6;
    const displayedHotels = useMemo(() => activeSearch
        ? hotels.filter((hotel) => hotel.city.toLowerCase() === activeSearch.city.toLowerCase())
        : [], [activeSearch, hotels]);
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(searchStorageKey, JSON.stringify(search));
        }
    }, [search]);
    const submitSearch = () => {
        if (!isValid)
            return;
        setActiveSearch(search);
        setIsSearchOpen(false);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(searchStorageKey, JSON.stringify(search));
        }
    };
    const submitLogin = async (event) => {
        event.preventDefault();
        setLoginError("");
        setLoginSuccess("");
        if (!isLoginValid) {
            setLoginError("Please use a valid email and a password with at least 6 characters.");
            return;
        }
        setIsSubmitting(true);
        try {
            const authenticatedUser = await login(loginForm.email, loginForm.password);
            if (!authenticatedUser) {
                setLoginError("Invalid email or password.");
                return;
            }
            const role = String(authenticatedUser.role ?? authenticatedUser.userType ?? "user").toLowerCase();
            // Redirect immediately if manager or admin
            if (role === "hotel_manager") {
                navigate("/manager", { replace: true });
                return;
            }
            if (role === "admin") {
                navigate("/admin/home", { replace: true });
                return;
            }
            // Regular user login
            console.log("User login (no redirect)");
            setLoginSuccess(`Login successful (${role})`);
            setLoginForm({ email: "", password: "" });
            setIsLoginOpen(false);
        }
        catch {
            setLoginError("Unable to sign in. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const openLogin = () => {
        setLoginError("");
        setLoginSuccess("");
        setIsLoginOpen(true);
    };
    const closeLogin = () => {
        setIsLoginOpen(false);
        setLoginForm({ email: "", password: "" });
        setLoginError("");
        setLoginSuccess("");
    };
    const logout = () => {
        endSession();
        setLoginSuccess("You have been logged out.");
    };
    const loggedInEmail = user?.email ?? null;
    const loggedInUserType = String(user?.role ?? user?.userType ?? "user").toLowerCase();
    const isAdminUser = loggedInUserType === "admin";
    return (_jsxs("main", { children: [_jsxs("header", { className: "site-header", children: [_jsx("div", { className: "header-actions", children: _jsxs("a", { className: "brand", href: "/", "aria-label": "StayEase home", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }) }), _jsxs("div", { className: "header-actions", children: [activeSearch && (_jsx("button", { className: "change-search", onClick: () => setIsSearchOpen(true), children: "Change search" })), loggedInEmail ? (_jsx(Link, { className: "login-button", to: "/bookings", children: "View bookings" })) : null, user ? (_jsxs("div", { className: "auth-badge", children: [_jsxs("span", { children: ["Hi, ", user.name] }), _jsx("button", { type: "button", onClick: logout, children: "Logout" })] })) : (_jsx("button", { className: "login-button", type: "button", onClick: openLogin, children: "Login" }))] })] }), (loginError || loginSuccess) && (_jsx("div", { className: `auth-status ${loginError ? "auth-status--error" : "auth-status--success"}`, children: loginError || loginSuccess })), _jsxs("section", { className: "hero", children: [_jsx("p", { className: "eyebrow", children: "FIND YOUR PERFECT STAY" }), _jsxs("h1", { children: ["Comfort, wherever", _jsx("br", {}), "you\u2019re going."] }), _jsx("p", { children: "Thoughtfully selected stays in the cities you love." })] }), isAdminUser ? (_jsxs("section", { className: "results", "aria-live": "polite", children: [_jsx("div", { className: "results-heading", children: _jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "ADMIN DASHBOARD" }), _jsx("h2", { children: "Choose an action" })] }) }), _jsxs("div", { className: "hotel-grid", children: [_jsx("div", { className: "hotel-card", children: _jsx("article", { children: _jsxs("div", { className: "hotel-content", children: [_jsx("p", { className: "city-label", children: "MANAGEMENT" }), _jsx("h3", { children: "Create hotel listing" }), _jsx("p", { className: "description", children: "Add a new property and make it available for guests." })] }) }) }), _jsx("div", { className: "hotel-card", children: _jsx("article", { children: _jsxs("div", { className: "hotel-content", children: [_jsx("p", { className: "city-label", children: "COMING SOON" }), _jsx("h3", { children: "More admin options" }), _jsx("p", { className: "description", children: "Additional management actions will be added in future steps." })] }) }) })] })] })) : activeSearch ? (_jsxs("section", { className: "results", "aria-live": "polite", children: [_jsxs("div", { className: "results-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "AVAILABLE STAYS" }), _jsxs("h2", { children: ["Hotels in ", activeSearch.city] })] }), _jsxs("div", { className: "trip-dates", children: [_jsx("span", { children: formatDate(activeSearch.checkIn) }), _jsx("i", { "aria-hidden": "true", children: "\u2192" }), _jsx("span", { children: formatDate(activeSearch.checkOut) })] })] }), isLoadingHotels ? (_jsx("p", { className: "empty-state", children: "Loading hotels\u2026" })) : hotelError ? (_jsx("p", { className: "empty-state", children: hotelError })) : displayedHotels.length ? (_jsx("div", { className: "hotel-grid", children: displayedHotels.map((hotel) => (_jsx(Link, { className: "hotel-card", to: `/hotel/${hotel.id}`, state: { activeSearch }, children: _jsxs("article", { children: [_jsx("img", { src: hotel.image, alt: hotel.name }), _jsxs("div", { className: "hotel-content", children: [_jsxs("div", { className: "hotel-title-row", children: [_jsxs("div", { children: [_jsx("p", { className: "city-label", children: hotel.city }), _jsx("h3", { children: hotel.name })] }), _jsxs("span", { className: "rating", children: ["\u2605 ", hotel.rating] })] }), _jsx("p", { className: "description", children: hotel.description }), _jsxs("p", { className: "price", children: [_jsxs("strong", { children: ["\u20B9", hotel.price.toLocaleString("en-IN")] }), " ", "/ night"] })] })] }) }, hotel.id))) })) : (_jsx("p", { className: "empty-state", children: "No stays found for these dates." }))] })) : (_jsx("section", { className: "pre-search", children: _jsx("p", { children: "Your next memorable stay is just a search away." }) })), isSearchOpen && !isAdminUser && (_jsx("div", { className: "modal-backdrop", role: "presentation", children: _jsxs("section", { className: "search-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "search-title", children: [_jsx("span", { className: "modal-icon", "aria-hidden": "true", children: "\u2302" }), _jsx("p", { className: "eyebrow", children: "PLAN YOUR STAY" }), _jsx("h2", { id: "search-title", children: "Where are you going?" }), _jsx("p", { className: "modal-copy", children: "Choose a city and dates to discover your ideal stay." }), _jsxs("div", { className: "form-grid", children: [_jsxs("label", { children: [_jsx("span", { children: "City" }), _jsxs("select", { value: search.city, onChange: (event) => setSearch({ ...search, city: event.target.value }), children: [_jsx("option", { value: "", disabled: true, children: "Select city" }), _jsx("option", { value: "Mumbai", children: "Mumbai" }), _jsx("option", { value: "Pune", children: "Pune" })] })] }), _jsxs("label", { children: [_jsx("span", { children: "Check-in" }), _jsx("input", { type: "date", value: search.checkIn, onChange: (event) => setSearch({ ...search, checkIn: event.target.value }) })] }), _jsxs("label", { children: [_jsx("span", { children: "Check-out" }), _jsx("input", { type: "date", min: search.checkIn || undefined, value: search.checkOut, onChange: (event) => setSearch({ ...search, checkOut: event.target.value }) })] })] }), search.checkIn &&
                            search.checkOut &&
                            search.checkOut <= search.checkIn && (_jsx("p", { className: "validation", children: "Check-out must be after check-in." })), _jsxs("button", { className: "search-button", disabled: !isValid, onClick: submitSearch, children: ["Search hotels ", _jsx("span", { children: "\u2192" })] })] }) })), isLoginOpen && (_jsx("div", { className: "modal-backdrop", role: "presentation", onClick: closeLogin, children: _jsxs("section", { className: "search-modal login-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "login-title", onClick: (event) => event.stopPropagation(), children: [_jsx("span", { className: "modal-icon", "aria-hidden": "true", children: "\uD83D\uDD10" }), _jsx("p", { className: "eyebrow", children: "ACCOUNT ACCESS" }), _jsx("h2", { id: "login-title", children: "Login to StayEase" }), _jsx("p", { className: "modal-copy", children: "Use your email and password to continue." }), _jsxs("form", { className: "form-grid", onSubmit: submitLogin, children: [_jsxs("label", { children: [_jsx("span", { children: "Email" }), _jsx("input", { type: "email", value: loginForm.email, onChange: (event) => setLoginForm((current) => ({
                                                ...current,
                                                email: event.target.value,
                                            })), placeholder: "you@example.com" })] }), _jsxs("label", { children: [_jsx("span", { children: "Password" }), _jsx("input", { type: "password", value: loginForm.password, onChange: (event) => setLoginForm((current) => ({
                                                ...current,
                                                password: event.target.value,
                                            })), placeholder: "At least 6 characters" })] }), _jsx("p", { className: "validation", children: "Demo: ankita@gmail.com or riya.manager@stayease.com \u2014 password 123456." }), _jsx("button", { className: "search-button", type: "submit", disabled: !isLoginValid || isSubmitting, children: isSubmitting ? "Signing in…" : "Login" })] })] }) }))] }));
}
