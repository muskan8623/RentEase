const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

/* =====================================================
   REGISTER
===================================================== */

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    const cleanEmail =
      email.toLowerCase().trim();

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user = new User({
      name: name.trim(),

      email: cleanEmail,

      phone: phone || "",

      password: hashedPassword,

      role: "customer",
    });

    const savedUser =
      await user.save();

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from .env"
      );

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration is missing.",
      });
    }

    const token =
      jwt.sign(
        {
          userId: savedUser._id.toString(),
          role: savedUser.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    res.status(201).json({
      success: true,

      message:
        "Account created successfully.",

      token,

      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:"
    );

    console.error(
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create account.",
      error:
        error.message,
    });
  }
});


/* =====================================================
   LOGIN
===================================================== */

router.post("/login", async (req, res) => {
  try {
    console.log("");
    console.log("==============================");
    console.log("LOGIN REQUEST");
    console.log("==============================");

    const {
      email,
      password,
    } = req.body;

    console.log(
      "Email:",
      email
    );

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const cleanEmail =
      email.toLowerCase().trim();

    console.log(
      "Searching user:",
      cleanEmail
    );

    const user =
      await User.findOne({
        email: cleanEmail,
      });

    if (!user) {
      console.log(
        "USER NOT FOUND"
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    console.log(
      "User found:",
      user.email
    );

    console.log(
      "User role:",
      user.role
    );

    /* Check password */

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log(
      "Password match:",
      passwordMatch
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    /* Check JWT configuration */

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing!"
      );

      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is missing from backend .env file.",
      });
    }

    /* Create token */

    const token =
      jwt.sign(
        {
          userId: user._id.toString(),
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    console.log(
      "JWT CREATED SUCCESSFULLY"
    );

    console.log(
      "LOGIN SUCCESS"
    );

    console.log(
      "=============================="
    );
    console.log("");

    res.json({
      success: true,

      message:
        "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("");
    console.error(
      "=============================="
    );
    console.error(
      "LOGIN ERROR"
    );
    console.error(
      "=============================="
    );
    console.error(
      error
    );
    console.error(
      "=============================="
    );
    console.error("");

    res.status(500).json({
      success: false,
      message:
        "Unable to login.",
      error:
        error.message,
    });
  }
});


/* =====================================================
   CURRENT USER
===================================================== */

router.get("/me", async (req, res) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization token required.",
      });
    }

    if (
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format.",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token missing.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is missing from backend .env file.",
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    const user =
      await User.findById(
        decoded.userId
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "GET CURRENT USER ERROR:",
      error
    );

    res.status(401).json({
      success: false,
      message:
        "Invalid or expired token.",
    });
  }
});


module.exports = router;