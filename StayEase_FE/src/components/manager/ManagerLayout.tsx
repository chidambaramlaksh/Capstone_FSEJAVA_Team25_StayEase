import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ManagerLayout() {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <main className="manager-shell">
      <header className="manager-header">
        <NavLink className="brand" to="/manager">
          <span className="brand-mark">S</span> StayEase
        </NavLink>
        <nav className="manager-nav" aria-label="Manager navigation">
          <NavLink end to="/manager">
            Dashboard
          </NavLink>
          <NavLink to="/manager/rooms">Rooms</NavLink>
          <NavLink to="/manager/bookings">Upcoming bookings</NavLink>
        </nav>
        <div className="manager-user">
          <span>{user?.name}</span>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>
      <Outlet />
    </main>
  );
}
