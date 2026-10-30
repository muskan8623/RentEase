const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const createSeller = async () => {
  try {
    await connectDB();

    const sellerEmail = "seller@rentease.com";
    const sellerPassword = "123456";

    const existingSeller = await User.findOne({
      email: sellerEmail,
    });

    if (existingSeller) {
      console.log("Seller account already exists.");

      console.log({
        email: existingSeller.email,
        role: existingSeller.role,
      });

      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(
        sellerPassword,
        10
      );

    const seller = new User({
      name: "RentEase Seller",
      email: sellerEmail,
      phone: "",
      password: hashedPassword,
      role: "seller",
    });

    await seller.save();

    console.log("");
    console.log("==============================");
    console.log("SELLER ACCOUNT CREATED");
    console.log("==============================");
    console.log(
      "Email:",
      sellerEmail
    );
    console.log(
      "Password:",
      sellerPassword
    );
    console.log(
      "Role:",
      seller.role
    );
    console.log("==============================");
    console.log("");

    process.exit(0);
  } catch (error) {
    console.error(
      "Unable to create seller:"
    );
    console.error(error.message);

    process.exit(1);
  }
};

createSeller();