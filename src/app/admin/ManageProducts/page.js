'use client';
import { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "./ManageProducts.css";

const ManageProducts1 = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
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
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
      setFilteredProducts(filteredProducts.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(results);
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
      const docRef = doc(db, "products", editingProduct.id);
      await updateDoc(docRef, editForm);
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id ? { ...product, ...editForm } : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      alert("Product updated successfully!");
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
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
        {filteredProducts.map((product) => (
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
                <strong>Description:</strong> {product.description}
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
