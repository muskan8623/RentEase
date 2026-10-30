const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Furniture", "Appliances"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    deposit: {
      type: Number,
      required: true,
      min: 0,
    },

    tenure: {
      type: String,
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    // Uploaded product image
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

module.exports = Product;