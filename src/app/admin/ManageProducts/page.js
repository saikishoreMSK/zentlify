'use client';
import { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Products</h1>
      <div>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            {/* Product Image */}
            <div style={{ flex: "0 0 50px", marginRight: "10px" }}>
              <img
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
              />
            </div>

            {/* Product Details */}
            <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
              <h3 style={{ margin: "0", fontSize: "18px" }}>{product.name}</h3>
              <p style={{ margin: "5px 0", color: "#555" }}>
                <strong>Category:</strong> {product.categories?.join(", ")}
              </p>

              <p style={{ margin: "5px 0", color: "#555" }}>
                <strong>Amazon Link:</strong>{" "}
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  View Product
                </a>
              </p>
            </div>

            {/* Delete Button */}
            <div>
              <button
                onClick={() => handleDelete(product.id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
