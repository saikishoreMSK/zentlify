"use client";
import { useState } from "react";
import './addProduct.css'
import { ALLOWED_BADGES } from "@/lib/badges";
const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Store the Cloudinary image URL
  const [product, setProduct] = useState({
    name: "",
    description: "",
    categories: [],
    link: "",
    badge: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Handle image upload to Cloudinary
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      // 1. Ask our server for a short-lived signed-upload payload (admin-only).
      const sigRes = await fetch("/api/upload-signature", { method: "POST" });
      if (!sigRes.ok) throw new Error("Could not authorize upload");
      const { cloudName, apiKey, timestamp, folder, signature } =
        await sigRes.json();

      // 2. Upload the file directly to Cloudinary using the signature.
      const data = new FormData();
      data.append("file", file);
      data.append("api_key", apiKey);
      data.append("timestamp", timestamp);
      data.append("folder", folder);
      data.append("signature", signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: data }
      );
      const uploadedImgData = await res.json();
      if (!res.ok || !uploadedImgData.secure_url) {
        throw new Error(uploadedImgData.error?.message || "Upload failed");
      }
      // Prefer the https URL so images load on a secure site without mixed content.
      setUploadedImageUrl(uploadedImgData.secure_url || uploadedImgData.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(error.message || "Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!product.name || !uploadedImageUrl) {
      alert("Please provide a product name and upload an image.");
      return;
    }

    setSubmitting(true);
    try {
      // Save through the secured server API (Admin SDK + session check).
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          categories: selectedCategories,
          image: uploadedImageUrl, // Use the Cloudinary URL
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to add product");
      }

      alert(`Product added successfully! ID: ${result.id}`);
      // Reset form
      setProduct({ name: "", description: "", categories: [], link: "", badge: "" });
      setSelectedCategories([]);
      setUploadedImageUrl("");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message || "Error adding product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Image Upload Section */}
      <div className="upload-container">
        <div className="upload-icon">
          {loading ? (
            "Uploading..."
          ) : (
            <img src="/upload-file.svg" alt="logo" height="60px" width="60px" />
          )}
        </div>
        <input
          type="file"
          className="file-input"
          onChange={handleFileUpload}
        ></input>
        {uploadedImageUrl && <p>Image Uploaded: {uploadedImageUrl}</p>}
      </div>

      {/* Product Name */}
      <input
        type="text"
        placeholder="Name"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={product.description}
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
      />
      {/* Editorial badge (no manual prices — see src/lib/badges.js) */}
      <select
        value={product.badge}
        onChange={(e) => setProduct({ ...product, badge: e.target.value })}
      >
        <option value="">No badge</option>
        {ALLOWED_BADGES.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      {/* Categories */}
      <div>
        <p>Select Categories:</p>
        {["Dogs", "Cats", "Home", "Tech", "Cars","Trending","Best"].map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              value={category}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {category}
          </label>
        ))}
      </div>

      {/* Amazon Link */}
      <input
        type="text"
        placeholder="Amazon Link"
        value={product.link}
        onChange={(e) => setProduct({ ...product, link: e.target.value })}
      />

      {/* Submit Button */}
      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProduct;
