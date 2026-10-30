import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {

  const navigate = useNavigate();


  const [formData, setFormData] = useState({

    name: "",

    category: "Furniture",

    price: "",

    deposit: "",

    tenure: "3 - 12 Months",

    available: true,

    image: "",

  });


  const [imagePreview, setImagePreview] =
    useState("");


  const [saving, setSaving] =
    useState(false);


  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    setFormData((previous) => ({

      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));

  };


  /* =====================================================
     IMAGE UPLOAD
  ===================================================== */

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];


    if (!file) {
      return;
    }


    /* FILE TYPE */

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select an image file."
      );

      return;
    }


    /* FILE SIZE */

    if (
      file.size >
      2 * 1024 * 1024
    ) {

      alert(
        "Image must be less than 2 MB."
      );

      return;
    }


    /* READ FILE */

    const reader =
      new FileReader();


    reader.onload = () => {

      const image =
        reader.result;


      setImagePreview(
        image
      );


      setFormData(
        (previous) => ({

          ...previous,

          image:
            image,

        })
      );

    };


    reader.onerror = () => {

      alert(
        "Unable to read image."
      );

    };


    reader.readAsDataURL(
      file
    );

  };


  /* =====================================================
     REMOVE IMAGE
  ===================================================== */

  const removeImage = () => {

    setImagePreview("");

    setFormData(
      (previous) => ({

        ...previous,

        image: "",

      })
    );

  };


  /* =====================================================
     SAVE PRODUCT
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (saving) {
      return;
    }


    if (!formData.name.trim()) {

      alert(
        "Please enter product name."
      );

      return;
    }


    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {

      alert(
        "Please enter a valid monthly rent."
      );

      return;
    }


    if (
      formData.deposit === "" ||
      Number(formData.deposit) < 0
    ) {

      alert(
        "Please enter a valid security deposit."
      );

      return;
    }


    if (!formData.image) {

      alert(
        "Please upload a product image."
      );

      return;
    }


    setSaving(true);


    try {

      console.log(
        "Sending product with image..."
      );


      const response =
        await fetch(
          "http://localhost:5000/api/products",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify({

                name:
                  formData.name.trim(),

                category:
                  formData.category,

                price:
                  Number(formData.price),

                deposit:
                  Number(formData.deposit),

                tenure:
                  formData.tenure,

                available:
                  formData.available,

                image:
                  formData.image,

              }),

          }
        );


      const data =
        await response.json();


      console.log(
        "Server response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to add product."
        );

      }


      alert(
        "Product added successfully!"
      );


      navigate(
        "/seller/products"
      );


    } catch (error) {

      console.error(
        "Add product error:",
        error
      );


      alert(
        error.message ||
        "Unable to add product."
      );


    } finally {

      setSaving(false);

    }

  };


  return (

    <div className="add-product-page">


      {/* HEADER */}

      <header className="add-product-header">

        <div>

          <button
            type="button"
            className="add-product-back"
            onClick={() =>
              navigate(
                "/seller/dashboard"
              )
            }
          >
            ← Back to Dashboard
          </button>


          <h1>
            Add New Product
          </h1>


          <p>
            Add your product with
            pricing and a real product image.
          </p>

        </div>

      </header>


      <main className="add-product-content">


        <form
          className="add-product-form"
          onSubmit={handleSubmit}
        >


          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

          <section className="form-section">


            <div className="form-section-heading">

              <span>
                01
              </span>


              <div>

                <h2>
                  Product Image
                </h2>

                <p>
                  Upload the actual photo
                  of your product.
                </p>

              </div>

            </div>


            {!imagePreview ? (

              <label
                htmlFor="productImage"
                className="image-upload-box"
              >

                <input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                />


                <div className="image-upload-icon">
                  📷
                </div>


                <h3>
                  Add Product Image
                </h3>


                <p>
                  Click here to choose an image
                </p>


                <small>
                  JPG, PNG or WEBP · Maximum 2 MB
                </small>

              </label>

            ) : (

              <div className="uploaded-image-container">


                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="uploaded-product-image"
                />


                <div className="uploaded-image-footer">

                  <span>
                    ✓ Image selected
                  </span>


                  <button
                    type="button"
                    onClick={
                      removeImage
                    }
                  >
                    Remove Image
                  </button>

                </div>

              </div>

            )}

          </section>


          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="form-section">


            <div className="form-section-heading">

              <span>
                02
              </span>


              <div>

                <h2>
                  Basic Information
                </h2>

                <p>
                  Enter your product details.
                </p>

              </div>

            </div>


            <div className="form-grid">


              <div className="form-field form-field-full">

                <label>
                  Product Name
                </label>


                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Premium 3-Seater Sofa"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>


              <div className="form-field">

                <label>
                  Category
                </label>


                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="Furniture">
                    Furniture
                  </option>

                  <option value="Appliances">
                    Appliances
                  </option>

                </select>

              </div>


              <div className="form-field">

                <label>
                  Rental Tenure
                </label>


                <select
                  name="tenure"
                  value={
                    formData.tenure
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="3 - 12 Months">
                    3 - 12 Months
                  </option>

                  <option value="6 - 12 Months">
                    6 - 12 Months
                  </option>

                  <option value="12 Months">
                    12 Months
                  </option>

                </select>

              </div>

            </div>

          </section>


          {/* =================================================
              PRICING
          ================================================= */}

          <section className="form-section">


            <div className="form-section-heading">

              <span>
                03
              </span>


              <div>

                <h2>
                  Pricing
                </h2>

                <p>
                  Set rental price and deposit.
                </p>

              </div>

            </div>


            <div className="form-grid">


              <div className="form-field">

                <label>
                  Monthly Rent
                </label>


                <div className="input-with-symbol">

                  <span>
                    ₹
                  </span>


                  <input
                    type="number"
                    name="price"
                    min="0"
                    placeholder="999"
                    value={
                      formData.price
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>


              <div className="form-field">

                <label>
                  Security Deposit
                </label>


                <div className="input-with-symbol">

                  <span>
                    ₹
                  </span>


                  <input
                    type="number"
                    name="deposit"
                    min="0"
                    placeholder="2500"
                    value={
                      formData.deposit
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              AVAILABILITY
          ================================================= */}

          <section className="form-section">


            <div className="form-section-heading">

              <span>
                04
              </span>


              <div>

                <h2>
                  Availability
                </h2>

                <p>
                  Control product availability.
                </p>

              </div>

            </div>


            <label
              className="availability-toggle"
            >

              <input
                type="checkbox"
                name="available"
                checked={
                  formData.available
                }
                onChange={
                  handleChange
                }
              />


              <span className="toggle-slider"></span>


              <div>

                <strong>
                  Product Available for Rental
                </strong>


                <small>
                  Customers can rent this product.
                </small>

              </div>

            </label>

          </section>


          {/* ACTIONS */}

          <div className="add-product-actions">


            <button
              type="button"
              className="cancel-product-button"
              onClick={() =>
                navigate(
                  "/seller/dashboard"
                )
              }
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="save-product-button"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save Product"}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default AddProduct;