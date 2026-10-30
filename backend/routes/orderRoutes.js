const express = require("express");
const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/*
=====================================================
GET ALL ORDERS
=====================================================

Used by Seller Orders.

This route currently remains available for the
seller panel.

=====================================================
*/

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
});


/*
=====================================================
GET CUSTOMER'S OWN ORDERS
=====================================================
*/

router.get(
  "/my-orders",
  protect,
  async (req, res) => {
    try {
      const orders = await Order.find({
        userId: req.user.userId,
      }).sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error(
        "Get customer orders error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch your rental history.",
      });
    }
  }
);


/*
=====================================================
GET SINGLE ORDER
=====================================================
*/

router.get(
  "/:id",
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error(
        "Get order error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch order.",
      });
    }
  }
);


/*
=====================================================
CREATE ORDER
=====================================================
*/

router.post(
  "/",
  protect,
  async (req, res) => {
    try {
      console.log(
        "CREATE ORDER REQUEST:",
        req.body
      );

      const {
        productId,
        productName,
        category,
        image,
        monthlyRent,
        months,
        deposit,
        rentalAmount,
        total,
        paymentMethod,
        deliveryDate,
        deliveryAddress,
        tenure,
        customerName,
        customerPhone,
        customerEmail,
        city,
        pincode,
      } = req.body;

      if (!productName) {
        return res.status(400).json({
          success: false,
          message:
            "Product name is required.",
        });
      }

      const order = new Order({
        userId: req.user.userId,

        orderId: `RE${Date.now()}`,

        productId:
          productId || "",

        productName,

        category:
          category || "Rental Item",

        image:
          image || "",

        monthlyRent:
          Number(monthlyRent) || 0,

        months:
          Number(months) || 1,

        deposit:
          Number(deposit) || 0,

        rentalAmount:
          Number(rentalAmount) || 0,

        total:
          Number(total) || 0,

        paymentMethod:
          paymentMethod ||
          "Cash on Delivery",

        status: "Pending",

        deliveryDate:
          deliveryDate || "",

        deliveryAddress:
          deliveryAddress || "",

        tenure:
          tenure ||
          "3 - 12 Months",

        customerName:
          customerName || "",

        customerPhone:
          customerPhone || "",

        customerEmail:
          customerEmail || "",

        city:
          city || "",

        pincode:
          pincode || "",
      });

      const savedOrder =
        await order.save();

      console.log(
        "ORDER SAVED SUCCESSFULLY:",
        savedOrder.orderId
      );

      res.status(201).json({
        success: true,
        message:
          "Order created successfully.",
        order: savedOrder,
      });
    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to create order.",
        error: error.message,
      });
    }
  }
);


/*
=====================================================
UPDATE ORDER STATUS
=====================================================
*/

router.put(
  "/:id/status",
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Out for Delivery",
        "Active Rental",
        "Completed",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status.",
        });
      }

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            status: status,
          },
          {
            returnDocument: "after",
          }
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Order status updated.",
        order,
      });
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to update order status.",
      });
    }
  }
);


/*
=====================================================
DELETE ORDER
=====================================================
*/

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const order =
        await Order.findByIdAndDelete(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Order deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete order error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to delete order.",
      });
    }
  }
);


module.exports = router;