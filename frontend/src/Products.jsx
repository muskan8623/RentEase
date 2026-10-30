import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Products.css";
import Navbar from "./Navbar";

// Old local images are kept as fallback
import sofaImage from "./assets/sofa.png";
import bedImage from "./assets/bed.jpg";
import studyTableImage from "./assets/study table.jpeg";
import refrigeratorImage from "./assets/refrigerator.jpeg";
import washingMachineImage from "./assets/washing machine.jpeg";
import tvImage from "./assets/tv.jpeg";

/* =====================================================
   OLD PRODUCT IMAGE FALLBACK
===================================================== */

const oldProductImages = {
  "Comfort 3-Seater Sofa": sofaImage,
  "Premium Queen Bed": bedImage,
  "Modern Study Table": studyTableImage,
  "Double Door Refrigerator": refrigeratorImage,
  "Fully Automatic Washing Machine": washingMachineImage,
  "Smart LED Television": tvImage,
};

/* =====================================================
   GET PRODUCT IMAGE
===================================================== */

const getProductImage = (product) => {
  // 1. Seller uploaded image from MongoDB
  if (
    product.image &&
    typeof product.image === "string" &&
    product.image.trim() !== ""
  ) {
    return product.image;
  }

  // 2. Old local image
  if (oldProductImages[product.name]) {
    return oldProductImages[product.name];
  }

  // 3. No image
  return null;
};

/* =====================================================
   PRODUCTS COMPONENT
===================================================== */

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD PRODUCTS FROM MONGODB
  ===================================================== */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        console.log("Customer products:", data.products);

        setProducts(data.products || []);
      } catch (error) {
        console.error("Products loading error:", error);

        setError(
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* =====================================================
     PRODUCT DETAILS
  ===================================================== */

  const openProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="products-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="products-header">
        <div className="products-header-inner">

          <div>
            <Link
              to="/"
              className="products-back-home"
            >
              ← Back to Home
            </Link>

            <h1>
              Rent Furniture & Appliances
            </h1>

            <p>
              Find affordable products for your home.
            </p>
          </div>


        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="products-content">

        {/* LOADING */}

        {loading && (
          <div className="products-message">

            <div className="products-message-icon">
              ⏳
            </div>

            <h2>
              Loading products...
            </h2>

            <p>
              Please wait while we load available rentals.
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="products-message">

            <div className="products-message-icon">
              ⚠️
            </div>

            <h2>
              Something went wrong
            </h2>

            <p>
              {error}
            </p>

            <button
              className="products-retry-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>
        )}

        {/* PRODUCTS */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              {/* PRODUCT COUNT */}

              <div className="products-top-bar">
                <div>

                  <span className="products-count">
                    {products.length}
                  </span>

                  <span>
                    {" "}
                    products available
                  </span>

                </div>
              </div>

              {/* PRODUCT GRID */}

              <div className="products-grid">

                {products.map((product) => {

                  const productImage =
                    getProductImage(product);

                  return (
                    <article
                      className="product-card"
                      key={product._id}
                    >

                      {/* PRODUCT IMAGE */}

                      <div
                        className="product-card-image"
                        onClick={() =>
                          openProduct(product._id)
                        }
                      >

                        {productImage ? (
                          <img
                            src={productImage}
                            alt={product.name}
                            className="customer-product-image"
                            onError={(event) => {
                              console.error(
                                "Customer image failed:",
                                product.name
                              );

                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="customer-product-placeholder">
                            {product.category ===
                            "Furniture"
                              ? "🛋️"
                              : "📺"}
                          </div>
                        )}

                        {/* AVAILABILITY */}

                        <div
                          className={`customer-availability ${
                            product.available
                              ? "available"
                              : "unavailable"
                          }`}
                        >
                          {product.available
                            ? "● Available"
                            : "● Unavailable"}
                        </div>

                      </div>

                      {/* PRODUCT INFORMATION */}

                      <div className="product-card-content">

                        <span className="product-category">
                          {product.category}
                        </span>

                        <h2>
                          {product.name}
                        </h2>

                        <div className="customer-product-price">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString("en-IN")}

                          <span>
                            {" / month"}
                          </span>
                        </div>

                        <p className="customer-product-deposit">
                          Security Deposit:
                          {" ₹"}
                          {Number(
                            product.deposit
                          ).toLocaleString("en-IN")}
                        </p>

                        <p className="customer-product-tenure">
                          Tenure:
                          {" "}
                          {product.tenure}
                        </p>

                        {/* ACTION */}

                        {product.available ? (
                          <button
                            className="customer-view-product-button"
                            onClick={() =>
                              openProduct(product._id)
                            }
                          >
                            View Product →
                          </button>
                        ) : (
                          <button
                            className="customer-view-product-button unavailable-button"
                            onClick={() =>
                              openProduct(product._id)
                            }
                          >
                            View Details →
                          </button>
                        )}

                      </div>

                    </article>
                  );
                })}

              </div>
            </>
          )}

        {/* NO PRODUCTS */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="products-message">

              <div className="products-message-icon">
                📦
              </div>

              <h2>
                No products available
              </h2>

              <p>
                Please check again later.
              </p>

            </div>
          )}

      </main>

    </div>
  );
}

export default Products;