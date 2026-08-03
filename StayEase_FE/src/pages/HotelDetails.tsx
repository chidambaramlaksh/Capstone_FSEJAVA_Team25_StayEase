import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

type Room = {
  category: "Single" | "Double" | "Suite";
  description: string;
  price: number;
  available: number;
  maxOccupancy: number;
};

type Hotel = {
  id: number;
  name: string;
  description: string;
  city: string;
  image: string;
  rating: number;
  rooms: Room[];
};

type Search = { city: string; checkIn: string; checkOut: string };

export default function HotelDetails() {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const activeSearch = (location.state as { activeSearch?: Search } | null)
    ?.activeSearch;

  useEffect(() => {
    fetch("/mockAPI.json")
      .then((response) => response.json())
      .then((data: { hotels: Hotel[] }) => {
        setHotel(
          data.hotels.find((item) => item.id === Number(hotelId)) ?? null,
        );
      })
      .finally(() => setIsLoading(false));
  }, [hotelId]);

  if (isLoading)
    return <main className="page-message">Loading hotel details…</main>;
  if (!hotel) {
    return (
      <main className="page-message">
        <h1>Hotel not found</h1>
        <Link to="/">Back to stays</Link>
      </main>
    );
  }

  const reserveRoom = (room: Room) => {
    if (room.available <= 0) return;

    const bookingSearch = activeSearch ?? {
      city: hotel.city,
      checkIn: "",
      checkOut: "",
    };
    const bookingId = `SE-${Date.now().toString().slice(-8)}-${hotel.id}${room.category.charAt(0)}`;
    navigate("/booking-confirmation", {
      state: { bookingId, hotel, room, search: bookingSearch },
    });
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
                    disabled={!isAvailable}
                    onClick={() => reserveRoom(room)}
                  >
                    {isAvailable ? "Reserve room" : "Sold out"}
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
