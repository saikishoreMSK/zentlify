"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../app/api/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "swiper/css";
import "swiper/css/free-mode";
import "./ImageSlider.css";
import { Button } from "@mui/material";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";

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
        const bestQuery = query(
          productsRef,
          where("categories", "array-contains", "Best")
        );
        const querySnapshot = await getDocs(bestQuery);
        setFetched(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchBestSellerProducts();
  }, [usingProps]);

  if (!loading && (!products || products.length === 0)) return null;

  return (
    <section>
      <SectionHeading>Best Sellers</SectionHeading>
      {loading ? (
        <p style={{ textAlign: "center", color: "#777" }}>Loading…</p>
      ) : (
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
          {products.map((product) => (
            <SwiperSlide key={product.id} style={{ height: "auto" }}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
          <SwiperSlide
            style={{ height: "auto", display: "flex", alignItems: "center" }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push("/products")}
              sx={{ whiteSpace: "nowrap" }}
            >
              View All Products
            </Button>
          </SwiperSlide>
        </Swiper>
      )}
    </section>
  );
};

export default Bestseller;
