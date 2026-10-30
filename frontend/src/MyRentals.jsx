
import { Link } from "react-router-dom";
import "./RentalHistory.css";

function RentalHistory() {
  let orders = [];

  try {
    const saved = JSON.parse(
      localStorage.getItem("rentEaseDemoOrders") || "[]"
    );

    orders = Array.isArray(saved) ? saved : [];
  } catch {
    orders = [];
  }

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalRentals = orders.length;

  const totalRentalValue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  return (
    <main className="rental-history-page">

      {/* HEADER */}
      <header className="history-header">

        <div>

          <p className="history-brand">
            RENT EASE
          </p>

          <h1>
            Rental History
          </h1>

          <p className="history-subtitle">
            Track your previous RentEase rental demonstrations.
          </p>

        </div>

        <div className="history-header-actions">

          <Link
            to="/products"
            className="history-browse-btn"
          >
            Browse Products
          </Link>

          <Link
            to="/"
            className="history-home-btn"
          >
            Home
          </Link>

        </div>

      </header>


      {/* DEMO NOTICE */}
      <section className="history-demo-notice">

        <div className="history-notice-icon">
          ℹ
        </div>

        <div>

          <strong>
            Demonstration Mode
          </strong>

          <p>
            These rental records are stored locally in your
            browser. They are not real orders and no payment
            has been processed.
          </p>

        </div>

      </section>


      {/* STATISTICS */}
      <section className="history-stats">

        <div className="history-stat-card">

          <div className="history-stat-icon">
            📦
          </div>

          <div>
            <span>
              Total Rentals
            </span>

            <strong>
              {totalRentals}
            </strong>
          </div>

        </div>


        <div className="history-stat-card">

          <div className="history-stat-icon">
            ₹
          </div>

          <div>
            <span>
              Rental Value
            </span>

            <strong>
              {formatPrice(totalRentalValue)}
            </strong>
          </div>

        </div>


        <div className="history-stat-card">

          <div className="history-stat-icon">
            ✓
          </div>

          <div>
            <span>
              Status
            </span>

            <strong>
              Demo Only
            </strong>
          </div>

        </div>

      </section>


      {/* CONTENT */}
      <section className="history-content">

        <div className="history-section-heading">

          <div>

            <p>
              RENTAL RECORDS
            </p>

            <h2>
              Your Rental Activity
            </h2>

          </div>

          <span>
            {totalRentals}{" "}
            {totalRentals === 1
              ? "record"
              : "records"}
          </span>

        </div>


        {orders.length === 0 ? (

          /* EMPTY STATE */

          <div className="history-empty">

            <div className="history-empty-icon">
              📦
            </div>

            <h3>
              No Rental Records Yet
            </h3>

            <p>
              Complete a demo checkout to see your
              rental activity displayed here.
            </p>

            <Link
              to="/products"
              className="history-empty-btn"
            >
              Explore Products →
            </Link>

          </div>

        ) : (

          /* RENTAL LIST */

          <div className="history-list">

            {orders.map((order) => (

              <article
                className="history-card"
                key={order.orderId}
              >

                {/* CARD TOP */}
                <div className="history-card-top">

                  <div>

                    <span className="history-order-label">
                      DEMO REFERENCE
                    </span>

                    <strong className="history-order-id">
                      {order.orderId}
                    </strong>

                  </div>

                  <span className="history-status">
                    Demo Only
                  </span>

                </div>


                {/* PRODUCT */}
                <div className="history-product">

                  <div className="history-product-image">

                    {order.image &&
                    (order.image.startsWith("/") ||
                      order.image.startsWith("http")) ? (

                      <img
                        src={order.image}
                        alt={
                          order.productName ||
                          "Rental product"
                        }
                      />

                    ) : (

                      <span>
                        {order.image || "🏠"}
                      </span>

                    )}

                  </div>


                  <div className="history-product-info">

                    <p>
                      {order.category ||
                        "Rental Item"}
                    </p>

                    <h3>
                      {order.productName ||
                        "Rental Product"}
                    </h3>

                    <span>
                      {Number(order.months || 0)}{" "}
                      {Number(order.months) === 1
                        ? "Month"
                        : "Months"}{" "}
                      Rental
                    </span>

                  </div>

                </div>


                {/* DETAILS */}
                <div className="history-details">

                  <div>
                    <span>
                      Monthly Rent
                    </span>

                    <strong>
                      {formatPrice(
                        order.monthlyRent
                      )}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Rental Amount
                    </span>

                    <strong>
                      {formatPrice(
                        order.rentalAmount
                      )}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Security Deposit
                    </span>

                    <strong>
                      {formatPrice(
                        order.deposit
                      )}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Payment Method
                    </span>

                    <strong>
                      {order.paymentMethod ||
                        "Demo Payment"}
                    </strong>
                  </div>


                  <div>
                    <span>
                      Saved On
                    </span>

                    <strong>
                      {formatDate(
                        order.createdAt
                      )}
                    </strong>
                  </div>

                </div>


                {/* TOTAL */}
                <div className="history-total">

                  <span>
                    Total Payable
                  </span>

                  <strong>
                    {formatPrice(order.total)}
                  </strong>

                </div>


                {/* FOOTER */}
                <div className="history-card-footer">

                  <p>
                    ✓{" "}
                    {order.status ||
                      "Demo Only — Not Submitted"}
                  </p>

                  <Link
                    to="/products"
                    className="history-rent-again"
                  >
                    Browse Products →
                  </Link>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>


      {/* FOOTER */}
      <footer className="history-footer">

        <span>
          RentEase — Furniture & Appliance Rental Platform
        </span>

        <Link to="/">
          Back to Home
        </Link>

      </footer>

    </main>
  );
}

export default RentalHistory;
