import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

export default function AdminDashboard() {
  const { hotels, isLoading } = useAdmin();
  const cities = new Set(hotels.map((hotel) => hotel.city)).size;
  const highlyRated = hotels.filter((hotel) => hotel.starRating >= 4).length;

  return (
    <section className="manager-page">
      <div className="manager-page__intro">
        <div>
          <p className="eyebrow">STAYEASE ADMINISTRATION</p>
          <h1>Hotel operations, all in one place.</h1>
          <p>Manage hotel listings and keep the public directory up to date.</p>
        </div>
      </div>
      <div className="manager-stats">
        <article>
          <span>Total hotels</span>
          <strong>{isLoading ? "—" : hotels.length}</strong>
          <small>In the directory</small>
        </article>
        <article>
          <span>Cities covered</span>
          <strong>{isLoading ? "—" : cities}</strong>
          <small>Across the directory</small>
        </article>
        <article>
          <span>Highly rated stays</span>
          <strong>{isLoading ? "—" : highlyRated}</strong>
          <small>Rated four stars or more</small>
        </article>
      </div>
      <div className="manager-actions">
        <Link to="/admin/home/hotels">
          <span>⌂</span>
          <div>
            <h2>Manage hotel directory</h2>
            <p>Add, update, or remove hotel listings.</p>
          </div>
          <b>→</b>
        </Link>
      </div>
    </section>
  );
}
