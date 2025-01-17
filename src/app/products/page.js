'use client'
import { useEffect, useState } from "react";
import { db } from "../api/firebase";
import { collection, getDocs } from "firebase/firestore";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <img src={product.image} alt={product.name} height='80px' width='80px'/>
          <h2>{product.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
