// ImageSlider.jsx

"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "./ImageSlider.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../app/api/firebase"; // Adjust the path to match your structure
import Link from "next/link";
// 💡 MUI imports are not needed here unless you decide to replace <div> and <button> later.

const ImageSlider = () => {
  const router = useRouter();
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    // ... (Your Firebase fetch logic remains the same)
    const fetchTrendingProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("categories", "array-contains", "Trending")
        );
        const querySnapshot = await getDocs(q);

        const trending = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTrendingProducts(trending);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };

    fetchTrendingProducts();
  }, []);

  return (
    <div>
      <h1>Trending Products</h1>
      <Swiper
        slidesPerView={2.5}
        spaceBetween={10}
        grabCursor={true}
        freeMode={true}
        className="mySwiper"
      >
        {trendingProducts.map((product) => {
          
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
                  />
                  <div className="product-slide-des">
                    
                    {/* 💡 Use the truncated title here */}
                    <h1>{displayTitle || "Product Name"}</h1> 
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent link navigation on button click
                        window.open(product.link, "_blank", "noopener noreferrer");
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
    </div>
  );
};

export default ImageSlider;