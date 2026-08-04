import { Link } from "react-router-dom";
import { useBookings } from "../context/BookingContext";

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default function Bookings() {
  const { getBookingsForUser } = useBookings();
  const userEmail = typeof window !== "undefined" ? window.localStorage.getItem("stayease-user-email") : null;
  const bookings = getBookingsForUser(userEmail);

  return (
    <main className="confirmation-page">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="StayEase home">
          <span className="brand-mark">S</span> StayEase
        </Link>
      </header>

      <section className="confirmation-wrap">
        <div className="confirmation-status">
          <span>🧳</span>
          <p className="eyebrow">YOUR BOOKINGS</p>
          <h1>All your stays in one place.</h1>
          <p>Review current and past reservations whenever you need them.</p>
        </div>

        {!userEmail ? (
          <div className="booking-card">
            <div className="booking-card-content">
              <p className="modal-copy">Please log in to view your bookings.</p>
            </div>
          </div>
        ) : bookings.length ? (
          <div className="room-list">
            {bookings.map((booking) => (
              <article className="booking-card" key={booking.bookingId}>
                <img src={booking.hotelImage} alt={booking.hotelName} />
                <div className="booking-card-content">
                  <div className="booking-id">
                    <span>Booking ID</span>
                    <strong>{booking.bookingId}</strong>
                  </div>
                  <p className="city-label">{booking.hotelCity}</p>
                  <h2>{booking.hotelName}</h2>
                  <div className="booking-details">
                    <div>
                      <span>Room</span>
                      <strong>{booking.roomCategory} Room</strong>
                    </div>
                    <div>
                      <span>Guests</span>
                      <strong>Up to {booking.maxOccupancy} pax</strong>
                    </div>
                    <div>
                      <span>Check-in</span>
                      <strong>{formatDate(booking.checkIn)}</strong>
                    </div>
                    <div>
                      <span>Check-out</span>
                      <strong>{formatDate(booking.checkOut)}</strong>
                    </div>
                  </div>
                  <div className="booking-total">
                    <div>
                      <span>Booked on {formatDate(booking.bookedOn)}</span>
                      <strong>Total price</strong>
                    </div>
                    <strong>₹{booking.totalPrice.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="booking-card">
            <div className="booking-card-content">
              <p className="modal-copy">No bookings yet. Reserve a room to see it here.</p>
            </div>
          </div>
        )}

        <Link className="return-home" to="/">
          Return to home
        </Link>
      </section>
    </main>
  );
}
