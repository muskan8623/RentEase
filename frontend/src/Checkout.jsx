import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import { saveDemoRentalOrder } from "./demoOrderUtils";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cartItem, setCartItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  /*
  =====================================================
  LOAD CART + LATEST PRODUCT
  =====================================================
  */

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const savedCart = JSON.parse(
          localStorage.getItem("rentEaseCart") || "null"
        );

        if (
          !savedCart ||
          Array.isArray(savedCart) ||
          !savedCart.name
        ) {
          setCartItem(null);
          setLoading(false);
          return;
        }

        const productId =
          savedCart.productId ||
          savedCart._id ||
          savedCart.id ||
          "";

        let finalCart = {
          ...savedCart,
        };

        /*
        -------------------------------------------------
        GET LATEST PRODUCT FROM MONGODB
        -------------------------------------------------
        */

        if (productId) {
          try {
            const response = await fetch(
              `http://localhost:5000/api/products/${productId}`
            );

            if (response.ok) {
              const data = await response.json();

              if (data && data.product) {
                const product = data.product;

                const mongoImage =
                  typeof product.image === "string"
                    ? product.image.trim()
                    : "";

                const cartImage =
                  typeof savedCart.image === "string"
                    ? savedCart.image.trim()
                    : "";

                const finalImage =
                  mongoImage || cartImage || "";

                finalCart = {
                  ...savedCart,

                  productId:
                    product._id || productId,

                  name:
                    product.name ||
                    savedCart.name,

                  category:
                    product.category ||
                    savedCart.category ||
                    "Rental Item",

                  price:
                    Number(product.price) ||
                    Number(savedCart.price) ||
                    0,

                  deposit:
                    Number(product.deposit) ||
                    Number(savedCart.deposit) ||
                    0,

                  tenure:
                    product.tenure ||
                    savedCart.tenure ||
                    "3 - 12 Months",

                  available:
                    product.available !== false,

                  image: finalImage,
                };
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
        -------------------------------------------------
        KEEP CART IMAGE IF FETCH FAILED
        -------------------------------------------------
        */

        if (
          !finalCart.image &&
          savedCart.image
        ) {
          finalCart.image = savedCart.image;
        }

        /*
        -------------------------------------------------
        SAVE UPDATED CART
        -------------------------------------------------
        */

        localStorage.setItem(
          "rentEaseCart",
          JSON.stringify(finalCart)
        );

        setCartItem(finalCart);
      } catch (error) {
        console.error(
          "Unable to load checkout:",
          error
        );

        setCartItem(null);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, []);

  /*
  =====================================================
  INPUT HANDLER
  =====================================================
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
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
  IMAGE ERROR
  =====================================================
  */

  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";

    const fallback =
      event.currentTarget.parentElement?.querySelector(
        ".checkout-image-fallback"
      );

    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  /*
  =====================================================
  PLACE ORDER
  =====================================================
  */

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (placingOrder) {
      return;
    }

    /*
    ---------------------------------------------------
    CHECK LOGIN
    ---------------------------------------------------
    */

    const token =
      localStorage.getItem("rentEaseToken");

    if (!token) {
      alert(
        "Please login before placing a rental order."
      );

      navigate("/login");
      return;
    }

    /*
    ---------------------------------------------------
    CHECK CART
    ---------------------------------------------------
    */

    if (!cartItem) {
      alert("Your cart is empty.");
      navigate("/products");
      return;
    }

    /*
    ---------------------------------------------------
    CUSTOMER VALIDATION
    ---------------------------------------------------
    */

    if (!customer.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!customer.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!customer.email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!customer.address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (!customer.city.trim()) {
      alert("Please enter your city.");
      return;
    }

    if (!customer.pincode.trim()) {
      alert("Please enter your pincode.");
      return;
    }

    /*
    ---------------------------------------------------
    PHONE VALIDATION
    ---------------------------------------------------
    */

    const phoneDigits =
      customer.phone.replace(/\D/g, "");

    if (phoneDigits.length !== 10) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    /*
    ---------------------------------------------------
    PINCODE VALIDATION
    ---------------------------------------------------
    */

    const pincodeDigits =
      customer.pincode.replace(/\D/g, "");

    if (pincodeDigits.length !== 6) {
      alert(
        "Please enter a valid 6-digit pincode."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      /*
      =================================================
      GET PRODUCT ID
      =================================================
      */

      const productId =
        cartItem.productId ||
        cartItem._id ||
        cartItem.id ||
        "";

      /*
      =================================================
      GET LATEST PRODUCT
      =================================================
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
            "Unable to fetch product:",
            error
          );
        }
      }

      /*
      =================================================
      IMAGE
      =================================================
      */

      const mongoImage =
        typeof latestProduct?.image === "string"
          ? latestProduct.image.trim()
          : "";

      const cartImage =
        typeof cartItem.image === "string"
          ? cartItem.image.trim()
          : "";

      const productImage =
        mongoImage || cartImage || "";

      /*
      =================================================
      PRODUCT VALUES
      =================================================
      */

      const productName =
        latestProduct?.name ||
        cartItem.name;

      const category =
        latestProduct?.category ||
        cartItem.category ||
        "Rental Item";

      const price =
        Number(latestProduct?.price) ||
        Number(cartItem.price) ||
        0;

      const months =
        Number(cartItem.months) || 3;

      const deposit =
        Number(latestProduct?.deposit) ||
        Number(cartItem.deposit) ||
        0;

      const tenure =
        latestProduct?.tenure ||
        cartItem.tenure ||
        "3 - 12 Months";

      /*
      =================================================
      CALCULATIONS
      =================================================
      */

      const rentalAmount =
        price * months;

      const total =
        rentalAmount + deposit;

      /*
      =================================================
      UPDATED CART
      =================================================
      */

      const updatedCart = {
        ...cartItem,

        productId:
          latestProduct?._id ||
          productId,

        name: productName,

        category: category,

        price: price,

        deposit: deposit,

        tenure: tenure,

        image: productImage,

        months: months,

        customer: customer,

        paymentMethod: paymentMethod,
      };

      localStorage.setItem(
        "rentEaseCart",
        JSON.stringify(updatedCart)
      );

      /*
      =================================================
      PRODUCT SNAPSHOT
      =================================================
      */

      const productSnapshot = {
        _id:
          latestProduct?._id ||
          productId,

        productId:
          latestProduct?._id ||
          productId,

        name: productName,

        category: category,

        image: productImage,

        price: price,

        months: months,

        deposit: deposit,

        tenure: tenure,
      };

      /*
      =================================================
      CREATE FRONTEND ORDER
      =================================================
      */

      const order = {
        orderId:
          "RE" +
          Date.now().toString().slice(-6),

        customer: {
          ...customer,
        },

        product: productSnapshot,

        paymentMethod: paymentMethod,

        total: total,

        rentalAmount: rentalAmount,

        deposit: deposit,

        status: "Demo Order Placed",

        orderDate:
          new Date().toLocaleDateString(
            "en-IN"
          ),

        deliveryDate:
          cartItem.deliveryDate || "",

        deliveryAddress:
          cartItem.deliveryAddress ||
          customer.address,

        image: productImage,

        productName: productName,

        category: category,

        monthlyRent: price,

        months: months,
      };

      /*
      =================================================
      MONGODB ORDER DATA
      =================================================
      */

      const mongoOrderData = {
        productId:
          latestProduct?._id ||
          productId ||
          "",

        productName:
          productName,

        category:
          category,

        image:
          productImage,

        monthlyRent:
          price,

        months:
          months,

        deposit:
          deposit,

        rentalAmount:
          rentalAmount,

        total:
          total,

        paymentMethod:
          paymentMethod ===
          "Online Payment"
            ? "Online Payment (Demo)"
            : "Cash on Delivery (Demo)",

        deliveryDate:
          cartItem.deliveryDate || "",

        deliveryAddress:
          cartItem.deliveryAddress ||
          customer.address,

        tenure:
          tenure,

        customerName:
          customer.name.trim(),

        customerPhone:
          customer.phone.trim(),

        customerEmail:
          customer.email.trim(),

        city:
          customer.city.trim(),

        pincode:
          customer.pincode.trim(),
      };

      /*
      =================================================
      SAVE ORDER TO MONGODB
      =================================================
      */

      let mongoOrderCreated = false;
      let mongoOrder = null;
      let mongoSaveFailed = false;

      try {
        console.log(
          "===================================="
        );

        console.log(
          "SENDING ORDER TO MONGODB"
        );

        console.log(
          mongoOrderData
        );

        console.log(
          "===================================="
        );

        /*
        -------------------------------------------------
        IMPORTANT:
        GET JWT TOKEN
        -------------------------------------------------
        */

        const currentToken =
          localStorage.getItem(
            "rentEaseToken"
          );

        if (!currentToken) {
          alert(
            "Your login session is missing. Please login again."
          );

          navigate("/login");
          return;
        }

        /*
        -------------------------------------------------
        SEND ORDER WITH JWT
        -------------------------------------------------
        */

        const mongoResponse =
          await fetch(
            "http://localhost:5000/api/orders",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${currentToken}`,
              },

              body: JSON.stringify(
                mongoOrderData
              ),
            }
          );

        const responseText =
          await mongoResponse.text();

        let mongoData = {};

        try {
          mongoData =
            JSON.parse(responseText);
        } catch {
          mongoData = {};
        }

        console.log(
          "MongoDB response status:",
          mongoResponse.status
        );

        console.log(
          "MongoDB response:",
          mongoData
        );

        /*
        -------------------------------------------------
        HANDLE LOGIN EXPIRATION
        -------------------------------------------------
        */

        if (
          mongoResponse.status === 401
        ) {
          localStorage.removeItem(
            "rentEaseToken"
          );

          localStorage.removeItem(
            "rentEaseUser"
          );

          alert(
            "Your login session has expired. Please login again."
          );

          navigate("/login");
          return;
        }

        /*
        -------------------------------------------------
        HANDLE OTHER ERRORS
        -------------------------------------------------
        */

        if (!mongoResponse.ok) {
          throw new Error(
            mongoData.message ||
              `Server returned ${mongoResponse.status}`
          );
        }

        if (
          !mongoData.success ||
          !mongoData.order
        ) {
          throw new Error(
            "Server did not return a valid order."
          );
        }

        mongoOrderCreated = true;

        mongoOrder =
          mongoData.order;

        console.log(
          "===================================="
        );

        console.log(
          "ORDER SAVED TO MONGODB SUCCESSFULLY"
        );

        console.log(
          mongoOrder
        );

        console.log(
          "===================================="
        );

        /*
        SAVE LATEST MONGODB ORDER
        */

        localStorage.setItem(
          "rentEaseLatestMongoOrder",
          JSON.stringify(
            mongoOrder
          )
        );
      } catch (error) {
        mongoSaveFailed = true;

        console.error(
          "===================================="
        );

        console.error(
          "MONGODB ORDER CREATION FAILED"
        );

        console.error(
          error
        );

        console.error(
          "===================================="
        );

        /*
        IMPORTANT:
        Demo order will still be saved.
        */

        alert(
          "MongoDB could not save the order. RentEase will continue in Demo Mode."
        );
      }

      /*
      =================================================
      SAVE NORMAL LOCAL ORDER
      =================================================
      */

      let existingOrders = [];

      try {
        const savedOrders =
          JSON.parse(
            localStorage.getItem(
              "rentEaseOrders"
            ) || "[]"
          );

        if (
          Array.isArray(
            savedOrders
          )
        ) {
          existingOrders =
            savedOrders;
        }
      } catch {
        existingOrders = [];
      }

      /*
      ADD MONGODB ID
      */

      if (mongoOrder) {
        order.mongoId =
          mongoOrder._id;

        order.mongoOrderId =
          mongoOrder.orderId;
      }

      /*
      ORDER SOURCE
      */

      order.orderSource =
        mongoSaveFailed
          ? "Demo / Local"
          : "MongoDB";

      /*
      SAVE LOCAL ORDER
      */

      existingOrders.unshift(
        order
      );

      localStorage.setItem(
        "rentEaseOrders",
        JSON.stringify(
          existingOrders
        )
      );

      /*
      =================================================
      SAVE SELLER DEMO ORDER
      =================================================
      */

      const demoPaymentMethod =
        paymentMethod ===
        "Online Payment"
          ? "Online Payment (Demo)"
          : "Cash on Delivery (Demo)";

      try {
        console.log(
          "Saving seller demo order..."
        );

        const demoOrderSaved =
          await saveDemoRentalOrder(
            demoPaymentMethod
          );

        if (
          demoOrderSaved
        ) {
          console.log(
            "===================================="
          );

          console.log(
            "SELLER DEMO ORDER SAVED"
          );

          console.log(
            "===================================="
          );
        } else {
          console.warn(
            "Seller demo order could not be saved."
          );
        }
      } catch (error) {
        console.error(
          "Seller demo order error:",
          error
        );
      }

      /*
      =================================================
      SAVE ORDER CONFIRMATION
      =================================================
      */

      localStorage.setItem(
        "rentEaseOrder",
        JSON.stringify(order)
      );

      /*
      =================================================
      REMOVE CART
      =================================================
      */

      localStorage.removeItem(
        "rentEaseCart"
      );

      /*
      =================================================
      SUCCESS PAGE
      =================================================
      */

      navigate(
        "/order-success"
      );
    } catch (error) {
      console.error(
        "Order placement failed:",
        error
      );

      alert(
        "Something went wrong while placing your demo order."
      );
    } finally {
      setPlacingOrder(false);
    }
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
              Loading Checkout...
            </h2>

            <p>
              Please wait.
            </p>
          </div>
        </main>
      </div>
    );
  }

  /*
  =====================================================
  EMPTY CART
  =====================================================
  */

  if (!cartItem) {
    return (
      <div className="checkout-page">
        <Navbar />

        <main className="checkout-main">
          <div className="checkout-message">
            <div className="checkout-message-icon">
              🛒
            </div>

            <h2>
              Your Cart Is Empty
            </h2>

            <p>
              Please select a rental product
              before continuing to checkout.
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
  DISPLAY VALUES
  =====================================================
  */

  const displayPrice =
    Number(cartItem.price) || 0;

  const displayMonths =
    Number(cartItem.months) || 3;

  const displayDeposit =
    Number(cartItem.deposit) || 0;

  const displayRentalAmount =
    displayPrice *
    displayMonths;

  const displayTotal =
    displayRentalAmount +
    displayDeposit;

  /*
  =====================================================
  CHECK IMAGE
  =====================================================
  */

  const hasImage =
    typeof cartItem.image ===
      "string" &&
    cartItem.image.trim() !== "";

  /*
  =====================================================
  CHECKOUT UI
  =====================================================
  */

  return (
    <div className="checkout-page">
      <Navbar />

      <main className="checkout-main">

        {/* HEADER */}

        <div className="checkout-header">
          <div>
            <p className="checkout-label">
              RENT EASE
            </p>

            <h1>
              Complete Your Rental
            </h1>

            <p>
              Enter your details to complete
              the demo rental.
            </p>
          </div>

          <Link
            to="/cart"
            className="checkout-back-link"
          >
            ← Back to Cart
          </Link>
        </div>

        {/* MAIN FORM */}

        <form
          className="checkout-layout"
          onSubmit={
            handlePlaceOrder
          }
        >

          {/* LEFT */}

          <section className="checkout-left">

            {/* CUSTOMER DETAILS */}

            <div className="checkout-card">
              <div className="checkout-card-heading">
                <div>
                  <p>
                    CUSTOMER DETAILS
                  </p>

                  <h2>
                    Your Information
                  </h2>
                </div>
              </div>

              <div className="checkout-form-grid">

                <div className="checkout-form-group">
                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={
                      customer.name
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={
                      customer.phone
                    }
                    onChange={
                      handleChange
                    }
                    maxLength="10"
                    inputMode="numeric"
                    required
                  />
                </div>

                <div className="checkout-form-group checkout-full-width">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={
                      customer.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

              </div>
            </div>

            {/* DELIVERY */}

            <div className="checkout-card">
              <div className="checkout-card-heading">
                <div>
                  <p>
                    DELIVERY
                  </p>

                  <h2>
                    Delivery Address
                  </h2>
                </div>
              </div>

              <div className="checkout-form-grid">

                <div className="checkout-form-group checkout-full-width">
                  <label htmlFor="address">
                    Complete Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows="4"
                    placeholder="House / Flat No., Street, Area"
                    value={
                      customer.address
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter city"
                    value={
                      customer.city
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="pincode">
                    Pincode
                  </label>

                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    placeholder="6-digit pincode"
                    value={
                      customer.pincode
                    }
                    onChange={
                      handleChange
                    }
                    maxLength="6"
                    inputMode="numeric"
                    required
                  />
                </div>

              </div>
            </div>

            {/* PAYMENT */}

            <div className="checkout-card">
              <div className="checkout-card-heading">
                <div>
                  <p>
                    PAYMENT
                  </p>

                  <h2>
                    Payment Method
                  </h2>
                </div>
              </div>

              <div className="payment-options">

                <label
                  className={
                    paymentMethod ===
                    "Cash on Delivery"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={
                      paymentMethod ===
                      "Cash on Delivery"
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentMethod(
                        event.target
                          .value
                      )
                    }
                  />

                  <span className="payment-icon">
                    💵
                  </span>

                  <span className="payment-content">
                    <strong>
                      Cash on Delivery
                    </strong>

                    <small>
                      Demo rental payment
                    </small>
                  </span>
                </label>

                <label
                  className={
                    paymentMethod ===
                    "Online Payment"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked={
                      paymentMethod ===
                      "Online Payment"
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentMethod(
                        event.target
                          .value
                      )
                    }
                  />

                  <span className="payment-icon">
                    💳
                  </span>

                  <span className="payment-content">
                    <strong>
                      Online Payment
                    </strong>

                    <small>
                      Payment gateway demo
                    </small>
                  </span>
                </label>

              </div>

              <div className="checkout-demo-notice">
                <span>
                  🔒
                </span>

                <div>
                  <strong>
                    Demo Mode
                  </strong>

                  <p>
                    No real payment will
                    be processed.
                  </p>
                </div>
              </div>
            </div>

          </section>

          {/* RIGHT SUMMARY */}

          <aside className="checkout-summary">

            <p className="checkout-summary-label">
              RENTAL SUMMARY
            </p>

            <h2>
              Your Rental
            </h2>

            {/* PRODUCT */}

            <div className="checkout-product">

              <div className="checkout-product-image">

                {hasImage ? (
                  <>
                    <img
                      src={
                        cartItem.image
                      }
                      alt={
                        cartItem.name
                      }
                      onError={
                        handleImageError
                      }
                    />

                    <span
                      className="checkout-image-fallback"
                      style={{
                        display:
                          "none",
                        width:
                          "100%",
                        height:
                          "100%",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontSize:
                          "28px",
                      }}
                    >
                      {cartItem.category ===
                      "Furniture"
                        ? "🛋️"
                        : "📺"}
                    </span>
                  </>
                ) : (
                  <span className="checkout-image-fallback">
                    {cartItem.category ===
                    "Furniture"
                      ? "🛋️"
                      : "📺"}
                  </span>
                )}

              </div>

              <div className="checkout-product-info">

                <span className="checkout-product-category">
                  {cartItem.category ||
                    "Rental Item"}
                </span>

                <strong>
                  {cartItem.name}
                </strong>

                <span>
                  {displayMonths}{" "}
                  {displayMonths === 1
                    ? "Month"
                    : "Months"}{" "}
                  Rental
                </span>

              </div>

            </div>

            {/* PRICE */}

            <div className="checkout-summary-row">
              <span>
                Monthly Rent
              </span>

              <strong>
                {formatPrice(
                  displayPrice
                )}
              </strong>
            </div>

            <div className="checkout-summary-row">
              <span>
                Rental Amount
              </span>

              <strong>
                {formatPrice(
                  displayRentalAmount
                )}
              </strong>
            </div>

            <div className="checkout-summary-row">
              <span>
                Security Deposit
              </span>

              <strong>
                {formatPrice(
                  displayDeposit
                )}
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

            <div className="checkout-total">
              <span>
                Total Payable
              </span>

              <strong>
                {formatPrice(
                  displayTotal
                )}
              </strong>
            </div>

            {/* DELIVERY DATE */}

            {cartItem.deliveryDate && (
              <div className="checkout-delivery-info">
                <strong>
                  📅 Delivery Date
                </strong>

                <span>
                  {
                    cartItem.deliveryDate
                  }
                </span>
              </div>
            )}

            {/* DELIVERY ADDRESS */}

            {cartItem.deliveryAddress && (
              <div className="checkout-delivery-info">
                <strong>
                  📍 Delivery Address
                </strong>

                <span>
                  {
                    cartItem.deliveryAddress
                  }
                </span>
              </div>
            )}

            {/* PLACE ORDER */}

            <button
              type="submit"
              className="place-order-button"
              disabled={
                placingOrder
              }
            >
              {placingOrder
                ? "Processing..."
                : "Place Demo Rental Order"}

              {!placingOrder && (
                <span>
                  →
                </span>
              )}
            </button>

            <Link
              to="/cart"
              className="checkout-summary-back"
            >
              ← Back to Cart
            </Link>

            <div className="checkout-security">
              🔒 Secure Rental Experience

              <small>
                Demo project — no real
                payment is processed.
              </small>
            </div>

          </aside>

        </form>
      </main>
    </div>
  );
}

export default Checkout;
