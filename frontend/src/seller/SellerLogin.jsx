import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SellerLogin.css";

function SellerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (loading) {
      return;
    }

    if (!email.trim() || !password) {
      setError(
        "Please enter email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to login."
        );
      }

      // Check whether this account is actually a seller
      if (
        !data.user ||
        data.user.role !== "seller"
      ) {
        setError(
          "This account is not registered as a seller."
        );

        return;
      }

      // Save JWT token
      localStorage.setItem(
        "rentEaseToken",
        data.token
      );

      // Save seller information
      localStorage.setItem(
        "rentEaseUser",
        JSON.stringify(data.user)
      );

      // Keep this for compatibility with old seller pages
      localStorage.setItem(
        "rentEaseSellerLoggedIn",
        "true"
      );

      navigate("/seller/dashboard");
    } catch (error) {
      console.error(
        "Seller login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-login-page">
      <div className="seller-login-card">

        <div className="seller-login-header">

          <div className="seller-logo">
            RE
          </div>

          <h1>
            Seller Login
          </h1>

          <p>
            Manage your RentEase products
            and rentals
          </p>

        </div>

        <form
          onSubmit={handleLogin}
        >

          <div className="seller-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter seller email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
              required
            />

          </div>

          <div className="seller-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
              required
            />

          </div>

          {error && (
            <div className="seller-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="seller-login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login as Seller"}
          </button>

        </form>

        <div className="seller-demo-info">

          <strong>
            Seller Login
          </strong>

          <p>
            Use a seller account created
            in MongoDB.
          </p>

        </div>

        <Link
          to="/"
          className="seller-back-home"
        >
          ← Back to RentEase
        </Link>

      </div>
    </div>
  );
}

export default SellerLogin;
