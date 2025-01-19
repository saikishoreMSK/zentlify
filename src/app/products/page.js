'use client';
import { useEffect, useState } from "react";
import { db } from "../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import './products.css';
import Header from "@/components/Header";
import Radio from "./components/Radio";
import styles from '../../components/Header.module.css'
import { IoIosMenu } from "react-icons/io";
import Image from 'next/image';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(
      selectedCategory === "All"
        ? results
        : results.filter((product) =>
            product.categories?.includes(selectedCategory)
          )
    );
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const filteredByCategory =
      category === "All"
        ? products
        : products.filter((product) =>
            product.categories?.includes(category)
          );

    const finalResults = searchQuery
      ? filteredByCategory.filter((product) =>
          product.name.toLowerCase().includes(searchQuery)
        )
      : filteredByCategory;

    setFilteredProducts(finalResults);
  };

  return (
    <>
      <header className={styles.header}>
            {/* Left: Logo */}
            <div className={styles.logo}>
                <Image src="/logo2.jpg" alt="Zentlify Logo" width={20} height={20} className='rounded-sm' /><span>entlify</span>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-bar"
              />
      </div>

            {/* Right: Menu Bar */}
            <div className={styles.menuBar}>
            <IoIosMenu />
            </div>
        </header>
      {/* Search Bar */}
      

      {/* Pass the handleCategoryChange function to Radio */}
      <Radio onCategoryChange={handleCategoryChange} />

      <div className="product-list">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img className="product-image" src={product.image} alt={product.name} />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">{product.price}rs</p>
            <button
              className="product-button"
              onClick={() => window.open(product.link, "_blank")}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsPage;
