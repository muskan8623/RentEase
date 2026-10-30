const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/*
=====================================================
CONNECT MONGODB
=====================================================
*/

connectDB();

/*
=====================================================
MIDDLEWARE
=====================================================
*/

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

/*
=====================================================
HOME / TEST ROUTE
=====================================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RentEase Backend is Running!",
  });
});

/*
=====================================================
PRODUCT ROUTES
=====================================================
*/

app.use(
  "/api/products",
  productRoutes
);

/*
=====================================================
ORDER ROUTES
=====================================================
*/

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

/*
=====================================================
START SERVER
=====================================================
*/

app.listen(PORT, () => {
  console.log(
    `RentEase server running on http://localhost:${PORT}`
  );
});