import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authTokenStorageKey, loginUser } from "../services/authApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = window.localStorage.getItem("stayease-user-email");
    const storedType = window.localStorage.getItem("stayease-user-type");
    if (storedEmail && storedType === "admin") {
      navigate("/admin/home", { replace: true });
    }
  }, [navigate]);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const authenticatedUser = await loginUser(email.trim(), password.trim());
      const role = authenticatedUser.role.toLowerCase();

      if (role === "admin" || !authenticatedUser.role) {
        window.localStorage.setItem("stayease-user-email", authenticatedUser.email);
        window.localStorage.setItem("stayease-user-name", authenticatedUser.name);
        window.localStorage.setItem("stayease-user-type", "admin");
        if (authenticatedUser.token) {
          window.localStorage.setItem(authTokenStorageKey, authenticatedUser.token);
        }
        navigate("/admin/home", { replace: true });
        return;
      }

      setError("This account does not have admin access.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to login. Please check your credentials.",
      );
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
          <p className="eyebrow">ADMIN ACCESS</p>
          <h1>Sign in to continue.</h1>
          <p>Use the admin credentials to enter the management area.</p>
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
                {isSubmitting ? "Signing in..." : "Login as admin"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
