import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type LoginUser = { name: string; email: string; userType?: string };
type LoginResponse = {
  success: boolean;
  message: string;
  users?: LoginUser[];
  allowedPassword?: string;
};

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
      const response = await fetch("/mockAPI.json");
      const data: { login?: LoginResponse } = await response.json();
      const users = data.login?.users ?? [];
      const expectedPassword = data.login?.allowedPassword ?? "123456";
      const matchingUser = users.find(
        (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
      );

      if (
        matchingUser &&
        matchingUser.userType?.toLowerCase() === "admin" &&
        password.trim() === expectedPassword
      ) {
        window.localStorage.setItem("stayease-user-email", matchingUser.email);
        window.localStorage.setItem("stayease-user-type", "admin");
        navigate("/admin/home", { replace: true });
        return;
      }

      setError(
        "Invalid admin credentials. Use ankita_admin@gmail.com with password 123456.",
      );
    } catch {
      setError("Unable to load admin credentials.");
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
