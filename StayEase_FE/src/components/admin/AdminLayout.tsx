import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <main className="manager-shell">
      <header className="manager-header">
        <NavLink className="brand" to="/admin/home">
          <span className="brand-mark">S</span> StayEase
        </NavLink>
        <nav className="manager-nav" aria-label="Admin navigation">
          <NavLink end to="/admin/home">Dashboard</NavLink>
          <NavLink to="/admin/home/hotels">Hotel directory</NavLink>
        </nav>
        <div className="manager-user">
          <span>{user?.name}</span>
          <button type="button" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      <Outlet />
    </main>
  );
}
