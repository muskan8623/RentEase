import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

/* =========================================
   GET SAVED ORDER
========================================= */

function getSavedOrder() {
  try {
    /* ---------------------------------------
       1. New RentEase demo order system
    --------------------------------------- */

    const demoOrders = JSON.parse(
      localStorage.getItem("rentEaseDemoOrders") || "[]"
    );

    if (
      Array.isArray(demoOrders) &&
      demoOrders.length > 0
    ) {
      return demoOrders[0];
    }

    /* ---------------------------------------
       2. Old single-order system
    --------------------------------------- */

    const currentOrder = JSON.parse(
      localStorage.getItem("rentEaseOrder") || "null"
    );

    if (currentOrder) {
      return currentOrder;
    }

    /* ---------------------------------------
       3. Old multiple-order system
    --------------------------------------- */

    const orders = JSON.parse(
      localStorage.getItem("rentEaseOrders") || "[]"
    );

    if (
      Array.isArray(orders) &&
      orders.length > 0
    ) {
      return orders[0];
    }

    return null;
  } catch (error) {
    console.error(
      "Unable to read saved order:",
      error
    );

    return null;
  }
}

/* =========================================
   IMAGE NORMALIZER
========================================= */

function getImageSource(image) {
  if (
    !image ||
    typeof image !== "string"
  ) {
    return "";
  }

  const value = image.trim();

  if (!value) {
    return "";
  }

  /* ---------------------------------------
     Complete Base64 image
  --------------------------------------- */

  if (
    value.startsWith("data:image/")
  ) {
    return value;
  }

  /* ---------------------------------------
     Normal URL
  --------------------------------------- */

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }

  /* ---------------------------------------
     PNG Base64
  --------------------------------------- */

  if (
    value.startsWith("iVBOR")
  ) {
    return (
      "data:image/png;base64," +
      value
    );
  }

  /* ---------------------------------------
     JPG Base64
  --------------------------------------- */

  if (
    value.startsWith("/9j/")
  ) {
    return (
      "data:image/jpeg;base64," +
      value
    );
  }

  /* ---------------------------------------
     WEBP Base64
  --------------------------------------- */

  if (
    value.startsWith("UklGR")
  ) {
    return (
      "data:image/webp;base64," +
      value
    );
  }

  /* ---------------------------------------
     Generic Base64 fallback
  --------------------------------------- */

  return (
    "data:image/jpeg;base64," +
    value
  );
}

/* =========================================
   COMPONENT
========================================= */

function OrderConfirmation() {
  const navigate = useNavigate();

  const [order, setOrder] =
    useState(null);

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     LOAD ORDER
  ========================================= */

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const savedOrder =
          getSavedOrder();

        /* -------------------------------------
           No order found
        ------------------------------------- */

        if (!savedOrder) {
          setLoading(false);
          return;
        }

        setOrder(savedOrder);

        /* -------------------------------------
           SUPPORT BOTH ORDER FORMATS
        ------------------------------------- */

        const savedProduct =
          savedOrder.product || {};

        /* -------------------------------------
           Get Product ID
        ------------------------------------- */

        const productId =
          savedOrder.productId ||
          savedProduct.productId ||
          savedProduct._id ||
          savedProduct.id ||
          "";

        /* -------------------------------------
           Image from saved order
        ------------------------------------- */

        const savedImage =
          savedOrder.image ||
          savedProduct.image ||
          "";

        /* =====================================
           GET LATEST PRODUCT FROM MONGODB
        ===================================== */

        if (productId) {
          try {
            const response =
              await fetch(
                `http://localhost:5000/api/products/${productId}`
              );

            if (response.ok) {
              const data =
                await response.json();

              if (data.product) {
                const latestProduct =
                  data.product;

                /* -----------------------------
                   IMPORTANT:
                   Prefer MongoDB image.
                   If unavailable, use saved
                   order image.
                ----------------------------- */

                const finalImage =
                  latestProduct.image ||
                  savedImage ||
                  "";

                setProduct({
                  ...latestProduct,

                  name:
                    latestProduct.name ||
                    savedOrder.productName ||
                    savedProduct.name ||
                    "Rental Product",

                  category:
                    latestProduct.category ||
                    savedOrder.category ||
                    savedProduct.category ||
                    "Rental Product",

                  price:
                    savedProduct.price ??
                    savedOrder.monthlyRent ??
                    latestProduct.price ??
                    0,

                  months:
                    savedProduct.months ??
                    savedOrder.months ??
                    0,

                  deposit:
                    savedProduct.deposit ??
                    savedOrder.deposit ??
                    latestProduct.deposit ??
                    0,

                  image:
                    finalImage,
                });

                setLoading(false);
                return;
              }
            }
          } catch (error) {
            console.error(
              "MongoDB product fetch failed:",
              error
            );
          }
        }

        /* =====================================
           FALLBACK TO SAVED ORDER
        ===================================== */

        setProduct({
          ...savedProduct,

          name:
            savedProduct.name ||
            savedOrder.productName ||
            "Rental Product",

          category:
            savedProduct.category ||
            savedOrder.category ||
            "Rental Product",

          price:
            savedProduct.price ??
            savedOrder.monthlyRent ??
            0,

          months:
            savedProduct.months ??
            savedOrder.months ??
            0,

          deposit:
            savedProduct.deposit ??
            savedOrder.deposit ??
            0,

          image:
            savedProduct.image ||
            savedOrder.image ||
            "",
        });

        setLoading(false);
      } catch (error) {
        console.error(
          "Unable to load order:",
          error
        );

        setLoading(false);
      }
    };

    loadOrder();
  }, []);

  /* =========================================
     NO ORDER
  ========================================= */

  if (!order && !loading) {
    return (
      <div className="order-confirmation-page">
        <div className="order-confirmation-empty">
          <div className="order-empty-icon">
            📦
          </div>

          <h1>
            No Order Found
          </h1>

          <p>
            We could not find your recent
            RentEase order.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  /* =========================================
     LOADING
  ========================================= */

  if (
    loading ||
    !order ||
    !product
  ) {
    return (
      <div className="order-confirmation-page">
        <div className="order-confirmation-empty">
          <div className="order-empty-icon">
            ⏳
          </div>

          <h1>
            Loading Order
          </h1>

          <p>
            Loading product information...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================
     PRODUCT DATA
  ========================================= */

  const productName =
    product.name ||
    order.productName ||
    "Rental Product";

  const category =
    product.category ||
    order.category ||
    "Rental Product";

  const monthlyRent =
    Number(
      product.price ??
      order.monthlyRent
    ) || 0;

  const months =
    Number(
      product.months ??
      order.months
    ) || 0;

  const deposit =
    Number(
      product.deposit ??
      order.deposit
    ) || 0;

  const rentalAmount =
    monthlyRent * months;

  const total =
    Number(order.total) ||
    rentalAmount + deposit;

  /* =========================================
     FINAL IMAGE
  ========================================= */

  const productImage =
    getImageSource(
      product.image ||
      order.image ||
      ""
    );

  const orderId =
    order.orderId ||
    "RE000000";

  const paymentMethod =
    order.paymentMethod ||
    "Cash on Delivery";

  /* =========================================
     CUSTOMER DATA
  ========================================= */

  const customer =
    order.customer || {};

  /* =========================================
     ORDER DATE
  ========================================= */

  const orderDate =
    order.orderDate ||
    (
      order.createdAt
        ? new Date(
            order.createdAt
          ).toLocaleDateString(
            "en-IN"
          )
        : "Not available"
    );

  /* =========================================
     DELIVERY INFORMATION
  ========================================= */

  const deliveryAddress =
    customer.address ||
    order.deliveryAddress ||
    "";

  const deliveryCity =
    customer.city || "";

  const deliveryPincode =
    customer.pincode || "";

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="order-confirmation-page">

      <main className="order-confirmation-container">

        {/* =====================================
            ORDER REFERENCE
        ===================================== */}

        <section className="order-reference">

          <div>
            <span className="order-reference-label">
              ORDER REFERENCE
            </span>

            <h1>
              {orderId}
            </h1>
          </div>

          <div className="order-reference-icon">
            📦
          </div>

        </section>

        {/* =====================================
            RENTAL DETAILS
        ===================================== */}

        <section className="confirmation-section">

          <h2>
            Rental Details
          </h2>

          {/* PRODUCT CARD */}

          <div className="confirmation-product-card">

            <div className="confirmation-product-image">

              {productImage ? (
                <img
                  src={productImage}
                  alt={productName}
                  className="confirmation-real-image"

                  onError={(e) => {
                    console.error(
                      "Product image failed to load"
                    );

                    console.error(
                      "Image:",
                      productImage.slice(
                        0,
                        100
                      )
                    );

                    e.currentTarget.style.display =
                      "none";

                    const fallback =
                      e.currentTarget
                        .parentElement
                        .querySelector(
                          ".confirmation-image-placeholder"
                        );

                    if (fallback) {
                      fallback.style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}

              <div
                className="confirmation-image-placeholder"
                style={{
                  display:
                    productImage
                      ? "none"
                      : "flex",
                }}
              >
                {category ===
                "Furniture"
                  ? "🛋️"
                  : "📺"}
              </div>

            </div>

            <div className="confirmation-product-info">

              <h3>
                {productName}
              </h3>

              <span>
                {category}
              </span>

              <p>
                {months}{" "}
                {months === 1
                  ? "month"
                  : "months"}{" "}
                rental
              </p>

            </div>

          </div>

          {/* ===================================
              PRICE DETAILS
          =================================== */}

          <div className="confirmation-price-details">

            <div className="confirmation-price-row">

              <span>
                Monthly Rent
              </span>

              <strong>
                ₹
                {monthlyRent.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="confirmation-price-row">

              <span>
                Rental Amount
              </span>

              <strong>
                ₹
                {rentalAmount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="confirmation-price-row">

              <span>
                Security Deposit
              </span>

              <strong>
                ₹
                {deposit.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="confirmation-total-row">

              <span>
                Total Payable
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

        </section>

        {/* =====================================
            CUSTOMER INFORMATION
        ===================================== */}

        <section className="confirmation-section customer-section">

          <h2>
            Customer Information
          </h2>

          <div className="customer-information">

            <div className="customer-row">

              <span>
                Full Name
              </span>

              <strong>
                {customer.name ||
                  order.customerName ||
                  "Not available"}
              </strong>

            </div>

            <div className="customer-row">

              <span>
                Email Address
              </span>

              <strong>
                {customer.email ||
                  order.email ||
                  "Not available"}
              </strong>

            </div>

            <div className="customer-row">

              <span>
                Phone Number
              </span>

              <strong>
                {customer.phone ||
                  order.phone ||
                  "Not available"}
              </strong>

            </div>

            <div className="customer-row">

              <span>
                Delivery Address
              </span>

              <strong className="address-value">

                {deliveryAddress ||
                  "Not available"}

                {deliveryCity
                  ? `, ${deliveryCity}`
                  : ""}

                {deliveryPincode
                  ? `, ${deliveryPincode}`
                  : ""}

              </strong>

            </div>

            <div className="customer-row">

              <span>
                Payment Method
              </span>

              <strong>
                {paymentMethod}
              </strong>

            </div>

            <div className="customer-row">

              <span>
                Order Date
              </span>

              <strong>
                {orderDate}
              </strong>

            </div>

          </div>

        </section>

        {/* =====================================
            DEMO NOTICE
        ===================================== */}

        <div className="order-demo-notice">

          <span>
            ✓
          </span>

          <div>

            <strong>
              Demo Order
            </strong>

            <p>
              This is a demonstration rental
              order. No real payment has
              been processed.
            </p>

          </div>

        </div>

        {/* =====================================
            ACTIONS
        ===================================== */}

        <div className="order-confirmation-actions">

          <button
            className="order-home-button"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back to Home
          </button>

          <button
            className="order-products-button"
            onClick={() =>
              navigate("/products")
            }
          >
            Browse More Products
          </button>

        </div>

      </main>

    </div>
  );
}

export default OrderConfirmation;