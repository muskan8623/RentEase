import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
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

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Product not found");
      }

      const product = data.product || data;

      setFormData({
        name: product.name || "",
        category: product.category || "Furniture",
        price: product.price || "",
        deposit: product.deposit || "",
        tenure: product.tenure || "3 - 12 Months",
        available: product.available !== false,
        image: product.image || "",
      });

      setPreview(product.image || "");
    } catch (error) {
      console.error(error);
      setError(error.message || "Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      setFormData((prev) => ({
        ...prev,
        image: imageData,
      }));

      setPreview(imageData);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));

    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (Number(formData.price) <= 0) {
      alert("Please enter a valid monthly rent.");
      return;
    }

    if (Number(formData.deposit) < 0) {
      alert("Please enter a valid deposit.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            category: formData.category,
            price: Number(formData.price),
            deposit: Number(formData.deposit),
            tenure: formData.tenure,
            available: formData.available,
            image: formData.image,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update product.");
      }

      alert("Product updated successfully!");

      navigate("/seller/products");
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product-page">
        <div className="edit-product-loading">
          Loading product...
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="edit-product-page">
        <div className="edit-product-error">
          <h2>Unable to Load Product</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/seller/products")}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-container">

        <div className="edit-product-header">
          <div>
            <span className="edit-product-eyebrow">
              SELLER PANEL
            </span>

            <h1>Edit Product</h1>

            <p>
              Update rental product information and availability.
            </p>
          </div>

          <button
            type="button"
            className="edit-back-button"
            onClick={() => navigate("/seller/products")}
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className="edit-product-error-message">
            {error}
          </div>
        )}

        <form
          className="edit-product-form"
          onSubmit={handleSubmit}
        >
          <div className="edit-form-grid">

            <div className="edit-form-section">
              <h2>Product Information</h2>

              <div className="edit-form-group">
                <label>Product Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
              </div>

              <div className="edit-form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Furniture">
                    Furniture
                  </option>

                  <option value="Appliances">
                    Appliances
                  </option>
                </select>
              </div>

              <div className="edit-two-columns">

                <div className="edit-form-group">
                  <label>Monthly Rent (₹)</label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="999"
                  />
                </div>

                <div className="edit-form-group">
                  <label>Security Deposit (₹)</label>

                  <input
                    type="number"
                    name="deposit"
                    min="0"
                    value={formData.deposit}
                    onChange={handleChange}
                    placeholder="2500"
                  />
                </div>

              </div>

              <div className="edit-form-group">
                <label>Rental Tenure</label>

                <select
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                >
                  <option value="1 - 3 Months">
                    1 - 3 Months
                  </option>

                  <option value="3 - 12 Months">
                    3 - 12 Months
                  </option>

                  <option value="6 - 12 Months">
                    6 - 12 Months
                  </option>

                  <option value="12+ Months">
                    12+ Months
                  </option>
                </select>
              </div>

              <label className="edit-availability">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />

                <span>
                  Product is currently available for rental
                </span>
              </label>
            </div>

            <div className="edit-form-section">
              <h2>Product Image</h2>

              <div className="edit-image-box">

                {preview ? (
                  <img
                    src={preview}
                    alt={formData.name || "Product"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="edit-image-placeholder">
                    <span>📷</span>
                    <p>No image selected</p>
                  </div>
                )}

              </div>

              <label className="edit-upload-button">
                Choose New Image

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </label>

              {preview && (
                <button
                  type="button"
                  className="edit-remove-image"
                  onClick={removeImage}
                >
                  Remove Image
                </button>
              )}

              <p className="edit-image-note">
                JPG, PNG or WEBP • Maximum 2 MB
              </p>
            </div>

          </div>

          <div className="edit-form-actions">
            <button
              type="button"
              className="edit-cancel-button"
              onClick={() => navigate("/seller/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="edit-save-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default EditProduct;