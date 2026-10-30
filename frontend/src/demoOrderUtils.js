export function saveDemoRentalOrder(paymentMethod) {
  try {
    /* =========================================
       GET CURRENT CART
    ========================================= */

    const rental = JSON.parse(
      localStorage.getItem("rentEaseCart") || "null"
    );

    if (
      !rental ||
      Array.isArray(rental) ||
      !rental.name
    ) {
      console.error(
        "No valid RentEase cart found."
      );

      return false;
    }

    /* =========================================
       RENTAL VALUES
    ========================================= */

    const price =
      Number(rental.price) || 0;

    const months =
      Number(rental.months) || 0;

    const deposit =
      Number(rental.deposit) || 0;

    if (
      price <= 0 ||
      months <= 0
    ) {
      console.error(
        "Invalid rental price or months."
      );

      return false;
    }

    /* =========================================
       GET EXISTING DEMO ORDERS
    ========================================= */

    let orders = [];

    try {
      const savedOrders =
        JSON.parse(
          localStorage.getItem(
            "rentEaseDemoOrders"
          ) || "[]"
        );

      if (Array.isArray(savedOrders)) {
        orders = savedOrders;
      }
    } catch (error) {
      console.error(
        "Unable to read existing orders:",
        error
      );

      orders = [];
    }

    /* =========================================
       CREATE ORDER
    ========================================= */

    const order = {
      orderId:
        `DEMO-${Date.now()}`,

      /* Product ID */

      productId:
        rental.productId ||
        rental._id ||
        rental.id ||
        "",

      /* Product information */

      productName:
        rental.name,

      category:
        rental.category ||
        "Rental Item",

      /* =====================================
         IMPORTANT:
         SAVE SELLER UPLOADED IMAGE
      ===================================== */

      image:
        rental.image || "",

      /* Rental pricing */

      monthlyRent:
        price,

      months:
        months,

      deposit:
        deposit,

      rentalAmount:
        price * months,

      total:
        price * months +
        deposit,

      /* Payment */

      paymentMethod:
        paymentMethod ||
        "Cash on Delivery (Demo)",

      /* Demo status */

      status:
        "Demo only — not submitted",

      /* Delivery */

      deliveryDate:
        rental.deliveryDate || "",

      deliveryAddress:
        rental.deliveryAddress || "",

      /* Tenure */

      tenure:
        rental.tenure ||
        "3 - 12 Months",

      /* Date */

      createdAt:
        new Date().toISOString()
    };

    /* =========================================
       ADD NEW ORDER
    ========================================= */

    orders.unshift(order);

    /* =========================================
       SAVE ORDER
    ========================================= */

    localStorage.setItem(
      "rentEaseDemoOrders",
      JSON.stringify(orders)
    );

    /* =========================================
       DEBUG
    ========================================= */

    console.log(
      "================================="
    );

    console.log(
      "RentEase Demo Order Saved"
    );

    console.log(
      "Order:",
      order
    );

    console.log(
      "Product:",
      order.productName
    );

    console.log(
      "Image:",
      order.image
        ? "IMAGE PRESENT ✅"
        : "NO IMAGE ❌"
    );

    console.log(
      "================================="
    );

    return true;

  } catch (error) {
    console.error(
      "Unable to save demo rental order:",
      error
    );

    return false;
  }
}