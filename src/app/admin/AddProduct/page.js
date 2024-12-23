"use client";
import { db } from "../../api/firebase"; // Ensure Firestore is configured
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // Store the Cloudinary image URL
  const [product, setProduct] = useState({
    name: "",
    description: "",
    categories: [],
    link: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Handle image upload to Cloudinary
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "zentlify_coudinary");
    data.append("cloud_name", "dubbgtl97");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dubbgtl97/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const uploadedImgData = await res.json();
      setUploadedImageUrl(uploadedImgData.url); // Save the uploaded image URL
      setLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
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

    try {
      // Save product data to Firestore
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        categories: selectedCategories,
        image: uploadedImageUrl, // Use the Cloudinary URL
      });

      alert(`Product added successfully! ID: ${docRef.id}`);
      // Reset form
      setProduct({ name: "", description: "", categories: [], link: "" });
      setSelectedCategories([]);
      setUploadedImageUrl("");
    } catch (error) {
      console.error("Error adding product:", error);
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

      {/* Categories */}
      <div>
        <p>Select Categories:</p>
        {["Dogs", "Cats", "Home", "Tech", "Cars"].map((category) => (
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
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;
