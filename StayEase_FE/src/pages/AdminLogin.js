import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function AdminLogin() {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const role = String(user?.role ?? user?.userType ?? "user").toLowerCase();
        if (user && role === "admin") {
            navigate("/admin/home", { replace: true });
        }
        else if (user && role === "hotel_manager") {
            navigate("/manager", { replace: true });
        }
    }, [navigate, user]);
    const submitLogin = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const authenticatedUser = await login(email, password);
            const role = String(authenticatedUser?.role ?? authenticatedUser?.userType ?? "user").toLowerCase();
            if (authenticatedUser && role === "admin") {
                navigate("/admin/home", { replace: true });
                return;
            }
            if (authenticatedUser && role === "hotel_manager") {
                navigate("/manager", { replace: true });
                return;
            }
            setError("This account does not have admin or manager access.");
        }
        catch {
            setError("Unable to sign in. Please check your credentials.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("main", { className: "confirmation-page", children: [_jsx("header", { className: "site-header", children: _jsxs("a", { className: "brand", href: "/", "aria-label": "StayEase home", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }) }), _jsxs("section", { className: "confirmation-wrap", children: [_jsxs("div", { className: "confirmation-status", children: [_jsx("span", { children: "\uD83D\uDD10" }), _jsx("p", { className: "eyebrow", children: "ADMIN & MANAGER ACCESS" }), _jsx("h1", { children: "Sign in to continue." }), _jsx("p", { children: "Use your admin or manager credentials to enter the management area." })] }), _jsx("div", { className: "booking-card", children: _jsx("div", { className: "booking-card-content", children: _jsxs("form", { className: "form-grid", onSubmit: submitLogin, children: [_jsxs("label", { children: [_jsx("span", { children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (event) => setEmail(event.target.value), placeholder: "admin@example.com" })] }), _jsxs("label", { children: [_jsx("span", { children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (event) => setPassword(event.target.value), placeholder: "At least 6 characters" })] }), error ? _jsx("p", { className: "validation", children: error }) : null, _jsx("button", { className: "search-button", type: "submit", disabled: isSubmitting, children: isSubmitting ? "Signing in..." : "Login" })] }) }) })] })] }));
}
