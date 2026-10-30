import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cartItem, setCartItem] = useState(null);
  const [months, setMonths] = useState(3);

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("rentEaseCart") || "null"
      );

      if (savedCart && !Array.isArray(savedCart)) {
        setCartItem(savedCart);
        setMonths(Number(savedCart.months) || 3);
        setDeliveryDate(savedCart.deliveryDate || "");
        setDeliveryAddress(savedCart.deliveryAddress || "");
      }
    } catch {
      setCartItem(null);
    }
  }, []);

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const updateCart = (updatedItem) => {
    setCartItem(updatedItem);

    localStorage.setItem(
      "rentEaseCart",
      JSON.stringify(updatedItem)
    );
  };

  const handleMonthsChange = (value) => {
    const newMonths = Number(value);

    setMonths(newMonths);

    if (cartItem) {
      updateCart({
        ...cartItem,
        months: newMonths,
      });
    }
  };

  const handleDeliveryDateChange = (value) => {
    setDeliveryDate(value);

    if (cartItem) {
      updateCart({
        ...cartItem,
        deliveryDate: value,
      });
    }
  };

  const handleAddressChange = (value) => {
    setDeliveryAddress(value);

    if (cartItem) {
      updateCart({
        ...cartItem,
        deliveryAddress: value,
      });
    }
  };

  const handleRemove = () => {
    localStorage.removeItem("rentEaseCart");
    setCartItem(null);
  };

  const handleCheckout = () => {
    if (!cartItem) {
      return;
    }

    if (!deliveryDate) {
      alert("Please select a delivery date.");
      return;
    }

    if (!deliveryAddress.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    const updatedItem = {
      ...cartItem,
      months,
      deliveryDate,
      deliveryAddress,
    };

    localStorage.setItem(
      "rentEaseCart",
      JSON.stringify(updatedItem)
    );

    navigate("/checkout");
  };

  /*
    EMPTY CART
  */
  if (!cartItem) {
    return (
      <div className="cart-page">
        <Navbar />

        <main className="cart-main">
          <div className="cart-empty">

            <div className="cart-empty-icon">
              🛒
            </div>

            <p className="cart-label">
              RENT EASE CART
            </p>

            <h1>Your Cart Is Empty</h1>

            <p>
              You haven't selected any rental product yet.
              Explore our collection and choose something
              that fits your needs.
            </p>

            <Link
              to="/products"
              className="cart-primary-button"
            >
              Browse Products →
            </Link>

          </div>
        </main>
      </div>
    );
  }

  const price = Number(cartItem.price) || 0;
  const deposit = Number(cartItem.deposit) || 0;
  const rentalMonths = Number(months) || 0;

  const rentalAmount = price * rentalMonths;
  const totalAmount = rentalAmount + deposit;

  return (
    <div className="cart-page">

      <Navbar />

      <main className="cart-main">

        {/* Header */}
        <div className="cart-header">

          <div>
            <p className="cart-label">
              RENT EASE CART
            </p>

            <h1>Your Rental Cart</h1>

            <p>
              Review your rental before continuing
              to checkout.
            </p>
          </div>

          <Link
            to="/products"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>

        </div>

        <div className="cart-layout">

          {/* LEFT SIDE */}
          <section className="cart-left">

            {/* Product Card */}
            <article className="cart-product-card">

              {/* Real Product Image */}
              <div className="cart-product-image">

                {cartItem.image ? (
                  <img
                    src={cartItem.image}
                    alt={cartItem.name}
                  />
                ) : (
                  <span>🪑</span>
                )}

              </div>

              {/* Product Information */}
              <div className="cart-product-content">

                <p className="cart-product-category">
                  {cartItem.category || "Rental Item"}
                </p>

                <h2>
                  {cartItem.name}
                </h2>

                <div className="cart-monthly-price">
                  <strong>
                    {formatPrice(price)}
                  </strong>

                  <span>
                    / month
                  </span>
                </div>

                <div className="cart-product-details">

                  <div>
                    <span>Security Deposit</span>
                    <strong>
                      {formatPrice(deposit)}
                    </strong>
                  </div>

                  <div>
                    <span>Availability</span>
                    <strong className="available-text">
                      Available
                    </strong>
                  </div>

                </div>

                <button
                  type="button"
                  className="remove-cart-button"
                  onClick={handleRemove}
                >
                  Remove Rental
                </button>

              </div>

            </article>

            {/* Rental Duration */}
            <section className="cart-card">

              <div className="cart-card-heading">

                <div>
                  <p>RENTAL PLAN</p>
                  <h2>Select Rental Duration</h2>
                </div>

                <span>
                  Flexible plans
                </span>

              </div>

              <div className="cart-tenure-options">

                {[3, 6, 9, 12].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={
                      months === option
                        ? "cart-tenure active"
                        : "cart-tenure"
                    }
                    onClick={() =>
                      handleMonthsChange(option)
                    }
                  >
                    <strong>
                      {option}
                    </strong>

                    <span>
                      {option === 1
                        ? "Month"
                        : "Months"}
                    </span>
                  </button>
                ))}

              </div>

            </section>

            {/* Delivery Details */}
            <section className="cart-card">

              <div className="cart-card-heading">

                <div>
                  <p>DELIVERY</p>
                  <h2>Delivery Details</h2>
                </div>

              </div>

              <div className="cart-form">

                <div className="cart-form-group">

                  <label htmlFor="deliveryDate">
                    Preferred Delivery Date
                  </label>

                  <input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      handleDeliveryDateChange(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="cart-form-group">

                  <label htmlFor="deliveryAddress">
                    Delivery Address
                  </label>

                  <textarea
                    id="deliveryAddress"
                    rows="4"
                    placeholder="Enter your complete delivery address"
                    value={deliveryAddress}
                    onChange={(e) =>
                      handleAddressChange(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

            </section>

          </section>

          {/* RIGHT SIDE */}
          <aside className="cart-summary">

            <p className="summary-label">
              RENTAL SUMMARY
            </p>

            <h2>Order Summary</h2>

            {/* Small Product Preview */}
            <div className="summary-product">

              <div className="summary-product-image">

                {cartItem.image ? (
                  <img
                    src={cartItem.image}
                    alt={cartItem.name}
                  />
                ) : (
                  <span>🪑</span>
                )}

              </div>

              <div>
                <strong>
                  {cartItem.name}
                </strong>

                <span>
                  {rentalMonths}{" "}
                  {rentalMonths === 1
                    ? "Month"
                    : "Months"}{" "}
                  Rental
                </span>
              </div>

            </div>

            {/* Summary Rows */}
            <div className="summary-row">
              <span>Monthly Rent</span>

              <strong>
                {formatPrice(price)}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Rental Amount
              </span>

              <strong>
                {formatPrice(rentalAmount)}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Security Deposit
              </span>

              <strong>
                {formatPrice(deposit)}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Delivery
              </span>

              <strong className="free-delivery">
                Free
              </strong>
            </div>

            <hr />

            <div className="summary-total">

              <span>
                Total Payable
              </span>

              <strong>
                {formatPrice(totalAmount)}
              </strong>

            </div>

            <p className="summary-note">
              Security deposit is included in the
              total and may be refundable according
              to rental terms.
            </p>

            <button
              type="button"
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <span>→</span>
            </button>

            <Link
              to="/products"
              className="summary-continue"
            >
              Continue Shopping
            </Link>

            <div className="cart-security-note">
              🔒 Secure rental experience
              <br />
              <small>
                Demo project — no real payment
                is processed.
              </small>
            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Cart;