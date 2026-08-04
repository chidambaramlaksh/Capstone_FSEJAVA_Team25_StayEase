import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const storedEmail = window.localStorage.getItem("stayease-user-email");
        const storedType = window.localStorage.getItem("stayease-user-type");
        if (storedEmail && storedType === "admin") {
            navigate("/admin/home", { replace: true });
        }
    }, [navigate]);
    const submitLogin = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const response = await fetch("/mockAPI.json");
            const data = await response.json();
            const users = data.login?.users ?? [];
            const expectedPassword = data.login?.allowedPassword ?? "123456";
            const matchingUser = users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
            if (matchingUser && matchingUser.userType?.toLowerCase() === "admin" && password.trim() === expectedPassword) {
                window.localStorage.setItem("stayease-user-email", matchingUser.email);
                window.localStorage.setItem("stayease-user-type", "admin");
                navigate("/admin/home", { replace: true });
                return;
            }
            setError("Invalid admin credentials. Use ankita_admin@gmail.com with password 123456.");
        }
        catch {
            setError("Unable to load admin credentials.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("main", { className: "confirmation-page", children: [_jsx("header", { className: "site-header", children: _jsxs("a", { className: "brand", href: "/", "aria-label": "StayEase home", children: [_jsx("span", { className: "brand-mark", children: "S" }), " StayEase"] }) }), _jsxs("section", { className: "confirmation-wrap", children: [_jsxs("div", { className: "confirmation-status", children: [_jsx("span", { children: "\uD83D\uDD10" }), _jsx("p", { className: "eyebrow", children: "ADMIN ACCESS" }), _jsx("h1", { children: "Sign in to continue." }), _jsx("p", { children: "Use the admin credentials to enter the management area." })] }), _jsx("div", { className: "booking-card", children: _jsx("div", { className: "booking-card-content", children: _jsxs("form", { className: "form-grid", onSubmit: submitLogin, children: [_jsxs("label", { children: [_jsx("span", { children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (event) => setEmail(event.target.value), placeholder: "admin@example.com" })] }), _jsxs("label", { children: [_jsx("span", { children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (event) => setPassword(event.target.value), placeholder: "At least 6 characters" })] }), error ? _jsx("p", { className: "validation", children: error }) : null, _jsx("button", { className: "search-button", type: "submit", disabled: isSubmitting, children: isSubmitting ? "Signing in..." : "Login as admin" })] }) }) })] })] }));
}
