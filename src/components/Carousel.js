"use client";
import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../app/api/firebase"; // Adjust the path to match your structure
import Link from "next/link";
import "./Components.css";

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 2000 })]);
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    // Fetch Trending Products from Firebase
    const fetchTrendingProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("categories", "array-contains", "Trending"));
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
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {trendingProducts.map((product) => (
          <div className="embla__slide" key={product.id}>
            <Link href={`/products/${product.id}`}>
              <div className="embla-product-slide">
                <Image
                  src={product.image || "/placeholder.jpg"} // Use placeholder if no image
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                  priority
                  alt={product.name || "Product Image"}
                />
                <div className="embla-product-details">
                  <h1>{product.name || "Product Name"}</h1>
                  <p>{product.price ? `${product.price}rs` : "Price not available"}</p>
                </div>
                
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
