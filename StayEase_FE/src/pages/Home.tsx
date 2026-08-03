import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type Hotel = {
  id: number;
  name: string;
  description: string;
  city: "Mumbai" | "Pune";
  image: string;
  rating: number;
  price: number;
};

type Search = { city: string; checkIn: string; checkOut: string };

const emptySearch: Search = { city: "", checkIn: "", checkOut: "" };

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function Home() {
  const location = useLocation();
  const savedSearch = (location.state as { activeSearch?: Search } | null)?.activeSearch ?? null;
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [search, setSearch] = useState<Search>(() => savedSearch ?? emptySearch);
  const [activeSearch, setActiveSearch] = useState<Search | null>(() => savedSearch);
  const [isSearchOpen, setIsSearchOpen] = useState(() => !savedSearch);

  useEffect(() => {
    fetch("/mockAPI.json")
      .then((response) => response.json())
      .then((data: { hotels: Hotel[] }) => setHotels(data.hotels));
  }, []);

  const isValid = Boolean(
    search.city && search.checkIn && search.checkOut && search.checkOut > search.checkIn,
  );
  const displayedHotels = useMemo(
    () => activeSearch ? hotels.filter((hotel) => hotel.city === activeSearch.city) : [],
    [activeSearch, hotels],
  );

  const submitSearch = () => {
    if (!isValid) return;
    setActiveSearch(search);
    setIsSearchOpen(false);
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/" aria-label="StayEase home"><span className="brand-mark">S</span> StayEase</a>
        {activeSearch && <button className="change-search" onClick={() => setIsSearchOpen(true)}>Change search</button>}
      </header>

      <section className="hero">
        <p className="eyebrow">FIND YOUR PERFECT STAY</p>
        <h1>Comfort, wherever<br />you’re going.</h1>
        <p>Thoughtfully selected stays in the cities you love.</p>
      </section>

      {activeSearch ? (
        <section className="results" aria-live="polite">
          <div className="results-heading">
            <div><p className="eyebrow">AVAILABLE STAYS</p><h2>Hotels in {activeSearch.city}</h2></div>
            <div className="trip-dates"><span>{formatDate(activeSearch.checkIn)}</span><i aria-hidden="true">→</i><span>{formatDate(activeSearch.checkOut)}</span></div>
          </div>
          {displayedHotels.length ? (
            <div className="hotel-grid">
              {displayedHotels.map((hotel) => (
                <Link className="hotel-card" key={hotel.id} to={`/hotel/${hotel.id}`} state={{ activeSearch }}>
                  <article>
                    <img src={hotel.image} alt={hotel.name} />
                    <div className="hotel-content">
                      <div className="hotel-title-row">
                        <div><p className="city-label">{hotel.city}</p><h3>{hotel.name}</h3></div>
                        <span className="rating">★ {hotel.rating}</span>
                      </div>
                      <p className="description">{hotel.description}</p>
                      <p className="price"><strong>₹{hotel.price.toLocaleString("en-IN")}</strong> / night</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : <p className="empty-state">No stays found for these dates.</p>}
        </section>
      ) : <section className="pre-search"><p>Your next memorable stay is just a search away.</p></section>}

      {isSearchOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title">
            <span className="modal-icon" aria-hidden="true">⌂</span>
            <p className="eyebrow">PLAN YOUR STAY</p>
            <h2 id="search-title">Where are you going?</h2>
            <p className="modal-copy">Choose a city and dates to discover your ideal stay.</p>
            <div className="form-grid">
              <label><span>City</span>
                <select value={search.city} onChange={(event) => setSearch({ ...search, city: event.target.value })}>
                  <option value="" disabled>Select city</option><option value="Mumbai">Mumbai</option><option value="Pune">Pune</option>
                </select>
              </label>
              <label><span>Check-in</span><input type="date" value={search.checkIn} onChange={(event) => setSearch({ ...search, checkIn: event.target.value })} /></label>
              <label><span>Check-out</span><input type="date" min={search.checkIn || undefined} value={search.checkOut} onChange={(event) => setSearch({ ...search, checkOut: event.target.value })} /></label>
            </div>
            {search.checkIn && search.checkOut && search.checkOut <= search.checkIn && <p className="validation">Check-out must be after check-in.</p>}
            <button className="search-button" disabled={!isValid} onClick={submitSearch}>Search hotels <span>→</span></button>
          </section>
        </div>
      )}
    </main>
  );
}
