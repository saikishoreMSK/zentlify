"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "./ImageSlider.css";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../app/api/firebase";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";

const ImageSlider = ({ products: productsProp }) => {
  const usingProps = Array.isArray(productsProp);
  const [fetched, setFetched] = useState([]);
  const trendingProducts = usingProps ? productsProp : fetched;

  useEffect(() => {
    // Fallback: only fetch if the server didn't pass data in.
    if (usingProps) return;
    const fetchTrendingProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(
          productsRef,
          where("categories", "array-contains", "Trending")
        );
        const querySnapshot = await getDocs(q);
        setFetched(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };
    fetchTrendingProducts();
  }, [usingProps]);

  if (!trendingProducts || trendingProducts.length === 0) return null;

  return (
    <section>
      <SectionHeading>Trending Products</SectionHeading>
      <Swiper
        slidesPerView={2.2}
        spaceBetween={16}
        grabCursor={true}
        freeMode={true}
        breakpoints={{
          640: { slidesPerView: 3.5 },
          1024: { slidesPerView: 5.5 },
          1400: { slidesPerView: 6.5 },
        }}
        className="mySwiper"
        style={{ padding: "0 16px 24px" }}
      >
        {trendingProducts.map((product) => (
          <SwiperSlide key={product.id} style={{ height: "auto" }}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ImageSlider;
