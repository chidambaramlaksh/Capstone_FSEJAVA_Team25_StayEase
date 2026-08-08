import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const role = String(user?.role ?? user?.userType ?? "user").toLowerCase();
    if (user && role === "admin") {
      navigate("/admin/home", { replace: true });
    } else if (user && role === "hotel_manager") {
      navigate("/manager", { replace: true });
    }
  }, [navigate, user]);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const authenticatedUser = await login(email, password);
      const role = String(
        authenticatedUser?.role ?? authenticatedUser?.userType ?? "user",
      ).toLowerCase();
      if (authenticatedUser && role === "admin") {
        navigate("/admin/home", { replace: true });
        return;
      }
      if (authenticatedUser && role === "hotel_manager") {
        navigate("/manager", { replace: true });
        return;
      }

      setError("This account does not have admin or manager access.");
    } catch {
      setError("Unable to sign in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="confirmation-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="StayEase home">
          <span className="brand-mark">S</span> StayEase
        </a>
      </header>

      <section className="confirmation-wrap">
        <div className="confirmation-status">
          <span>🔐</span>
          <p className="eyebrow">ADMIN & MANAGER ACCESS</p>
          <h1>Sign in to continue.</h1>
          <p>Use your admin or manager credentials to enter the management area.</p>
        </div>

        <div className="booking-card">
          <div className="booking-card-content">
            <form className="form-grid" onSubmit={submitLogin}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                />
              </label>
              {error ? <p className="validation">{error}</p> : null}
              <button
                className="search-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
