"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/api/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "swiper/css";
import "swiper/css/free-mode";
import "./ImageSlider.css";
import Link from "next/link";
import { trackClick } from "@/lib/trackClick";

const Bestseller = ({ products: productsProp }) => {
  const router = useRouter();
  const usingProps = Array.isArray(productsProp);
  const [fetched, setFetched] = useState([]);
  const [loading, setLoading] = useState(!usingProps);
  const products = usingProps ? productsProp : fetched;

  useEffect(() => {
    // Fallback: only fetch if the server didn't pass the popular list in.
    if (usingProps) return;
    const fetchBestSellerProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const bestQuery = query(productsRef, where("categories", "array-contains", "Best"));
        const querySnapshot = await getDocs(bestQuery);
        setFetched(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchBestSellerProducts();
  }, [usingProps]);

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
        {products.map((product) => {
          
          // ✂️ START OF WORD TRUNCATION LOGIC
          const productName = product.name || "";
          const wordLimit = 3;
          const words = productName.split(" ");
          const limitedName = words.slice(0, wordLimit).join(" ");
          const shouldShowEllipsis = words.length > wordLimit;
          const displayTitle = limitedName + (shouldShowEllipsis ? "..." : "");
          // ✂️ END OF WORD TRUNCATION LOGIC

          return (
            <SwiperSlide key={product.id}>
              <Link href={`/products/${product.id}`}>
                <div className="product-slide">
                  <img
                    src={product.image || "/placeholder.jpg"} // Use placeholder if no image
                    alt={product.name || "Product Image"}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="product-slide-des">
                    
                    {/* 💡 Use the truncated title here */}
                    <h1>{displayTitle || "Product Name"}</h1> 
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent link navigation on button click
                        e.preventDefault();
                        trackClick(product.id);
                        window.open(product.link, "_blank", "noopener,noreferrer");
                      }}
                    >
                      View on Amazon
                    </button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
        <SwiperSlide>
          <button
            className="swiper-button"
            onClick={() => router.push("/products")}
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
