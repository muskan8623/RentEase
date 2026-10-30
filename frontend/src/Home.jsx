
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">

          <p className="hero-label">
            SMART • SIMPLE • AFFORDABLE
          </p>

          <h1>
            Welcome to <span>RentEase</span>
          </h1>

          <p className="hero-description">
            Rent furniture and appliances easily.
            Get what you need without the high cost
            of buying and moving.
          </p>

          <div className="hero-buttons">
            <Link
              to="/products"
              className="hero-primary-button"
            >
              Explore Products
            </Link>

            <Link
              to="/rental-history"
              className="hero-secondary-button"
            >
              Rental History
            </Link>
          </div>

        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-icon">
              🛋️
            </div>

            <h3>Comfort Without Commitment</h3>

            <p>
              Flexible rental plans for your
              everyday needs.
            </p>
          </div>

          <div className="hero-floating-card">
            <strong>₹999/month</strong>
            <span>Starting rental</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-section">
        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>What are you looking for?</h2>
          <span>
            Choose from furniture and appliances
            designed for modern living.
          </span>
        </div>

        <div className="category-grid">

          <Link
            to="/products"
            className="category-card"
          >
            <div className="category-icon">
              🛋️
            </div>

            <h3>Furniture</h3>

            <p>
              Sofas, beds, study tables and more.
            </p>

            <span>View Furniture →</span>
          </Link>

          <Link
            to="/products"
            className="category-card"
          >
            <div className="category-icon">
              🧊
            </div>

            <h3>Appliances</h3>

            <p>
              Refrigerators, washing machines,
              TVs and more.
            </p>

            <span>View Appliances →</span>
          </Link>

        </div>
      </section>

      {/* Why RentEase */}
      <section className="why-section">

        <div className="section-heading">
          <p>WHY RENTEASE</p>

          <h2>
            Renting made simple
          </h2>

          <span>
            Everything you need for a convenient
            rental experience.
          </span>
        </div>

        <div className="benefits-grid">

          <div className="benefit-card">
            <div>💰</div>

            <h3>Affordable</h3>

            <p>
              Avoid large upfront costs and
              rent what you actually need.
            </p>
          </div>

          <div className="benefit-card">
            <div>📅</div>

            <h3>Flexible Plans</h3>

            <p>
              Choose a rental duration that
              works for your lifestyle.
            </p>
          </div>

          <div className="benefit-card">
            <div>🚚</div>

            <h3>Easy Delivery</h3>

            <p>
              Schedule convenient delivery and
              pickup for your rental.
            </p>
          </div>

          <div className="benefit-card">
            <div>♻️</div>

            <h3>Rent Responsibly</h3>

            <p>
              Make better use of products instead
              of buying items you may not need long-term.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">

        <div>
          <p>READY TO RENT?</p>

          <h2>
            Get what you need.
            <br />
            Pay only for what you use.
          </h2>
        </div>

        <Link
          to="/products"
          className="cta-button"
        >
          Start Renting →
        </Link>

      </section>

     

       

    </div>
  );
}

export default Home;
