
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./Checkout.css";

function OrderSuccess() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        /*
        =====================================================
        FIRST: GET SAVED ORDER
        =====================================================
        */

        let savedOrder = null;

        try {
          const confirmationOrder = JSON.parse(
            localStorage.getItem("rentEaseOrder") || "null"
          );

          if (confirmationOrder) {
            savedOrder = confirmationOrder;
          }
        } catch (error) {
          console.error(
            "Unable to read rentEaseOrder:",
            error
          );
        }

        /*
        =====================================================
        FALLBACK: NORMAL ORDERS
        =====================================================
        */

        if (!savedOrder) {
          try {
            const orders = JSON.parse(
              localStorage.getItem("rentEaseOrders") || "[]"
            );

            if (
              Array.isArray(orders) &&
              orders.length > 0
            ) {
              savedOrder = orders[0];
            }
          } catch (error) {
            console.error(
              "Unable to read rentEaseOrders:",
              error
            );
          }
        }

        /*
        =====================================================
        FALLBACK: SELLER DEMO ORDERS
        =====================================================
        */

        if (!savedOrder) {
          try {
            const demoOrders = JSON.parse(
              localStorage.getItem(
                "rentEaseDemoOrders"
              ) || "[]"
            );

            if (
              Array.isArray(demoOrders) &&
              demoOrders.length > 0
            ) {
              savedOrder = demoOrders[0];
            }
          } catch (error) {
            console.error(
              "Unable to read rentEaseDemoOrders:",
              error
            );
          }
        }

        /*
        =====================================================
        IF NO ORDER
        =====================================================
        */

        if (!savedOrder) {
          setOrder(null);
          setLoading(false);
          return;
        }

        /*
        =====================================================
        GET PRODUCT ID
        =====================================================
        */

        const productId =
          savedOrder.productId ||
          savedOrder.product?._id ||
          savedOrder.product?.productId ||
          "";

        /*
        =====================================================
        GET LATEST PRODUCT FROM MONGODB
        =====================================================
        */

        let latestProduct = null;

        if (productId) {
          try {
            const response = await fetch(
              `http://localhost:5000/api/products/${productId}`
            );

            if (response.ok) {
              const data = await response.json();

              if (data && data.product) {
                latestProduct = data.product;
              }
            }
          } catch (error) {
            console.error(
              "Unable to load latest product:",
              error
            );
          }
        }

        /*
        =====================================================
        IMAGE
        =====================================================

        IMPORTANT:

        1. Use image already saved with the order
        2. Then use image inside saved product
        3. Then use MongoDB image

        This prevents a bad MongoDB image from replacing
        the working image saved during checkout.
        =====================================================
        */

        const savedOrderImage =
          typeof savedOrder?.image === "string"
            ? savedOrder.image.trim()
            : "";

        const savedProductImage =
          typeof savedOrder?.product?.image === "string"
            ? savedOrder.product.image.trim()
            : "";

        const mongoImage =
          typeof latestProduct?.image === "string"
            ? latestProduct.image.trim()
            : "";

        const finalImage =
          savedOrderImage ||
          savedProductImage ||
          mongoImage ||
          "";

        /*
        =====================================================
        CREATE FINAL ORDER DATA
        =====================================================
        */

        const finalOrder = {
          ...savedOrder,

          image: finalImage,

          product: {
            ...(savedOrder.product || {}),

            _id:
              latestProduct?._id ||
              savedOrder.product?._id ||
              savedOrder.productId ||
              "",

            productId:
              latestProduct?._id ||
              savedOrder.product?.productId ||
              savedOrder.productId ||
              "",

            name:
              latestProduct?.name ||
              savedOrder.product?.name ||
              savedOrder.productName ||
              "Rental Product",

            category:
              latestProduct?.category ||
              savedOrder.product?.category ||
              savedOrder.category ||
              "Rental Item",

            image: finalImage,

            price:
              Number(latestProduct?.price) ||
              Number(savedOrder.product?.price) ||
              Number(savedOrder.monthlyRent) ||
              0,

            months:
              Number(savedOrder.product?.months) ||
              Number(savedOrder.months) ||
              3,

            deposit:
              Number(latestProduct?.deposit) ||
              Number(savedOrder.product?.deposit) ||
              Number(savedOrder.deposit) ||
              0,

            tenure:
              latestProduct?.tenure ||
              savedOrder.product?.tenure ||
              savedOrder.tenure ||
              "3 - 12 Months",
          },
        };

        setOrder(finalOrder);
      } catch (error) {
        console.error(
          "Unable to load order:",
          error
        );

        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, []);

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
  LOADING
  =====================================================
  */

  if (loading) {
    return (
      <div className="checkout-page">
        <Navbar />

        <main className="checkout-main">
          <div className="checkout-message">
            <div className="checkout-message-icon">
              ⏳
            </div>

            <h2>
              Loading Order...
            </h2>

            <p>
              Please wait while we load your rental details.
            </p>
          </div>
        </main>
      </div>
    );
  }

  /*
  =====================================================
  NO ORDER
  =====================================================
  */

  if (!order) {
    return (
      <div className="checkout-page">
        <Navbar />

        <main className="checkout-main">
          <div className="checkout-message">
            <div className="checkout-message-icon">
              📦
            </div>

            <h2>
              No Order Found
            </h2>

            <p>
              We could not find a recent rental order.
            </p>

            <Link
              to="/products"
              className="checkout-back-button"
            >
              ← Browse Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  /*
  =====================================================
  ORDER VALUES
  =====================================================
  */

  const productName =
    order.product?.name ||
    order.productName ||
    "Rental Product";

  const category =
    order.product?.category ||
    order.category ||
    "Rental Item";

  const monthlyRent =
    Number(order.product?.price) ||
    Number(order.monthlyRent) ||
    0;

  const months =
    Number(order.product?.months) ||
    Number(order.months) ||
    3;

  const deposit =
    Number(order.product?.deposit) ||
    Number(order.deposit) ||
    0;

  const rentalAmount =
    Number(order.rentalAmount) ||
    monthlyRent * months;

  const total =
    Number(order.total) ||
    rentalAmount + deposit;

  /*
  =====================================================
  PRODUCT IMAGE
  =====================================================
  */

  const productImage =
    order.image ||
    order.product?.image ||
    "";

  /*
  =====================================================
  ORDER REFERENCE
  =====================================================
  */

  const orderReference =
    order.orderId ||
    "RE" +
      Date.now()
        .toString()
        .slice(-6);

  /*
  =====================================================
  ORDER DATE
  =====================================================
  */

  const orderDate =
    order.orderDate ||
    new Date().toLocaleDateString("en-IN");

  /*
  =====================================================
  CHECK IMAGE
  =====================================================
  */

  const hasProductImage =
    typeof productImage === "string" &&
    productImage.trim() !== "";

  /*
  =====================================================
  PAGE
  =====================================================
  */

  return (
    <div className="checkout-page">
      <Navbar />

      <main className="checkout-main">

        {/* SUCCESS HEADER */}

        <div className="order-success-header">

          <div className="order-success-icon">
            ✓
          </div>

          <p className="checkout-label">
            RENT EASE • ORDER SUMMARY
          </p>

          <h1>
            Rental Request Recorded!
          </h1>

          <p>
            Your demo order details are available below.
          </p>

          <span className="order-success-status">
            Demo Order Placed
          </span>

        </div>

        {/* DEMO NOTICE */}

        <div className="checkout-demo-notice order-success-notice">

          <div>
            <strong>
              Demo Project Notice
            </strong>

            <p>
              This is a local demonstration only.
              No real delivery has been booked and
              no online payment has been processed.
            </p>
          </div>

        </div>

        {/* ORDER CARD */}

        <section className="order-success-card">

          {/* ORDER TOP */}

          <div className="order-success-card-header">

            <div>
              <p className="checkout-summary-label">
                ORDER REFERENCE
              </p>

              <h2>
                {orderReference}
              </h2>
            </div>

            <div className="order-success-mini-icon">
              📦
            </div>

          </div>

          <hr />

          {/* RENTAL DETAILS */}

          <div className="order-success-details">

            <h3>
              Rental Details
            </h3>

            {/* PRODUCT */}

            <div className="order-success-product">

              {/* PRODUCT IMAGE */}

              <div className="order-success-product-image">

                {hasProductImage ? (
                  <img
                    src={productImage}
                    alt={productName}
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";

                      const fallback =
                        event.currentTarget
                          .parentElement
                          ?.querySelector(
                            ".order-success-image-fallback"
                          );

                      if (fallback) {
                        fallback.style.display =
                          "flex";
                      }
                    }}
                  />
                ) : null}

                <div
                  className="order-success-image-fallback"
                  style={{
                    display: hasProductImage
                      ? "none"
                      : "flex",
                  }}
                >
                  No Image
                </div>

              </div>

              {/* PRODUCT INFORMATION */}

              <div className="order-success-product-info">

                <strong>
                  {productName}
                </strong>

                <span>
                  {category}
                </span>

                <small>
                  {months}{" "}
                  {months === 1
                    ? "month"
                    : "months"}{" "}
                  rental
                </small>

              </div>

            </div>

            {/* PRICE DETAILS */}

            <div className="checkout-summary-row">
              <span>
                Monthly Rent
              </span>

              <strong>
                {formatPrice(monthlyRent)}
              </strong>
            </div>

            <div className="checkout-summary-row">
              <span>
                Rental Amount
              </span>

              <strong>
                {formatPrice(rentalAmount)}
              </strong>
            </div>

            <div className="checkout-summary-row">
              <span>
                Security Deposit
              </span>

              <strong>
                {formatPrice(deposit)}
              </strong>
            </div>

            <div className="checkout-summary-row">
              <span>
                Delivery
              </span>

              <strong className="checkout-free">
                Free
              </strong>
            </div>

            <hr />

            {/* TOTAL */}

            <div className="checkout-total">

              <span>
                Total Payable
              </span>

              <strong>
                {formatPrice(total)}
              </strong>

            </div>

          </div>

          {/* CUSTOMER INFORMATION */}

          {order.customer && (
            <div className="order-success-customer">

              <h3>
                Customer Details
              </h3>

              <div className="order-success-customer-grid">

                <div>
                  <span>
                    Name
                  </span>

                  <strong>
                    {order.customer.name ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>
                    Phone
                  </span>

                  <strong>
                    {order.customer.phone ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {order.customer.email ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>
                    City
                  </span>

                  <strong>
                    {order.customer.city ||
                      "—"}
                  </strong>
                </div>

              </div>

              <div className="order-success-address">

                <span>
                  Delivery Address
                </span>

                <strong>
                  {order.deliveryAddress ||
                    order.customer.address ||
                    "—"}
                </strong>

              </div>

            </div>
          )}

          {/* PAYMENT */}

          <div className="order-success-payment">

            <div>
              <span>
                Payment Method
              </span>

              <strong>
                {order.paymentMethod ||
                  "Cash on Delivery (Demo)"}
              </strong>
            </div>

            <div>
              <span>
                Order Date
              </span>

              <strong>
                {orderDate}
              </strong>
            </div>

          </div>

          {/* DEMO MESSAGE */}

          <div className="order-success-demo">

            <strong>
              Demo Mode
            </strong>

            <p>
              This order has been recorded locally
              for demonstration purposes. No real
              payment or delivery has been processed.
            </p>

          </div>

          {/* BUTTONS */}

          <div className="order-success-actions">

            <Link
              to="/products"
              className="checkout-back-button"
            >
              Continue Browsing
            </Link>

            <Link
              to="/rental-history"
              className="place-order-button"
            >
              View Rental History →
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}

export default OrderSuccess;
