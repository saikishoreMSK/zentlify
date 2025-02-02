"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { db } from "../app/api/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import "swiper/css";
import "swiper/css/free-mode";
import "./ImageSlider.css";
import Link from "next/link";

const Bestseller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const bestQuery = query(productsRef, where("categories", "array-contains", "Best"));
        const querySnapshot = await getDocs(bestQuery);
        
        const productsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched Best Products:", productsData); // Debugging
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchBestSellerProducts();
  }, []);

  return (
    <div>
      <h1>Best Seller</h1>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No Best Seller products available.</p>
      ) : (
        <Swiper
          slidesPerView={2.5}
          spaceBetween={10}
          grabCursor={true}
          freeMode={true}
          className="mySwiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Link href={`/products/${product.id}`}>
              <div className="product-slide">
                <img
                  src={product.image || "/placeholder.jpg"} // Placeholder image
                  alt={product.name || "Product"}
                />
                <div className="product-slide-des">
                  <h1>{product.name || "Product Name"}</h1>
                  <h4>{product.price ? `${product.price}rs` : "Price not available"}</h4>
                  <button onClick={() => window.open(product.link, "_blank")}>
                    View on Amazon
                  </button>
                </div>
              </div>
              </Link>
            </SwiperSlide>
          ))}
          <SwiperSlide>
            <button
              className="swiper-button"
              onClick={() => alert("Redirecting to all products!")}
            >
              View All Products
            </button>
          </SwiperSlide>
        </Swiper>
      )}
    </div>
  );
};

export default Bestseller;
