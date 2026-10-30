import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerProducts.css";

function SellerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD PRODUCTS
     ===================================================== */

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load products."
        );
      }

      const data = await response.json();

      console.log(
        "Products from MongoDB:",
        data.products
      );

      setProducts(
        data.products || []
      );
    } catch (error) {
      console.error(
        "Unable to load products:",
        error
      );

      setError(
        "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* =====================================================
     DELETE PRODUCT
     ===================================================== */

  const handleDelete = async (
    productId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem(
          "rentEaseToken"
        );

      if (!token) {
        alert(
          "Your seller login session has expired. Please login again."
        );

        navigate(
          "/seller/login"
        );

        return;
      }

      const response =
        await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "rentEaseToken"
        );

        localStorage.removeItem(
          "rentEaseUser"
        );

        localStorage.removeItem(
          "rentEaseSellerLoggedIn"
        );

        alert(
          "Your seller session has expired. Please login again."
        );

        navigate(
          "/seller/login"
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete product."
        );
      }

      setProducts(
        (previous) =>
          previous.filter(
            (product) =>
              product._id !==
              productId
          )
      );

      alert(
        "Product deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete product."
      );
    }
  };

  /* =====================================================
     EDIT PRODUCT
     ===================================================== */

  const handleEdit = (
    product
  ) => {
    navigate(
      `/seller/edit-product/${product._id}`
    );
  };

  /* =====================================================
     ADD PRODUCT
     ===================================================== */

  const handleAddProduct = () => {
    navigate(
      "/seller/add-product"
    );
  };

  /* =====================================================
     GO TO DASHBOARD
     ===================================================== */

  const handleDashboard = () => {
    navigate(
      "/seller/dashboard"
    );
  };

  return (
    <div className="seller-products-page">

      {/* ================= HEADER ================= */}

      <header className="seller-products-header">

        <div>

          <button
            className="seller-products-back"
            onClick={
              handleDashboard
            }
          >
            ← Dashboard
          </button>

          <h1>
            My Products
          </h1>

          <p>
            Manage your RentEase rental inventory
          </p>

        </div>

        <button
          className="seller-add-product-button"
          onClick={
            handleAddProduct
          }
        >
          + Add Product
        </button>

      </header>


      <main className="seller-products-content">

        {/* ================= TOOLBAR ================= */}

        <div className="seller-products-toolbar">

          <strong>
            {products.length} Products
          </strong>

          <button
            onClick={
              loadProducts
            }
            className="seller-products-refresh"
          >
            ↻ Refresh
          </button>

        </div>


        {/* ================= LOADING ================= */}

        {loading && (
          <div className="seller-products-empty">

            <div className="seller-products-empty-icon">
              ⏳
            </div>

            <h2>
              Loading products...
            </h2>

          </div>
        )}


        {/* ================= ERROR ================= */}

        {!loading &&
          error && (
            <div className="seller-products-empty">

              <div className="seller-products-empty-icon">
                ⚠️
              </div>

              <h2>
                Unable to load products
              </h2>

              <p>
                {error}
              </p>

              <button
                onClick={
                  loadProducts
                }
              >
                Try Again
              </button>

            </div>
          )}


        {/* ================= PRODUCTS ================= */}

        {!loading &&
          !error &&
          products.length > 0 && (

            <div className="seller-products-grid">

              {products.map(
                (product) => (

                  <div
                    className="seller-product-card"
                    key={
                      product._id
                    }
                  >

                    {/* IMAGE */}

                    <div className="seller-product-image">

                      {product.image &&
                      product.image.length >
                        0 ? (

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          className="seller-real-product-image"
                        />

                      ) : (

                        <div className="seller-product-placeholder">

                          {product.category ===
                          "Furniture"
                            ? "🛋️"
                            : "📺"}

                        </div>

                      )}

                    </div>


                    {/* PRODUCT INFO */}

                    <div className="seller-product-info">

                      <span className="seller-product-category">
                        {
                          product.category
                        }
                      </span>

                      <h3>
                        {
                          product.name
                        }
                      </h3>

                      <div className="seller-product-price">

                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}

                        <span>
                          {" / month"}
                        </span>

                      </div>

                      <div className="seller-product-deposit">

                        Security Deposit:
                        {" ₹"}

                        {Number(
                          product.deposit
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </div>

                      <div className="seller-product-tenure">

                        Tenure:
                        {" "}
                        {
                          product.tenure
                        }

                      </div>

                      <div
                        className={
                          `seller-product-availability ${
                            product.available
                              ? "available"
                              : "unavailable"
                          }`
                        }
                      >

                        {product.available
                          ? "● Available"
                          : "● Unavailable"}

                      </div>


                      {/* ACTION BUTTONS */}

                      <div className="seller-product-actions">

                        <button
                          className="seller-edit-button"
                          onClick={() =>
                            handleEdit(
                              product
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="seller-delete-button"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}


        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          products.length === 0 && (

            <div className="seller-products-empty">

              <div className="seller-products-empty-icon">
                📦
              </div>

              <h2>
                No products yet
              </h2>

              <p>
                Add your first product.
              </p>

              <button
                onClick={
                  handleAddProduct
                }
              >
                + Add Product
              </button>

            </div>

          )}

      </main>

    </div>
  );
}

export default SellerProducts;
