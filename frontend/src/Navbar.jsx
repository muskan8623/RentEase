
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Cart", path: "/cart" },
    { label: "Rental History", path: "/rental-history" },
  ];

  return (
    <header className="rentEase-navbar">
      <Link
        to="/"
        className="rentEase-logo"
        onClick={() => setMenuOpen(false)}
      >
        Rent<span>Ease</span>
      </Link>

      <button
        type="button"
        className="navbar-menu-toggle"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {links.map((link) => {
          const active =
            location.pathname === link.path ||
            (link.path === "/products" &&
              location.pathname.startsWith("/product/"));

          return (
            <Link
              key={link.path}
              to={link.path}
              className={active ? "navbar-link active" : "navbar-link"}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export default Navbar;
