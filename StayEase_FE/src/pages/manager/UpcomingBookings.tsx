import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUpcomingBookings } from "../../services/managerApi";
import type { ManagerBooking } from "../../types/manager";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));

export default function UpcomingBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ManagerBooking[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token || typeof user.managedHotelId !== "number") {
      setBookings([]);
      setLoading(false);
      return;
    }

    let isCurrentRequest = true;
    setLoading(true);
    setError("");

    getUpcomingBookings(user.token)
      .then((upcomingBookings) => {
        if (isCurrentRequest) setBookings(upcomingBookings);
      })
      .catch(() => {
        if (isCurrentRequest) {
          setBookings([]);
          setError("Unable to load upcoming bookings. Please try again.");
        }
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [user?.managedHotelId, user?.token]);

  const filtered = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          (booking.guestName + booking.guestEmail + booking.hotelName + booking.roomNumber)
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === "all" || booking.status === status),
      ),
    [bookings, query, status],
  );
  return (
    <section className="manager-page">
      <div className="manager-page__heading">
        <div>
          <p className="eyebrow">GUEST STAYS</p>
          <h1>Upcoming bookings</h1>
          <p>Reservations arriving soon across your assigned hotels.</p>
        </div>
      </div>
      <div className="manager-toolbar">
        <input
          aria-label="Search bookings"
          placeholder="Search guest, hotel, email, or room…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Filter bookings by status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">All booking statuses</option>
          <option value="BOOKED">Confirmed</option>
        </select>
      </div>
      {error ? (
        <p className="manager-empty" role="alert">{error}</p>
      ) : loading ? (
        <p className="manager-empty">Loading bookings…</p>
      ) : (
        <div className="booking-table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Stay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.guestName}</strong>
                    <span>{booking.guestEmail}</span>
                  </td>
                  <td>
                    <strong>{booking.roomNumber}</strong>
                    <span>{booking.hotelName} · {booking.roomType}</span>
                  </td>
                  <td>
                    <strong>{formatDate(booking.checkInDate)}</strong>
                    <span>to {formatDate(booking.checkOutDate)}</span>
                  </td>
                  <td>
                    <span className="status status--active">Confirmed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="manager-empty">
              No upcoming bookings match these filters.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
