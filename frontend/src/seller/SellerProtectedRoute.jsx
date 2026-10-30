import { Navigate } from "react-router-dom";

function SellerProtectedRoute({ children }) {
  const token = localStorage.getItem("rentEaseToken");
  const userData = localStorage.getItem("rentEaseUser");

  // No login information
  if (!token || !userData) {
    return (
      <Navigate
        to="/seller/login"
        replace
      />
    );
  }

  try {
    const user = JSON.parse(userData);

    // Logged-in customer trying to access seller area
    if (user.role !== "seller") {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }

    // Valid seller
    return children;
  } catch (error) {
    console.error(
      "Seller authentication error:",
      error
    );

    localStorage.removeItem("rentEaseToken");
    localStorage.removeItem("rentEaseUser");

    return (
      <Navigate
        to="/seller/login"
        replace
      />
    );
  }
}

export default SellerProtectedRoute;