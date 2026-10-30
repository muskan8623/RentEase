import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RentalHistory.css";

function RentalHistory() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  =====================================================
  LOAD CUSTOMER ORDERS
  =====================================================
  */

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "rentEaseToken"
        );

      if (!token) {
        setError(
          "Please login to view your rental history."
        );

        setLoading(false);

        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "Customer Rental History:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load rental history."
        );
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (error) {
      console.error(
        "Rental history error:",
        error
      );

      setError(
        error.message ||
          "Unable to load rental history."
      );
    } finally {
      setLoading(false);
    }
  };


  /*
  =====================================================
  LOAD + AUTO REFRESH
  =====================================================
  */

  useEffect(() => {
    loadOrders();

    const refreshTimer =
      setInterval(
        loadOrders,
        10000
      );

    return () => {
      clearInterval(
        refreshTimer
      );
    };
  }, []);


  /*
  =====================================================
  FORMAT PRICE
  =====================================================
  */

  const formatPrice = (amount) =>
    `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;


  /*
  =====================================================
  FORMAT DATE
  =====================================================
  */

  const formatDate = (date) => {
    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  /*
  =====================================================
  IMAGE VALIDATION
  =====================================================
  */

  const isValidImage = (image) => {
    if (
      typeof image !== "string"
    ) {
      return false;
    }

    const cleanImage =
      image.trim();

    if (!cleanImage) {
      return false;
    }

    return (
      cleanImage.startsWith(
        "data:image/"
      ) ||
      cleanImage.startsWith("/") ||
      cleanImage.startsWith(
        "http://"
      ) ||
      cleanImage.startsWith(
        "https://"
      )
    );
  };


  /*
  =====================================================
  LOGIN REQUIRED
  =====================================================
  */

  if (
    error ===
    "Please login to view your rental history."
  ) {
    return (
      <main className="rental-history-page">

        <header className="history-header">

          <div>

            <p className="history-brand">
              RENTEASE
            </p>

            <h1>
              Rental History
            </h1>

            <p>
              View and track your rental orders.
            </p>

          </div>

          <Link
            to="/products"
            className="history-browse-btn"
          >
            Browse Products
          </Link>

        </header>


        <section className="history-content">

          <div className="history-empty">

            <div className="history-empty-icon">
              🔐
            </div>

            <h3>
              Login Required
            </h3>

            <p>
              Please login to view your rental history.
            </p>

            <button
              className="history-browse-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>

          </div>

        </section>

      </main>
    );
  }


  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loading) {
    return (
      <main className="rental-history-page">

        <header className="history-header">

          <div>

            <p className="history-brand">
              RENTEASE
            </p>

            <h1>
              Rental History
            </h1>

            <p>
              Loading your rental orders...
            </p>

          </div>

        </header>

        <section className="history-content">

          <div className="history-empty">

            <div className="history-empty-icon">
              ⏳
            </div>

            <h3>
              Loading...
            </h3>

            <p>
              Please wait while we load your rental history.
            </p>

          </div>

        </section>

      </main>
    );
  }


  /*
  =====================================================
  ERROR
  =====================================================
  */

  if (error) {
    return (
      <main className="rental-history-page">

        <header className="history-header">

          <div>

            <p className="history-brand">
              RENTEASE
            </p>

            <h1>
              Rental History
            </h1>

            <p>
              View and track your rental orders.
            </p>

          </div>

          <Link
            to="/products"
            className="history-browse-btn"
          >
            Browse Products
          </Link>

        </header>

        <section className="history-content">

          <div className="history-empty">

            <div className="history-empty-icon">
              ⚠️
            </div>

            <h3>
              Unable to Load Rental History
            </h3>

            <p>
              {error}
            </p>

            <button
              className="history-browse-btn"
              onClick={loadOrders}
            >
              Try Again
            </button>

          </div>

        </section>

      </main>
    );
  }


  /*
  =====================================================
  MAIN PAGE
  =====================================================
  */

  return (
    <main className="rental-history-page">

      {/* HEADER */}

      <header className="history-header">

        <div>

          <p className="history-brand">
            RENTEASE
          </p>

          <h1>
            Rental History
          </h1>

          <p>
            View and track your rental orders.
          </p>

        </div>

        <Link
          to="/products"
          className="history-browse-btn"
        >
          Browse Products
        </Link>

      </header>


      {/* DATABASE NOTICE */}

      <div className="history-demo-notice">

        <strong>
          Your Rental Orders
        </strong>

        <p>
          Your orders are securely loaded from
          your RentEase account.
        </p>

      </div>


      {/* CONTENT */}

      <section className="history-content">

        <div className="history-section-heading">

          <div>

            <h2>
              Your Rental Records
            </h2>

            <p>
              {orders.length} rental
              {orders.length === 1
                ? ""
                : "s"} found
            </p>

          </div>

          <button
            className="history-browse-btn"
            onClick={loadOrders}
          >
            Refresh
          </button>

        </div>


        {/* EMPTY */}

        {orders.length === 0 ? (

          <div className="history-empty">

            <div className="history-empty-icon">
              📦
            </div>

            <h3>
              No Rental Records Yet
            </h3>

            <p>
              Your completed rental orders will appear here.
            </p>

            <Link
              to="/products"
              className="history-browse-btn"
            >
              Explore Products
            </Link>

          </div>

        ) : (

          /* ORDER LIST */

          <div className="history-list">

            {orders.map((order) => {

              const productImage =
                typeof order.image ===
                "string"
                  ? order.image.trim()
                  : "";

              const hasImage =
                isValidImage(
                  productImage
                );

              return (
                <article
                  className="history-card"
                  key={
                    order._id ||
                    order.orderId
                  }
                >

                  {/* ORDER HEADER */}

                  <div className="history-card-top">

                    <div>

                      <span className="history-order-label">
                        ORDER REFERENCE
                      </span>

                      <strong className="history-order-id">
                        {order.orderId ||
                          "Order"}
                      </strong>

                    </div>

                    <span className="history-status">
                      {order.status ||
                        "Pending"}
                    </span>

                  </div>


                  {/* PRODUCT */}

                  <div className="history-product">

                    <div className="history-product-image">

                      {hasImage && (

                        <img
                          src={productImage}
                          alt={
                            order.productName ||
                            "Rental product"
                          }
                          onError={(
                            event
                          ) => {

                            event.currentTarget.style.display =
                              "none";

                            const fallback =
                              event
                                .currentTarget
                                .parentElement
                                ?.querySelector(
                                  ".history-image-fallback"
                                );

                            if (
                              fallback
                            ) {
                              fallback.style.display =
                                "flex";
                            }

                          }}
                        />

                      )}

                      <span
                        className="history-image-fallback"
                        style={{
                          display:
                            hasImage
                              ? "none"
                              : "flex",
                        }}
                      >
                        🏠
                      </span>

                    </div>


                    <div className="history-product-info">

                      <h3>
                        {order.productName ||
                          "Rental Product"}
                      </h3>

                      <p>
                        {order.category ||
                          "Rental Item"}
                      </p>

                      <p>
                        {Number(
                          order.months || 0
                        )}{" "}

                        {Number(
                          order.months
                        ) === 1
                          ? "Month"
                          : "Months"}{" "}

                        Rental
                      </p>

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
                          "Not specified"}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Order Date
                      </span>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>

                    </div>

                  </div>


                  {/* DELIVERY */}

                  {(order.deliveryDate ||
                    order.deliveryAddress) && (

                    <div className="history-details">

                      {order.deliveryDate && (

                        <div>

                          <span>
                            Delivery Date
                          </span>

                          <strong>
                            {order.deliveryDate}
                          </strong>

                        </div>

                      )}

                      {order.deliveryAddress && (

                        <div>

                          <span>
                            Delivery Address
                          </span>

                          <strong>
                            {order.deliveryAddress}
                          </strong>

                        </div>

                      )}

                    </div>

                  )}


                  {/* TOTAL */}

                  <div className="history-total">

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      {formatPrice(
                        order.total
                      )}
                    </strong>

                  </div>


                  {/* STATUS MESSAGE */}

                  <p className="history-record-note">

                    {order.status ===
                    "Completed"
                      ? "Rental completed successfully."
                      : order.status ===
                        "Active Rental"
                      ? "Your rental is currently active."
                      : order.status ===
                        "Out for Delivery"
                      ? "Your rental is out for delivery."
                      : order.status ===
                        "Confirmed"
                      ? "Your rental order has been confirmed."
                      : "Your rental order is currently pending."}

                  </p>

                </article>
              );
            })}

          </div>

        )}

      </section>


      {/* FOOTER */}

      <footer className="history-footer">
        RentEase — Furniture & Appliance Rental Platform
      </footer>

    </main>
  );
}

export default RentalHistory;