import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [months, setMonths] = useState(3);

  /* =====================================================
     GET RENTAL PERIODS FROM PRODUCT TENURE
  ===================================================== */

  const getRentalPeriods = (tenure) => {
    if (!tenure) {
      return [3, 6, 9, 12];
    }

    const numbers = tenure.match(/\d+/g);

    if (!numbers || numbers.length === 0) {
      return [3, 6, 9, 12];
    }

    if (numbers.length === 1) {
      return [Number(numbers[0])];
    }

    const start = Number(numbers[0]);
    const end = Number(numbers[1]);

    const periods = [];

    for (
      let month = start;
      month <= end;
      month += 3
    ) {
      periods.push(month);
    }

    return periods;
  };

  /* =====================================================
     LOAD PRODUCT FROM MONGODB
  ===================================================== */

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        console.log("Product Details:", data);

        if (!data.product) {
          throw new Error("Product not found");
        }

        setProduct(data.product);

        /* -----------------------------------------------
           SET DEFAULT RENTAL PERIOD
        ------------------------------------------------ */

        const tenure = data.product.tenure || "";

        const availablePeriods =
          getRentalPeriods(tenure);

        if (availablePeriods.length > 0) {
          setMonths(availablePeriods[0]);
        }

      } catch (error) {
        console.error(
          "Product details error:",
          error
        );

        setError(
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  /* =====================================================
     RENT PRODUCT
  ===================================================== */

  const handleRentNow = () => {
    if (!product) {
      return;
    }

    if (!product.available) {
      alert(
        "This product is currently unavailable."
      );

      return;
    }

    /* -----------------------------------------------
       SAVE PRODUCT TO CART
    ------------------------------------------------ */

    const rental = {
      productId: product._id,

      name: product.name,

      category:
        product.category || "Rental Product",

      price: Number(product.price) || 0,

      deposit: Number(product.deposit) || 0,

      tenure:
        product.tenure || "3 - 12 Months",

      available:
        product.available !== false,

      image:
        product.image || "",

      months: Number(months) || 3,
    };

    localStorage.setItem(
      "rentEaseCart",
      JSON.stringify(rental)
    );

    navigate("/cart");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="product-details-page">

        <div className="product-details-message">

          <div className="product-details-message-icon">
            ⏳
          </div>

          <h2>
            Loading product...
          </h2>

          <p>
            Please wait while we load the product details.
          </p>

        </div>

      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !product) {
    return (
      <div className="product-details-page">

        <div className="product-details-message">

          <div className="product-details-message-icon">
            ⚠️
          </div>

          <h2>
            Product Not Found
          </h2>

          <p>
            {error ||
              "This product could not be found."}
          </p>

          <button
            className="product-details-back-button"
            onClick={() =>
              navigate("/products")
            }
          >
            ← Back to Products
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const monthlyRent =
    Number(product.price) || 0;

  const deposit =
    Number(product.deposit) || 0;

  const rentalAmount =
    monthlyRent * Number(months);

  const total =
    rentalAmount + deposit;

  /* =====================================================
     RENTAL PERIODS
  ===================================================== */

  const rentalPeriods =
    getRentalPeriods(product.tenure);

  /* =====================================================
     PRODUCT DETAILS
  ===================================================== */

  return (
    <div className="product-details-page">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="product-details-top">

        <button
          className="product-details-back-button"
          onClick={() =>
            navigate("/products")
          }
        >
          ← Back to Products
        </button>

        <button
          className="product-details-cart-button"
          onClick={() =>
            navigate("/cart")
          }
        >
          🛒 Cart
        </button>

      </div>

      {/* =================================================
          PRODUCT
      ================================================= */}

      <main className="product-details-container">

        {/* IMAGE */}

        <section className="product-details-image-section">

          <div className="product-details-image">

            {product.image &&
            typeof product.image === "string" &&
            product.image.trim() !== "" ? (

              <img
                src={product.image}
                alt={product.name}
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />

            ) : (

              <div className="product-details-placeholder">
                {product.category === "Furniture"
                  ? "🛋️"
                  : "📺"}
              </div>

            )}

          </div>

        </section>

        {/* INFORMATION */}

        <section className="product-details-info">

          <span className="product-details-category">
            {product.category}
          </span>

          <h1>
            {product.name}
          </h1>

          <div className="product-details-price">
            ₹
            {monthlyRent.toLocaleString(
              "en-IN"
            )}

            <span>
              {" / month"}
            </span>
          </div>

          {/* AVAILABILITY */}

          <div
            className={
              product.available
                ? "product-details-available"
                : "product-details-unavailable"
            }
          >
            {product.available
              ? "● Available for Rent"
              : "● Currently Unavailable"}
          </div>

          {/* RENTAL INFORMATION */}

          <div className="product-details-info-box">

            <div>
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

            <div>
              <span>
                Rental Tenure
              </span>

              <strong>
                {product.tenure}
              </strong>
            </div>

          </div>

          {/* RENTAL PERIOD */}

          {product.available && (

            <div className="product-details-rental">

              <label>
                Select Rental Period
              </label>

              <select
                value={months}
                onChange={(event) =>
                  setMonths(
                    Number(event.target.value)
                  )
                }
              >

                {rentalPeriods.map(
                  (period) => (
                    <option
                      key={period}
                      value={period}
                    >
                      {period} Months
                    </option>
                  )
                )}

              </select>

            </div>

          )}

          {/* PRICE SUMMARY */}

          {product.available && (

            <div className="product-details-summary">

              <div>
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

              <div>
                <span>
                  {months} Months Rent
                </span>

                <strong>
                  ₹
                  {rentalAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div>
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

              <div className="product-details-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

          )}

          {/* RENT BUTTON */}

          <button
            className="product-details-rent-button"
            disabled={!product.available}
            onClick={handleRentNow}
          >
            {product.available
              ? "Rent Now →"
              : "Currently Unavailable"}
          </button>

        </section>

      </main>

    </div>
  );
}

export default ProductDetails;
