import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUpcomingBookings } from "../../services/managerMockApi";
import type { ManagerBooking } from "../../types/manager";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));

export default function UpcomingBookings() {
  const { user } = useAuth(); const [bookings, setBookings] = useState<ManagerBooking[]>([]); const [query, setQuery] = useState(""); const [status, setStatus] = useState("all"); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!user) return; getUpcomingBookings(user.hotelId).then(setBookings).finally(() => setLoading(false)); }, [user]);
  const filtered = useMemo(() => bookings.filter((booking) => (booking.guestName + booking.guestEmail + booking.roomNumber).toLowerCase().includes(query.toLowerCase()) && (status === "all" || booking.status === status)), [bookings, query, status]);
  return <section className="manager-page"><div className="manager-page__heading"><div><p className="eyebrow">GUEST STAYS</p><h1>Upcoming bookings</h1><p>Reservations arriving soon at The Marine House.</p></div></div><div className="manager-toolbar"><input aria-label="Search bookings" placeholder="Search guest, email, or room…" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Filter bookings by status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All booking statuses</option><option>Confirmed</option><option>Pending</option></select></div>{loading ? <p className="manager-empty">Loading bookings…</p> : <div className="booking-table-wrap"><table className="booking-table"><thead><tr><th>Guest</th><th>Room</th><th>Stay</th><th>Guests</th><th>Status</th></tr></thead><tbody>{filtered.map((booking) => <tr key={booking.id}><td><strong>{booking.guestName}</strong><span>{booking.guestEmail}</span></td><td><strong>{booking.roomNumber}</strong><span>{booking.roomType}</span></td><td><strong>{formatDate(booking.checkIn)}</strong><span>to {formatDate(booking.checkOut)}</span></td><td>{booking.guests}</td><td><span className={booking.status === "Confirmed" ? "status status--active" : "status status--pending"}>{booking.status}</span></td></tr>)}</tbody></table>{!filtered.length && <p className="manager-empty">No upcoming bookings match these filters.</p>}</div>}</section>;
}
