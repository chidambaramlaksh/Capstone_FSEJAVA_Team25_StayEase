import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  cancelBooking,
  getMyBookings,
  type UserBooking,
} from "../services/bookingsApi";

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

function formatDateTime(value: string) {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancellingBookingId, setCancellingBookingId] = useState<
    UserBooking["id"] | null
  >(null);

  useEffect(() => {
    if (!user?.token) {
      setBookings([]);
      return;
    }

    let isCurrentRequest = true;
    setIsLoading(true);
    setError("");

    getMyBookings(user.token)
      .then((userBookings) => {
        if (isCurrentRequest) setBookings(userBookings);
      })
      .catch(() => {
        if (isCurrentRequest) {
          setBookings([]);
          setError("Unable to load your bookings. Please try again.");
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [user?.token]);

  async function handleCancelBooking(booking: UserBooking) {
    if (!user?.token || cancellingBookingId !== null) return;

    const confirmed = window.confirm(
      `Cancel booking ${booking.bookingRef}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setCancellingBookingId(booking.id);
    setCancelError("");

    try {
      await cancelBooking(user.token, booking.id);
      setBookings((currentBookings) =>
        currentBookings.map((currentBooking) =>
          currentBooking.id === booking.id
            ? { ...currentBooking, status: "CANCELLED" }
            : currentBooking,
        ),
      );
    } catch {
      setCancelError(
        "Unable to cancel this booking. Please try again.",
      );
    } finally {
      setCancellingBookingId(null);
    }
  }

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

        {cancelError && <p className="validation" role="alert">{cancelError}</p>}

        {!user ? (
          <div className="booking-card">
            <div className="booking-card-content">
              <p className="modal-copy">Please log in to view your bookings.</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="booking-card">
            <div className="booking-card-content">
              <p className="modal-copy">Loading your bookings…</p>
            </div>
          </div>
        ) : error ? (
          <div className="booking-card">
            <div className="booking-card-content">
              <p className="validation">{error}</p>
            </div>
          </div>
        ) : bookings.length ? (
          <div className="room-list">
            {bookings.map((booking) => (
              <article className="booking-card" key={booking.bookingRef}>
                <div className="booking-card-content">
                  <div className="booking-id">
                    <span>Booking reference</span>
                    <strong>{booking.bookingRef}</strong>
                  </div>
                  <p className="city-label">{booking.status}</p>
                  <h2>{booking.hotelName}</h2>
                  <div className="booking-details">
                    <div>
                      <span>Guest</span>
                      <strong>{booking.guestEmail}</strong>
                    </div>
                    <div>
                      <span>Room ID</span>
                      <strong>{booking.roomId}</strong>
                    </div>
                    <div>
                      <span>Check-in</span>
                      <strong>{formatDate(booking.checkInDate)}</strong>
                    </div>
                    <div>
                      <span>Check-out</span>
                      <strong>{formatDate(booking.checkOutDate)}</strong>
                    </div>
                  </div>
                  <div className="booking-total">
                    <div>
                      <span>Booked on {formatDateTime(booking.createdAt)}</span>
                      <strong>Total price</strong>
                    </div>
                    <strong>
                      ₹{Number(booking.totalPrice).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="booking-actions">
                    {String(booking.status).toUpperCase() === "CANCELLED" ||
                    String(booking.status).toUpperCase() === "CANCELED" ? (
                      <span className="booking-cancelled">Booking cancelled</span>
                    ) : (
                      <button
                        className="booking-cancel-button"
                        type="button"
                        disabled={cancellingBookingId === booking.id}
                        onClick={() => handleCancelBooking(booking)}
                      >
                        {cancellingBookingId === booking.id
                          ? "Cancelling…"
                          : "Cancel booking"}
                      </button>
                    )}
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
