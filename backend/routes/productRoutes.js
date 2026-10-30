const express = require("express");

const Product = require("../models/Product");

const sellerOnly = require("../middleware/sellerMiddleware");

const router = express.Router();

/* =====================================================
   GET ALL PRODUCTS
   Customer + Seller
===================================================== */

router.get("/", async (req, res) => {
  try {
    const products =
      await Product.find()
        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch products.",
    });
  }
});


/* =====================================================
   GET SINGLE PRODUCT
   Customer + Seller
===================================================== */

router.get("/:id", async (req, res) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found.",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch product.",
    });
  }
});


/* =====================================================
   ADD PRODUCT
   SELLER ONLY
===================================================== */

router.post(
  "/",
  sellerOnly,
  async (req, res) => {
    try {
      const {
        name,
        category,
        price,
        deposit,
        tenure,
        available,
        image,
      } = req.body;

      if (
        !name ||
        !category ||
        price === undefined ||
        deposit === undefined ||
        !tenure
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, category, price, deposit and tenure are required.",
        });
      }

      const product =
        new Product({
          name: name.trim(),

          category,

          price:
            Number(price),

          deposit:
            Number(deposit),

          tenure,

          available:
            available !== false,

          image:
            image || "",
        });

      const savedProduct =
        await product.save();

      res.status(201).json({
        success: true,

        message:
          "Product added successfully.",

        product:
          savedProduct,
      });
    } catch (error) {
      console.error(
        "Add product error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to add product.",
        error:
          error.message,
      });
    }
  }
);


/* =====================================================
   UPDATE PRODUCT
   SELLER ONLY
===================================================== */

router.put(
  "/:id",
  sellerOnly,
  async (req, res) => {
    try {
      const {
        name,
        category,
        price,
        deposit,
        tenure,
        available,
        image,
      } = req.body;

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found.",
        });
      }

      if (name !== undefined) {
        product.name =
          name.trim();
      }

      if (category !== undefined) {
        product.category =
          category;
      }

      if (price !== undefined) {
        product.price =
          Number(price);
      }

      if (deposit !== undefined) {
        product.deposit =
          Number(deposit);
      }

      if (tenure !== undefined) {
        product.tenure =
          tenure;
      }

      if (available !== undefined) {
        product.available =
          available;
      }

      if (image !== undefined) {
        product.image =
          image;
      }

      const updatedProduct =
        await product.save();

      res.json({
        success: true,

        message:
          "Product updated successfully.",

        product:
          updatedProduct,
      });
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to update product.",
        error:
          error.message,
      });
    }
  }
);


/* =====================================================
   DELETE PRODUCT
   SELLER ONLY
===================================================== */

router.delete(
  "/:id",
  sellerOnly,
  async (req, res) => {
    try {
      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found.",
        });
      }

      res.json({
        success: true,

        message:
          "Product deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to delete product.",
      });
    }
  }
);


module.exports = router;