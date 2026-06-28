'use client';
import { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Pagination } from "@mui/material";
import "./ManageProducts.css";

const ManageProducts1 = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [editForm, setEditForm] = useState({
    name: "",
    categories: [],
    description: "",
    link: "",
    image: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setFilteredProducts(productList);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This also removes its image.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Failed to delete product");
      }
      setProducts(products.filter((product) => product.id !== id));
      setFilteredProducts(filteredProducts.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.message || "Error deleting product");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(results);
    setCurrentPage(1);
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category) {
      const results = products.filter((product) =>
        product.categories?.includes(category)
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }
    setCurrentPage(1);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      categories: product.categories || [],
      description: product.description || "",
      link: product.link || "",
      image: product.image || "",
    });
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Failed to update product");
      }
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id ? { ...product, ...editForm } : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      alert("Product updated successfully!");
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.message || "Error updating product");
    }
  };

  // 💡 PAGINATION CALCULATIONS
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        // Optional: Scroll to the top of the list when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  return (
    <div className="manage-products-container">
      <h1>Manage Products</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by product name..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      {/* Filter Buttons */}
      <div className="filter-container">
        {["Dogs", "Cats", "Home", "Tech", "Cars"].map((category) => (
          <button
            key={category}
            onClick={() => handleFilter(category)}
            className={`filter-button ${
              selectedCategory === category ? "active" : ""
            }`}
          >
            {category}
          </button>
        ))}
        <button
          onClick={() => handleFilter("")}
          className={`filter-button ${
            selectedCategory === "" ? "active" : ""
          }`}
        >
          All
        </button>
      </div>

      <div className="products-list">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-item">
            {/* Product Image */}
            <div className="product-image">
              <img
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                className="image"
              />
            </div>

            {/* Product Details */}
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>
                <strong>Category:</strong> {product.categories?.join(", ")}
              </p>
              <p>
                <strong>Amazon Link:</strong>{" "}
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  View Product
                </a>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                onClick={() => handleEdit(product)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 💡 Display No Products Message */}
        {currentProducts.length === 0 && (
            <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>
                No products found matching your criteria.
            </p>
        )}

      
      {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Pagination
                  // Total number of pages
                  count={totalPages}
                  // Current active page
                  page={currentPage}
                  // Event handler provided by MUI (value is the new page number)
                  onChange={(event, value) => handlePageChange(value)} 
                  // Use primary theme color
                  color="primary"
                  size="large"
              />
          </Box>
      )}

      {/* Edit Product Form */}
{editingProduct && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Edit Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={editForm.name}
        onChange={(e) =>
          setEditForm({ ...editForm, name: e.target.value })
        }
      />
      <textarea
        placeholder="Description"
        value={editForm.description}
        onChange={(e) =>
          setEditForm({ ...editForm, description: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Amazon Link"
        value={editForm.link}
        onChange={(e) =>
          setEditForm({ ...editForm, link: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Image URL"
        value={editForm.image}
        onChange={(e) =>
          setEditForm({ ...editForm, image: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Categories (comma-separated)"
        value={editForm.categories.join(", ")}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            categories: e.target.value.split(",").map((cat) => cat.trim()),
          })
        }
      />
      <div className="modal-actions">
        <button onClick={handleEditSubmit} className="save-button">
          Save
        </button>
        <button
          onClick={() => setEditingProduct(null)}
          className="cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ManageProducts1;
