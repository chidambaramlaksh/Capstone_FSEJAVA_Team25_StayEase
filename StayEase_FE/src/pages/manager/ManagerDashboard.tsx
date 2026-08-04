import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useManager } from "../../context/ManagerContext";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { rooms } = useManager();
  const hotelRooms = rooms.filter((room) => room.hotelId === user?.hotelId);
  const activeRooms = hotelRooms.filter((room) => room.isActive).length;
  return (
    <section className="manager-page">
      <div className="manager-page__intro">
        <div>
          <p className="eyebrow">THE MARINE HOUSE · MUMBAI</p>
          <h1>Good morning, {user?.name.split(" ")[0]}.</h1>
          <p>Here is a quick overview of your hotel today.</p>
        </div>
      </div>
      <div className="manager-stats">
        <article>
          <span>Total rooms</span>
          <strong>{hotelRooms.length}</strong>
          <small>In your inventory</small>
        </article>
        <article>
          <span>Active rooms</span>
          <strong>{activeRooms}</strong>
          <small>Available to guests</small>
        </article>
        <article>
          <span>Inactive rooms</span>
          <strong>{hotelRooms.length - activeRooms}</strong>
          <small>Currently hidden</small>
        </article>
      </div>
      <div className="manager-actions">
        <Link to="/manager/rooms">
          <span>⌂</span>
          <div>
            <h2>Manage rooms</h2>
            <p>Add, update, activate, or remove room inventory.</p>
          </div>
          <b>→</b>
        </Link>
        <Link to="/manager/bookings">
          <span>▣</span>
          <div>
            <h2>Upcoming bookings</h2>
            <p>Review guests arriving at your hotel.</p>
          </div>
          <b>→</b>
        </Link>
      </div>
    </section>
  );
}
