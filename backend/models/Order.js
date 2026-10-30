const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    productId: {
      type: String,
      default: "",
    },

    productName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "Rental Item",
    },

    image: {
      type: String,
      default: "",
    },

    monthlyRent: {
      type: Number,
      required: true,
      min: 0,
    },

    months: {
      type: Number,
      required: true,
      min: 1,
    },

    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },

    rentalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Out for Delivery",
        "Active Rental",
        "Completed",
      ],
      default: "Pending",
    },

    deliveryDate: {
      type: String,
      default: "",
    },

    deliveryAddress: {
      type: String,
      default: "",
    },

    tenure: {
      type: String,
      default: "3 - 12 Months",
    },

    customerName: {
      type: String,
      default: "",
    },

    customerPhone: {
      type: String,
      default: "",
    },

    customerEmail: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

module.exports = Order;