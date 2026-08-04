import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <main className="confirmation-page">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="StayEase home">
          <span className="brand-mark">S</span> StayEase
        </Link>
      </header>

      <section className="confirmation-wrap">
        <div className="confirmation-status">
          <span>🏠</span>
          <p className="eyebrow">ADMIN HOME</p>
          <h1>Welcome back, admin.</h1>
          <p>Manage listings and other admin tasks from here.</p>
        </div>

        <div className="booking-card">
          <div className="booking-card-content">
            <div className="room-list">
              <article className="room-card">
                <div className="room-icon" aria-hidden="true">
                  ＋
                </div>
                <div className="room-info">
                  <h3>Create hotel listing</h3>
                  <p>Add a new property and make it available for bookings.</p>
                </div>
              </article>
              <article className="room-card">
                <div className="room-icon" aria-hidden="true">
                  ⚙
                </div>
                <div className="room-info">
                  <h3>More admin tools</h3>
                  <p>
                    Additional management actions will be added in the next
                    steps.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
