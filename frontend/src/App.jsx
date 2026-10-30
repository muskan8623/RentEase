import { BrowserRouter, Routes, Route } from "react-router-dom";

// Customer pages
import Home from "./Home";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";
import MyRentals from "./MyRentals";
import PaymentDemo from "./PaymentDemo";
import OrderConfirmation from "./OrderConfirmation";
import RentalHistory from "./RentalHistory";

// Customer authentication
import Login from "./auth/Login";
import Register from "./auth/Register";

// Seller pages
import SellerLogin from "./seller/SellerLogin";
import SellerDashboard from "./seller/SellerDashboard";
import SellerProducts from "./seller/SellerProducts";
import AddProduct from "./seller/AddProduct";
import SellerOrders from "./seller/SellerOrders";
import EditProduct from "./seller/EditProduct";

// Seller protection
import SellerProtectedRoute from "./seller/SellerProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            CUSTOMER AUTHENTICATION
        ========================== */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =========================
            CUSTOMER PAGES
        ========================== */}

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route
          path="/my-rentals"
          element={<MyRentals />}
        />

        <Route
          path="/payment-demo"
          element={<PaymentDemo />}
        />

        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

        <Route
          path="/rental-history"
          element={<RentalHistory />}
        />

        {/* =========================
            SELLER LOGIN
        ========================== */}

        <Route
          path="/seller/login"
          element={<SellerLogin />}
        />

        {/* =========================
            SELLER DASHBOARD
        ========================== */}

        <Route
          path="/seller/dashboard"
          element={
            <SellerProtectedRoute>
              <SellerDashboard />
            </SellerProtectedRoute>
          }
        />

        {/* =========================
            SELLER PRODUCTS
        ========================== */}

        <Route
          path="/seller/products"
          element={
            <SellerProtectedRoute>
              <SellerProducts />
            </SellerProtectedRoute>
          }
        />

        {/* =========================
            ADD PRODUCT
        ========================== */}

        <Route
          path="/seller/add-product"
          element={
            <SellerProtectedRoute>
              <AddProduct />
            </SellerProtectedRoute>
          }
        />

        {/* =========================
            SELLER ORDERS
        ========================== */}

        <Route
          path="/seller/orders"
          element={
            <SellerProtectedRoute>
              <SellerOrders />
            </SellerProtectedRoute>
          }
        />

        {/* =========================
            EDIT PRODUCT
        ========================== */}

        <Route
          path="/seller/edit-product/:id"
          element={
            <SellerProtectedRoute>
              <EditProduct />
            </SellerProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;