import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerDashboard.css";

function SellerDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoadingProducts(false);
      })
      .catch((error) => {
        console.error(
          "Unable to load products:",
          error
        );

        setProducts([]);
        setLoadingProducts(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "rentEaseSellerLoggedIn"
    );

    navigate("/seller/login");
  };

  return (
    <div className="seller-dashboard">

      {/* ================================
          HEADER
      ================================= */}

      <header className="seller-dashboard-header">

        <div>

          <h1>
            RentEase Seller
          </h1>

          <p>
            Manage your rental business
          </p>

        </div>


        <button
          className="seller-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>


      {/* ================================
          MAIN
      ================================= */}

      <main className="seller-dashboard-content">


        {/* WELCOME */}

        <div className="seller-welcome">

          <h2>
            Welcome, Seller 👋
          </h2>

          <p>
            Manage products, rentals and
            customer orders from your
            seller dashboard.
          </p>

        </div>


        {/* ================================
            DASHBOARD CARDS
        ================================= */}

        <div className="seller-dashboard-grid">


          {/* PRODUCTS */}

          <div
            className="seller-dashboard-card"
            onClick={() =>
              navigate("/seller/products")
            }
          >

            <div className="seller-card-icon">
              📦
            </div>

            <h3>
              My Products
            </h3>

            <p>
              View and manage all your
              furniture and appliance listings.
            </p>

            <button>
              Manage Products →
            </button>

          </div>


          {/* ADD PRODUCT */}

          <div
            className="seller-dashboard-card"
            onClick={() =>
              navigate("/seller/add-product")
            }
          >

            <div className="seller-card-icon">
              ➕
            </div>

            <h3>
              Add Product
            </h3>

            <p>
              Add a new furniture or appliance
              with its product image.
            </p>

            <button>
              Add Product →
            </button>

          </div>


          {/* ORDERS */}

          <div
            className="seller-dashboard-card"
            onClick={() =>
              navigate("/seller/orders")
            }
          >

            <div className="seller-card-icon">
              🛍️
            </div>

            <h3>
              Rental Orders
            </h3>

            <p>
              View customer rental orders
              and manage upcoming rentals.
            </p>

            <button>
              View Orders →
            </button>

          </div>

        </div>


        {/* ================================
            BUSINESS OVERVIEW
        ================================= */}

        <section className="seller-stats-section">

          <h2>
            Business Overview
          </h2>


          <div className="seller-stats-grid">


            {/* PRODUCTS */}

            <div className="seller-stat-card">

              <span>
                Products
              </span>

              <strong>
                {loadingProducts
                  ? "..."
                  : products.length}
              </strong>

            </div>


            {/* ACTIVE RENTALS */}

            <div className="seller-stat-card">

              <span>
                Active Rentals
              </span>

              <strong>
                0
              </strong>

            </div>


            {/* PENDING ORDERS */}

            <div className="seller-stat-card">

              <span>
                Pending Orders
              </span>

              <strong>
                0
              </strong>

            </div>


            {/* EARNINGS */}

            <div className="seller-stat-card">

              <span>
                Total Earnings
              </span>

              <strong>
                ₹0
              </strong>

            </div>

          </div>

        </section>


        {/* ================================
            INVENTORY PREVIEW
        ================================= */}

        <section className="seller-inventory-section">

          <div className="seller-inventory-heading">

            <div>

              <h2>
                Your Inventory
              </h2>

              <p>
                Recently added rental products
              </p>

            </div>


            <button
              onClick={() =>
                navigate("/seller/products")
              }
            >
              View All →
            </button>

          </div>


          {loadingProducts ? (

            <div className="seller-inventory-loading">
              Loading products...
            </div>

          ) : products.length === 0 ? (

            <div className="seller-inventory-empty">

              <div>
                📦
              </div>

              <h3>
                No products yet
              </h3>

              <p>
                Add your first product to
                start your rental inventory.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/seller/add-product"
                  )
                }
              >
                + Add Product
              </button>

            </div>

          ) : (

            <div className="seller-inventory-grid">

              {products
                .slice(-4)
                .reverse()
                .map((product) => (

                  <div
                    className="seller-inventory-card"
                    key={product._id}
                  >

                    {/* IMAGE */}

                    <div className="seller-inventory-image">

                      {product.image ? (

                        <img
                          src={product.image}
                          alt={product.name}
                        />

                      ) : (

                        <span>
                          {product.category ===
                          "Furniture"
                            ? "🛋️"
                            : "📺"}
                        </span>

                      )}

                    </div>


                    {/* INFO */}

                    <div className="seller-inventory-info">

                      <span>
                        {product.category}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <strong>
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-IN"
                        )}

                        <small>
                          {" "}
                          / month
                        </small>
                      </strong>


                      <div
                        className={
                          product.available
                            ? "inventory-available"
                            : "inventory-unavailable"
                        }
                      >
                        {product.available
                          ? "● Available"
                          : "● Unavailable"}
                      </div>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default SellerDashboard;