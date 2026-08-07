import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
export default function ProtectedRoute({ allowedRoles, }) {
    const { user } = useAuth();
    const location = useLocation();
    const role = (user?.role ?? user?.userType)?.toUpperCase();
    if (!user || !role || !allowedRoles.includes(role)) {
        return _jsx(Navigate, { to: "/", replace: true, state: { from: location.pathname } });
    }
    return _jsx(Outlet, {});
}
