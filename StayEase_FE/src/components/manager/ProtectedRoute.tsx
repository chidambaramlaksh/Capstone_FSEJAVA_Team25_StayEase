import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types/manager";

export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: UserRole[];
}) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
