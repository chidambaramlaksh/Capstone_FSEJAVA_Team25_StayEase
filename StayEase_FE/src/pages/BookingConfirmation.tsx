import { Link, useLocation } from "react-router-dom";

type BookingState = {
  bookingId: string;
  hotel: { name: string; city: string; image: string };
  room: { category: string; price: number; maxOccupancy: number };
  search: { checkIn: string; checkOut: string };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(`${value}T00:00:00`));
}

function getNights(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00`).getTime();
  const end = new Date(`${checkOut}T00:00:00`).getTime();
  return Math.max(1, Math.round((end - start) / 86_400_000));
}

export default function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state as BookingState | null;

  if (!booking) {
    return <main className="page-message"><h1>No booking selected</h1><Link to="/">Find a stay</Link></main>;
  }

  const nights = getNights(booking.search.checkIn, booking.search.checkOut);
  const total = nights * booking.room.price;

  return (
    <main className="confirmation-page">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="StayEase home"><span className="brand-mark">S</span> StayEase</Link>
      </header>
      <section className="confirmation-wrap">
        <div className="confirmation-status"><span>✓</span><p className="eyebrow">BOOKING CONFIRMED</p><h1>Your stay is reserved.</h1><p>We look forward to welcoming you. Your booking details are below.</p></div>
        <article className="booking-card">
          <img src={booking.hotel.image} alt={booking.hotel.name} />
          <div className="booking-card-content">
            <div className="booking-id"><span>Booking ID</span><strong>{booking.bookingId}</strong></div>
            <p className="city-label">{booking.hotel.city}</p><h2>{booking.hotel.name}</h2>
            <div className="booking-details">
              <div><span>Room</span><strong>{booking.room.category} Room</strong></div>
              <div><span>Guests</span><strong>Up to {booking.room.maxOccupancy} pax</strong></div>
              <div><span>Check-in</span><strong>{formatDate(booking.search.checkIn)}</strong></div>
              <div><span>Check-out</span><strong>{formatDate(booking.search.checkOut)}</strong></div>
            </div>
            <div className="booking-total">
              <div><span>₹{booking.room.price.toLocaleString("en-IN")} × {nights} {nights === 1 ? "night" : "nights"}</span><strong>Total price</strong></div>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </article>
        <Link className="return-home" to="/">Return to home</Link>
      </section>
    </main>
  );
}
