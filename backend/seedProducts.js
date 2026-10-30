
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: "Comfort 3-Seater Sofa",
    category: "Furniture",
    price: 999,
    deposit: 2500,
    tenure: "3 - 12 Months",
    available: true,
  },

  {
    name: "Premium Queen Bed",
    category: "Furniture",
    price: 799,
    deposit: 2000,
    tenure: "3 - 12 Months",
    available: true,
  },

  {
    name: "Modern Study Table",
    category: "Furniture",
    price: 499,
    deposit: 1200,
    tenure: "3 - 12 Months",
    available: true,
  },

  {
    name: "Double Door Refrigerator",
    category: "Appliances",
    price: 1499,
    deposit: 4000,
    tenure: "6 - 12 Months",
    available: true,
  },

  {
    name: "Fully Automatic Washing Machine",
    category: "Appliances",
    price: 1299,
    deposit: 3500,
    tenure: "6 - 12 Months",
    available: true,
  },

  {
    name: "Smart LED Television",
    category: "Appliances",
    price: 1099,
    deposit: 3000,
    tenure: "3 - 12 Months",
    available: false,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Remove existing products
    await Product.deleteMany();

    // Insert products
    const insertedProducts = await Product.insertMany(
      products
    );

    console.log(
      `${insertedProducts.length} products inserted successfully!`
    );

    process.exit(0);
  } catch (error) {
    console.error("Product seeding failed:");
    console.error(error.message);

    process.exit(1);
  }
};

seedProducts();
