
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./PaymentDemo.css";
import { saveDemoRentalOrder } from "./demoOrderUtils";

function getCartItem() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("rentEaseCart") || "null"
    );

    if (Array.isArray(saved)) {
      return saved[0] || null;
    }

    return saved;
  } catch {
    return null;
  }
}

function PaymentDemo() {
  const navigate = useNavigate();

  const [paymentType, setPaymentType] = useState("card");

  const cartItem = getCartItem();

  if (!cartItem) {
    return (
      <main className="payment-demo-page">
        <section className="payment-empty">
          <div className="payment-empty-icon">💳</div>

          <p>RENTEASE</p>

          <h1>No Rental Found</h1>

          <span>
            Please select a rental product before opening
            the payment demo.
          </span>

          <Link to="/products">
            Browse Products →
          </Link>
        </section>
      </main>
    );
  }

  const price = Number(cartItem.price) || 0;
  const months = Number(cartItem.months) || 0;
  const deposit = Number(cartItem.deposit) || 0;

  const rentalAmount = price * months;
  const totalAmount = rentalAmount + deposit;

  const formatPrice = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  const handleViewSummary = () => {
    const paymentNames = {
      card: "Card Payment (Demo)",
      upi: "UPI Payment (Demo)",
      netbanking: "Net Banking (Demo)",
    };

    const saved = saveDemoRentalOrder(
      paymentNames[paymentType]
    );

    if (!saved) {
      alert("Unable to save the demo rental record.");
      return;
    }

    localStorage.setItem(
      "rentEaseDemoPaymentMethod",
      paymentNames[paymentType]
    );

    navigate("/order-confirmation");
  };

  return (
    <main className="payment-demo-page">

      {/* HEADER */}
      <header className="payment-demo-header">

        <Link
          to="/checkout"
          className="payment-back"
        >
          ← Back to Checkout
        </Link>

        <p className="payment-brand">
          RENT EASE · PAYMENT DEMO
        </p>

        <span className="demo-badge">
          DEMO MODE
        </span>

        <h1>Online Payment</h1>

        <p className="payment-subtitle">
          Review your rental amount before continuing.
          This screen is for demonstration purposes only.
        </p>

      </header>


      {/* MAIN */}
      <div className="payment-demo-container">

        {/* LEFT */}
        <section className="payment-card">

          <div className="payment-card-heading">

            <div>
              <p>PAYMENT METHOD</p>
              <h2>Select Payment Method</h2>
            </div>

            <div className="payment-card-icon">
              💳
            </div>

          </div>


          {/* DEMO NOTICE */}
          <div className="payment-demo-notice">

            <strong>
              Demo only: no online payment has been processed.
            </strong>

            <p>
              Select Card, UPI or Net Banking to see how
              the payment interface could work.
            </p>

          </div>


          {/* PAYMENT METHOD BUTTONS */}
          <div className="demo-payment-options">

            <button
              type="button"
              className={
                paymentType === "card"
                  ? "demo-payment-option active"
                  : "demo-payment-option"
              }
              onClick={() => setPaymentType("card")}
            >
              <span className="demo-option-icon">
                💳
              </span>

              <div>
                <strong>Card Payment</strong>
                <small>Demo</small>
              </div>
            </button>


            <button
              type="button"
              className={
                paymentType === "upi"
                  ? "demo-payment-option active"
                  : "demo-payment-option"
              }
              onClick={() => setPaymentType("upi")}
            >
              <span className="demo-option-icon">
                📱
              </span>

              <div>
                <strong>UPI Payment</strong>
                <small>Demo</small>
              </div>
            </button>


            <button
              type="button"
              className={
                paymentType === "netbanking"
                  ? "demo-payment-option active"
                  : "demo-payment-option"
              }
              onClick={() => setPaymentType("netbanking")}
            >
              <span className="demo-option-icon">
                🏦
              </span>

              <div>
                <strong>Net Banking</strong>
                <small>Demo</small>
              </div>
            </button>

          </div>


          {/* CARD */}
          {paymentType === "card" && (
            <div className="demo-fields">

              <div className="demo-field">

                <label>
                  Card Number
                </label>

                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  disabled
                />

              </div>


              <div className="demo-field-row">

                <div className="demo-field">

                  <label>
                    Expiry Date
                  </label>

                  <input
                    type="text"
                    placeholder="MM / YY"
                    disabled
                  />

                </div>


                <div className="demo-field">

                  <label>
                    CVV
                  </label>

                  <input
                    type="text"
                    placeholder="XXX"
                    disabled
                  />

                </div>

              </div>

              <p className="disabled-input-note">
                Card fields are disabled because this is a
                demonstration only.
              </p>

            </div>
          )}


          {/* UPI */}
          {paymentType === "upi" && (
            <div className="demo-fields">

              <div className="demo-field">

                <label>
                  UPI ID
                </label>

                <input
                  type="text"
                  placeholder="example@upi"
                  disabled
                />

              </div>

              <div className="demo-upi-box">

                <span>📱</span>

                <div>
                  <strong>
                    UPI Payment Demo
                  </strong>

                  <p>
                    Entering a real UPI ID is not required.
                    This is only a visual demonstration.
                  </p>
                </div>

              </div>

              <p className="disabled-input-note">
                No UPI transaction will be created.
              </p>

            </div>
          )}


          {/* NET BANKING */}
          {paymentType === "netbanking" && (
            <div className="demo-fields">

              <div className="demo-field">

                <label>
                  Select Bank
                </label>

                <select disabled>
                  <option>
                    Select your bank
                  </option>

                  <option>
                    State Bank of India
                  </option>

                  <option>
                    HDFC Bank
                  </option>

                  <option>
                    ICICI Bank
                  </option>

                  <option>
                    Axis Bank
                  </option>
                </select>

              </div>

              <div className="demo-bank-box">

                <span>🏦</span>

                <div>
                  <strong>
                    Net Banking Demo
                  </strong>

                  <p>
                    Bank login and transaction processing
                    are not connected in this project.
                  </p>
                </div>

              </div>

              <p className="disabled-input-note">
                No bank credentials or transaction will
                be requested.
              </p>

            </div>
          )}


          {/* SUMMARY BUTTON */}
          <button
            type="button"
            className="view-summary-button"
            onClick={handleViewSummary}
          >
            View Rental Summary
            <span>→</span>
          </button>


          <Link
            to="/checkout"
            className="return-checkout-link"
          >
            ← Return to Checkout
          </Link>

        </section>


        {/* RIGHT SUMMARY */}
        <aside className="payment-summary">

          <p className="summary-label">
            RENTAL SUMMARY
          </p>

          <h2>Your Rental</h2>


          <div className="payment-product">

            <div className="payment-product-image">

              {cartItem.image ? (
                <img
                  src={cartItem.image}
                  alt={cartItem.name}
                />
              ) : (
                <span>🪑</span>
              )}

            </div>

            <div className="payment-product-info">

              <strong>
                {cartItem.name}
              </strong>

              <small>
                {months}{" "}
                {months === 1
                  ? "Month"
                  : "Months"}{" "}
                Rental
              </small>

            </div>

          </div>


          <div className="payment-row">
            <span>Monthly Rent</span>

            <strong>
              {formatPrice(price)}
            </strong>
          </div>


          <div className="payment-row">
            <span>Rental Amount</span>

            <strong>
              {formatPrice(rentalAmount)}
            </strong>
          </div>


          <div className="payment-row">
            <span>Security Deposit</span>

            <strong>
              {formatPrice(deposit)}
            </strong>
          </div>


          <div className="payment-row">
            <span>Delivery</span>

            <strong className="free">
              Free
            </strong>
          </div>


          <hr />


          <div className="payment-total">

            <span>
              Total Payable
            </span>

            <strong>
              {formatPrice(totalAmount)}
            </strong>

          </div>


          <div className="payment-security">

            <strong>
              🔒 Demo & Secure
            </strong>

            <p>
              No payment information is stored or
              transmitted.
            </p>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default PaymentDemo;
