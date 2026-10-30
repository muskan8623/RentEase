import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerOrders.css";

const API_URL = "http://localhost:5000/api/orders";

const statusOptions = [
  "Pending",
  "Confirmed",
  "Out for Delivery",
  "Active Rental",
  "Completed",
];

function SellerOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  /*
  =====================================================
  LOAD ORDERS FROM MONGODB
  =====================================================
  */

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch orders."
        );
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (error) {
      console.error(
        "Load orders error:",
        error
      );

      setError(
        "Unable to connect to the backend. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /*
  =====================================================
  UPDATE ORDER STATUS
  =====================================================
  */

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch(
        `${API_URL}/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update order status."
        );
      }

      /*
      -----------------------------------------------
      UPDATE UI WITHOUT REFRESHING
      -----------------------------------------------
      */

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  /*
  =====================================================
  DELETE ORDER
  =====================================================
  */

  const handleDeleteOrder = async (
    orderId
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${orderId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete order."
        );
      }

      setOrders((previousOrders) =>
        previousOrders.filter(
          (order) =>
            order._id !== orderId
        )
      );
    } catch (error) {
      console.error(
        "Delete order error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete order."
      );
    }
  };

  /*
  =====================================================
  FORMAT PRICE
  =====================================================
  */

  const formatPrice = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  /*
  =====================================================
  FORMAT DATE
  =====================================================
  */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  /*
  =====================================================
  STATUS CLASS
  =====================================================
  */

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "status-confirmed";

      case "Out for Delivery":
        return "status-delivery";

      case "Active Rental":
        return "status-active";

      case "Completed":
        return "status-completed";

      default:
        return "status-pending";
    }
  };

  /*
  =====================================================
  STATISTICS
  =====================================================
  */

  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;

    const activeRentals = orders.filter(
      (order) =>
        order.status === "Active Rental"
    ).length;

    const totalValue = orders.reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    );

    return {
      totalOrders,
      pendingOrders,
      activeRentals,
      totalValue,
    };
  }, [orders]);

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loading) {
    return (
      <div className="seller-orders-page">
        <div className="seller-orders-container">
          <div className="seller-orders-loading">
            <div className="seller-orders-spinner">
              ⏳
            </div>

            <h2>
              Loading Rental Orders...
            </h2>

            <p>
              Fetching orders from MongoDB.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
  =====================================================
  MAIN PAGE
  =====================================================
  */

  return (
    <div className="seller-orders-page">

      <div className="seller-orders-container">

        {/* HEADER */}

        <header className="seller-orders-header">

          <div>
            <button
              type="button"
              className="seller-orders-back"
              onClick={() =>
                navigate("/seller/dashboard")
              }
            >
              ← Dashboard
            </button>

            <p className="seller-orders-eyebrow">
              RENT EASE SELLER PANEL
            </p>

            <h1>
              Rental Orders
            </h1>

            <p>
              Manage customer rental orders,
              delivery status and active rentals.
            </p>
          </div>

          <button
            type="button"
            className="seller-orders-refresh"
            onClick={loadOrders}
          >
            ↻ Refresh Orders
          </button>

        </header>

        {/* ERROR */}

        {error && (
          <div className="seller-orders-error">
            <span>⚠️</span>

            <div>
              <strong>
                Connection Error
              </strong>

              <p>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* STATISTICS */}

        <section className="seller-orders-stats">

          <div className="seller-orders-stat-card">

            <div className="seller-orders-stat-icon">
              📦
            </div>

            <div>
              <span>
                Total Orders
              </span>

              <strong>
                {stats.totalOrders}
              </strong>
            </div>

          </div>

          <div className="seller-orders-stat-card">

            <div className="seller-orders-stat-icon">
              ⏳
            </div>

            <div>
              <span>
                Pending
              </span>

              <strong>
                {stats.pendingOrders}
              </strong>
            </div>

          </div>

          <div className="seller-orders-stat-card">

            <div className="seller-orders-stat-icon">
              🏠
            </div>

            <div>
              <span>
                Active Rentals
              </span>

              <strong>
                {stats.activeRentals}
              </strong>
            </div>

          </div>

          <div className="seller-orders-stat-card">

            <div className="seller-orders-stat-icon">
              ₹
            </div>

            <div>
              <span>
                Total Value
              </span>

              <strong>
                {formatPrice(
                  stats.totalValue
                )}
              </strong>
            </div>

          </div>

        </section>

        {/* EMPTY STATE */}

        {orders.length === 0 ? (
          <div className="seller-orders-empty">

            <div className="seller-orders-empty-icon">
              📦
            </div>

            <h2>
              No Rental Orders Yet
            </h2>

            <p>
              Customer orders will appear here
              after they complete checkout.
            </p>

            <button
              type="button"
              onClick={loadOrders}
              className="seller-orders-refresh"
            >
              Refresh
            </button>

          </div>
        ) : (
          /* ORDER LIST */
          <section className="seller-orders-list">

            <div className="seller-orders-list-heading">
              <div>
                <p>
                  ORDER MANAGEMENT
                </p>

                <h2>
                  Customer Orders
                </h2>
              </div>

              <span>
                {orders.length}{" "}
                {orders.length === 1
                  ? "Order"
                  : "Orders"}
              </span>
            </div>

            {orders.map((order) => (

              <article
                key={order._id}
                className="seller-order-card"
              >

                {/* TOP */}

                <div className="seller-order-top">

                  <div className="seller-order-product">

                    <div className="seller-order-image">

                      {order.image ? (
                        <img
                          src={order.image}
                          alt={
                            order.productName
                          }
                          onError={(
                            event
                          ) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <span>
                          {order.category ===
                          "Furniture"
                            ? "🛋️"
                            : "📺"}
                        </span>
                      )}

                    </div>

                    <div>

                      <span className="seller-order-category">
                        {order.category ||
                          "Rental Item"}
                      </span>

                      <h3>
                        {order.productName}
                      </h3>

                      <p>
                        Order ID:{" "}
                        <strong>
                          {order.orderId}
                        </strong>
                      </p>

                    </div>

                  </div>

                  <div className="seller-order-status-wrapper">

                    <span className="seller-order-status-label">
                      CURRENT STATUS
                    </span>

                    <span
                      className={`seller-order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status ||
                        "Pending"}
                    </span>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="seller-order-details">

                  <div className="seller-order-detail">

                    <span>
                      Monthly Rent
                    </span>

                    <strong>
                      {formatPrice(
                        order.monthlyRent
                      )}
                    </strong>

                  </div>

                  <div className="seller-order-detail">

                    <span>
                      Rental Period
                    </span>

                    <strong>
                      {order.months || 1}{" "}
                      {Number(
                        order.months
                      ) === 1
                        ? "Month"
                        : "Months"}
                    </strong>

                  </div>

                  <div className="seller-order-detail">

                    <span>
                      Deposit
                    </span>

                    <strong>
                      {formatPrice(
                        order.deposit
                      )}
                    </strong>

                  </div>

                  <div className="seller-order-detail">

                    <span>
                      Total
                    </span>

                    <strong className="seller-order-total">
                      {formatPrice(
                        order.total
                      )}
                    </strong>

                  </div>

                </div>

                {/* CUSTOMER */}

                <div className="seller-order-customer">

                  <div className="seller-order-section-title">
                    👤 Customer Details
                  </div>

                  <div className="seller-order-customer-grid">

                    <div>
                      <span>
                        Name
                      </span>

                      <strong>
                        {order.customerName ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Phone
                      </span>

                      <strong>
                        {order.customerPhone ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Email
                      </span>

                      <strong>
                        {order.customerEmail ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        City
                      </span>

                      <strong>
                        {order.city ||
                          "—"}
                      </strong>
                    </div>

                    <div className="seller-order-address">

                      <span>
                        Delivery Address
                      </span>

                      <strong>
                        {order.deliveryAddress ||
                          "—"}
                      </strong>

                    </div>

                    <div>
                      <span>
                        Pincode
                      </span>

                      <strong>
                        {order.pincode ||
                          "—"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* MANAGEMENT */}

                <div className="seller-order-management">

                  <div>

                    <span className="seller-order-section-title">
                      ⚙️ Update Order Status
                    </span>

                    <div className="seller-order-status-buttons">

                      {statusOptions.map(
                        (status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={
                              updatingId ===
                              order._id
                            }
                            className={
                              order.status ===
                              status
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              handleStatusChange(
                                order._id,
                                status
                              )
                            }
                          >
                            {status}
                          </button>
                        )
                      )}

                    </div>

                  </div>

                  <div className="seller-order-meta">

                    <span>
                      Payment
                    </span>

                    <strong>
                      {order.paymentMethod ||
                        "Cash on Delivery"}
                    </strong>

                    <span>
                      Ordered
                    </span>

                    <strong>
                      {formatDate(
                        order.createdAt
                      )}
                    </strong>

                  </div>

                </div>

                {/* DELETE */}

                <div className="seller-order-footer">

                  <span>
                    Tenure:{" "}
                    {order.tenure ||
                      "3 - 12 Months"}
                  </span>

                  <button
                    type="button"
                    className="seller-order-delete"
                    onClick={() =>
                      handleDeleteOrder(
                        order._id
                      )
                    }
                  >
                    Delete Order
                  </button>

                </div>

              </article>

            ))}

          </section>
        )}

      </div>
    </div>
  );
}

export default SellerOrders;