import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: string[];
}) {
  const { user } = useAuth();
  const location = useLocation();
  const role = (user?.role ?? user?.userType)?.toUpperCase();
  if (!user || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
