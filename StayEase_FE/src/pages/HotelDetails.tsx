import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useBookings } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import { useHotels } from "../context/HotelContext";
import type { HotelRoom } from "../services/hotelApi";
import { createBooking } from "../services/bookingsApi";

type Search = { city: string; checkIn: string; checkOut: string };

function getNights(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00`).getTime();
  const end = new Date(`${checkOut}T00:00:00`).getTime();
  return Math.max(1, Math.round((end - start) / 86_400_000));
}

export default function HotelDetails() {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const { getHotelById } = useHotels();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const hotel = getHotelById(hotelId ?? "");
  const activeSearch = (location.state as { activeSearch?: Search } | null)
    ?.activeSearch;

  if (!hotel) {
    return (
      <main className="page-message">
        <h1>Hotel not found</h1>
        <Link to="/">Back to stays</Link>
      </main>
    );
  }

  const reserveRoom = async (room: HotelRoom) => {
    if (room.available <= 0) return;

    setBookingError("");
    if (!user?.token) {
      setBookingError("Please log in before reserving a room.");
      return;
    }

    const bookingSearch = activeSearch ?? {
      city: hotel.city,
      checkIn: "",
      checkOut: "",
    };
    if (
      !bookingSearch.checkIn ||
      !bookingSearch.checkOut ||
      bookingSearch.checkOut <= bookingSearch.checkIn
    ) {
      setBookingError("Please select valid check-in and check-out dates.");
      return;
    }

    setIsBooking(true);
    try {
      await createBooking(user.token, {
        roomId: room.id,
        checkInDate: bookingSearch.checkIn,
        checkOutDate: bookingSearch.checkOut,
      });

    const bookingId = `SE-${Date.now().toString().slice(-8)}-${hotel.id}${room.category.charAt(0)}`;
    const bookingEntry = {
      bookingId,
      hotelName: hotel.name,
      hotelCity: hotel.city,
      hotelImage: hotel.image,
      roomCategory: room.category,
      roomPrice: room.price,
      maxOccupancy: room.maxOccupancy,
      checkIn: bookingSearch.checkIn,
      checkOut: bookingSearch.checkOut,
      totalPrice: getNights(bookingSearch.checkIn, bookingSearch.checkOut) * room.price,
      bookedOn: new Date().toISOString(),
      userEmail: user?.email,
    };

    addBooking(bookingEntry);
    navigate("/booking-confirmation", {
      state: { bookingId, hotel, room, search: bookingSearch, bookingEntry },
    });
    } catch {
      setBookingError("Unable to reserve this room. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <main className="details-page">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="StayEase home">
          <span className="brand-mark">S</span> StayEase
        </Link>
        <Link className="change-search" to="/" state={location.state}>
          ← All hotels
        </Link>
      </header>

      <section
        className="hotel-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(13, 45, 39, .88), rgba(13, 45, 39, .35)), url(${hotel.image})`,
        }}
      >
        <div>
          <p className="eyebrow">{hotel.city.toUpperCase()} · BOUTIQUE STAY</p>
          <h1>{hotel.name}</h1>
          <p className="details-description">{hotel.description}</p>
          <span className="detail-rating">★ {hotel.rating} guest rating</span>
        </div>
      </section>

      <section className="rooms-section">
        <div className="rooms-heading">
          <div>
            <p className="eyebrow">CHOOSE YOUR ROOM</p>
            <h2>Available rooms</h2>
          </div>
          <p>All prices are per night, inclusive of taxes.</p>
        </div>
        {bookingError ? <p className="validation">{bookingError}</p> : null}
        <div className="room-list">
          {hotel.rooms.map((room) => {
            const isAvailable = room.available > 0;

            return (
              <article
                className={`room-card${isAvailable ? "" : " room-card--unavailable"}`}
                key={room.category}
              >
                <div
                  className={`room-icon ${room.category.toLowerCase()}`}
                  aria-hidden="true"
                >
                  {room.category === "Suite" ? "✦" : "⌂"}
                </div>
                <div className="room-info">
                  <h3>{room.category} Room</h3>
                  <p>{room.description}</p>
                  <span>
                    {room.available} rooms available · Max {room.maxOccupancy}{" "}
                    pax
                  </span>
                </div>
                <div className="room-price">
                  <strong>₹{room.price.toLocaleString("en-IN")}</strong>
                  <span>per night</span>
                  <button
                    type="button"
                    disabled={!isAvailable || isBooking}
                    onClick={() => reserveRoom(room)}
                  >
                    {isBooking ? "Reserving…" : isAvailable ? "Reserve room" : "Sold out"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
