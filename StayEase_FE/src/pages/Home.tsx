import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBookings } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";
import { authTokenStorageKey, loginUser } from "../services/authApi";

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
type LoginForm = { email: string; password: string };

const emptySearch: Search = { city: "", checkIn: "", checkOut: "" };
const searchStorageKey = "stayease-last-search";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getBookingsForUser } = useBookings();
  const { login: startManagerSession, logout: endManagerSession } = useAuth();
  const savedSearch =
    (location.state as { activeSearch?: Search } | null)?.activeSearch ?? null;
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [search, setSearch] = useState<Search>(() => {
    if (savedSearch) {
      return savedSearch;
    }

    if (typeof window === "undefined") {
      return emptySearch;
    }

    const storedSearch = window.localStorage.getItem(searchStorageKey);
    if (!storedSearch) {
      return emptySearch;
    }

    try {
      const parsedSearch = JSON.parse(storedSearch) as Search;
      return parsedSearch && typeof parsedSearch === "object"
        ? parsedSearch
        : emptySearch;
    } catch {
      return emptySearch;
    }
  });
  const [activeSearch, setActiveSearch] = useState<Search | null>(
    () => savedSearch,
  );
  const [isSearchOpen, setIsSearchOpen] = useState(() => !savedSearch);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/mockAPI.json")
      .then((response) => response.json())
      .then((data: { hotels: Hotel[] }) => {
        setHotels(data.hotels);

        const storedEmail = window.localStorage.getItem("stayease-user-email");
        const storedName = window.localStorage.getItem("stayease-user-name");
        if (storedEmail) {
          setLoggedInEmail(storedEmail);
          setLoggedInUser(storedName ?? storedEmail.split("@")[0]);
        }
      })
      .catch(() => {
        setLoginError("Unable to load hotel data.");
      });
  }, []);

  const isValid = Boolean(
    search.city &&
    search.checkIn &&
    search.checkOut &&
    search.checkOut > search.checkIn,
  );
  const isLoginValid =
    emailPattern.test(loginForm.email.trim()) &&
    loginForm.password.trim().length >= 6;
  const displayedHotels = useMemo(
    () =>
      activeSearch
        ? hotels.filter((hotel) => hotel.city === activeSearch.city)
        : [],
    [activeSearch, hotels],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(searchStorageKey, JSON.stringify(search));
    }
  }, [search]);

  const submitSearch = () => {
    if (!isValid) return;
    setActiveSearch(search);
    setIsSearchOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(searchStorageKey, JSON.stringify(search));
    }
  };

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setLoginSuccess("");

    if (!isLoginValid) {
      setLoginError(
        "Please use a valid email and a password with at least 6 characters.",
      );
      return;
    }

    const requestedEmail = loginForm.email.trim().toLowerCase();
    const requestedPassword = loginForm.password.trim();

    try {
      const authenticatedUser = await loginUser(requestedEmail, requestedPassword);
      const role = authenticatedUser.role.toLowerCase();

      if (authenticatedUser.token) {
        window.localStorage.setItem(authTokenStorageKey, authenticatedUser.token);
      }

      if (role === "manager") {
        const isManager = await startManagerSession(
          requestedEmail,
          requestedPassword,
        );
        if (!isManager) {
          setLoginError("Unable to start the manager session.");
          return;
        }

        window.localStorage.setItem("stayease-user-email", authenticatedUser.email);
        window.localStorage.setItem("stayease-user-name", authenticatedUser.name);
        window.localStorage.setItem("stayease-user-type", "manager");
        setLoginForm({ email: "", password: "" });
        setIsLoginOpen(false);
        navigate("/manager");
        return;
      }

      setLoggedInUser(authenticatedUser.name);
      setLoggedInEmail(authenticatedUser.email);
      window.localStorage.setItem("stayease-user-email", authenticatedUser.email);
      window.localStorage.setItem("stayease-user-name", authenticatedUser.name);
      window.localStorage.setItem("stayease-user-type", role ?? "user");
      setLoginSuccess(`Login successful (${role || "user"})`);
      setLoginForm({ email: "", password: "" });
      setIsLoginOpen(false);
      return;
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "Unable to login. Please check your credentials.",
      );
    }
  };

  const openLogin = () => {
    setLoginError("");
    setLoginSuccess("");
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
    setLoginForm({ email: "", password: "" });
    setLoginError("");
    setLoginSuccess("");
  };

  const logout = () => {
    setLoggedInUser(null);
    setLoggedInEmail(null);
    window.localStorage.removeItem("stayease-user-email");
    window.localStorage.removeItem("stayease-user-name");
    window.localStorage.removeItem("stayease-user-type");
    window.localStorage.removeItem(authTokenStorageKey);
    endManagerSession();
    setLoginSuccess("You have been logged out.");
  };

  const userBookingsCount = getBookingsForUser(loggedInEmail).length;
  const loggedInUserType = window.localStorage
    .getItem("stayease-user-type")
    ?.toLowerCase();
  const isAdminUser = loggedInUserType === "admin";

  return (
    <main>
      <header className="site-header">
        <div className="header-actions">
          <a className="brand" href="/" aria-label="StayEase home">
            <span className="brand-mark">S</span> StayEase
          </a>
        </div>
        <div className="header-actions">
          {activeSearch && (
            <button
              className="change-search"
              onClick={() => setIsSearchOpen(true)}
            >
              Change search
            </button>
          )}
          {loggedInEmail ? (
            <Link className="login-button" to="/bookings">
              View bookings{userBookingsCount ? ` (${userBookingsCount})` : ""}
            </Link>
          ) : null}
          {loggedInUser ? (
            <div className="auth-badge">
              <span>Hi, {loggedInUser}</span>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-button" type="button" onClick={openLogin}>
              Login
            </button>
          )}
        </div>
      </header>

      {(loginError || loginSuccess) && (
        <div
          className={`auth-status ${loginError ? "auth-status--error" : "auth-status--success"}`}
        >
          {loginError || loginSuccess}
        </div>
      )}

      <section className="hero">
        <p className="eyebrow">FIND YOUR PERFECT STAY</p>
        <h1>
          Comfort, wherever
          <br />
          you’re going.
        </h1>
        <p>Thoughtfully selected stays in the cities you love.</p>
      </section>

      {isAdminUser ? (
        <section className="results" aria-live="polite">
          <div className="results-heading">
            <div>
              <p className="eyebrow">ADMIN DASHBOARD</p>
              <h2>Choose an action</h2>
            </div>
          </div>
          <div className="hotel-grid">
            <div className="hotel-card">
              <article>
                <div className="hotel-content">
                  <p className="city-label">MANAGEMENT</p>
                  <h3>Create hotel listing</h3>
                  <p className="description">
                    Add a new property and make it available for guests.
                  </p>
                </div>
              </article>
            </div>
            <div className="hotel-card">
              <article>
                <div className="hotel-content">
                  <p className="city-label">COMING SOON</p>
                  <h3>More admin options</h3>
                  <p className="description">
                    Additional management actions will be added in future steps.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
      ) : activeSearch ? (
        <section className="results" aria-live="polite">
          <div className="results-heading">
            <div>
              <p className="eyebrow">AVAILABLE STAYS</p>
              <h2>Hotels in {activeSearch.city}</h2>
            </div>
            <div className="trip-dates">
              <span>{formatDate(activeSearch.checkIn)}</span>
              <i aria-hidden="true">→</i>
              <span>{formatDate(activeSearch.checkOut)}</span>
            </div>
          </div>
          {displayedHotels.length ? (
            <div className="hotel-grid">
              {displayedHotels.map((hotel) => (
                <Link
                  className="hotel-card"
                  key={hotel.id}
                  to={`/hotel/${hotel.id}`}
                  state={{ activeSearch }}
                >
                  <article>
                    <img src={hotel.image} alt={hotel.name} />
                    <div className="hotel-content">
                      <div className="hotel-title-row">
                        <div>
                          <p className="city-label">{hotel.city}</p>
                          <h3>{hotel.name}</h3>
                        </div>
                        <span className="rating">★ {hotel.rating}</span>
                      </div>
                      <p className="description">{hotel.description}</p>
                      <p className="price">
                        <strong>₹{hotel.price.toLocaleString("en-IN")}</strong>{" "}
                        / night
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-state">No stays found for these dates.</p>
          )}
        </section>
      ) : (
        <section className="pre-search">
          <p>Your next memorable stay is just a search away.</p>
        </section>
      )}

      {isSearchOpen && !isAdminUser && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="search-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-title"
          >
            <span className="modal-icon" aria-hidden="true">
              ⌂
            </span>
            <p className="eyebrow">PLAN YOUR STAY</p>
            <h2 id="search-title">Where are you going?</h2>
            <p className="modal-copy">
              Choose a city and dates to discover your ideal stay.
            </p>
            <div className="form-grid">
              <label>
                <span>City</span>
                <select
                  value={search.city}
                  onChange={(event) =>
                    setSearch({ ...search, city: event.target.value })
                  }
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                </select>
              </label>
              <label>
                <span>Check-in</span>
                <input
                  type="date"
                  value={search.checkIn}
                  onChange={(event) =>
                    setSearch({ ...search, checkIn: event.target.value })
                  }
                />
              </label>
              <label>
                <span>Check-out</span>
                <input
                  type="date"
                  min={search.checkIn || undefined}
                  value={search.checkOut}
                  onChange={(event) =>
                    setSearch({ ...search, checkOut: event.target.value })
                  }
                />
              </label>
            </div>
            {search.checkIn &&
              search.checkOut &&
              search.checkOut <= search.checkIn && (
                <p className="validation">Check-out must be after check-in.</p>
              )}
            <button
              className="search-button"
              disabled={!isValid}
              onClick={submitSearch}
            >
              Search hotels <span>→</span>
            </button>
          </section>
        </div>
      )}

      {isLoginOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={closeLogin}
        >
          <section
            className="search-modal login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="modal-icon" aria-hidden="true">
              🔐
            </span>
            <p className="eyebrow">ACCOUNT ACCESS</p>
            <h2 id="login-title">Login to StayEase</h2>
            <p className="modal-copy">
              Use your email and password to continue.
            </p>
            <form className="form-grid" onSubmit={submitLogin}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="At least 6 characters"
                />
              </label>
              <p className="validation">
                Demo: ankita@gmail.com or riya.manager@stayease.com — password
                123456.
              </p>
              <button
                className="search-button"
                type="submit"
                disabled={!isLoginValid}
              >
                Login
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
