"use client";
import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../app/api/firebase"; // Adjust the path to match your structure
import Link from "next/link";
import "./Components.css";
import { Box, Typography, Card, CardMedia, CardContent, Button } from "@mui/material"; 
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export function EmblaCarousel({ products: productsProp }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 2000 })]);
  const usingProps = Array.isArray(productsProp);
  const [fetched, setFetched] = useState([]);
  const trendingProducts = usingProps ? productsProp : fetched;

  useEffect(() => {
    // Fallback: only fetch if the server didn't pass data in.
    if (usingProps) return;
    const fetchTrendingProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("categories", "array-contains", "Trending"));
        const querySnapshot = await getDocs(q);
        setFetched(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching trending products:", error);
      }
    };
    fetchTrendingProducts();
  }, [usingProps]);

 return (
    <Box className="embla" ref={emblaRef} sx={{ mb: 4, overflow: 'hidden' }}>
      <div className="embla__container">
        {trendingProducts.map((product) => {
          
          // 💡 START OF CORRECT JAVASCRIPT LOGIC BLOCK
          const productName = product.name || "";
          
          // Split the name, take the first 3 words, and join them back.
          const wordLimit = 3;
          const words = productName.split(' ');
          const limitedName = words.slice(0, wordLimit).join(' ');

          // Check if the original name was longer than the limit to append an ellipsis.
          const shouldShowEllipsis = words.length > wordLimit;

          // The final displayed text
          const displayTitle = limitedName + (shouldShowEllipsis ? '...' : '');
          // 💡 END OF CORRECT JAVASCRIPT LOGIC BLOCK

          return ( // <-- Explicit return for the JSX element
            <div className="embla__slide" key={product.id}>
              <Link href={`/products/${product.id}`} passHref>
                <Card className="embla-product-card">
                  
                  {/* Product Image Container */}
                  <Box className="embla-image-container">
                    <Image
                      src={product.image || "/placeholder.jpg"}
                      width={1200} 
                      height={600}
                      priority
                      alt={product.name || "Product Image"}
                    />
                  </Box>
                  
                  {/* Product Details Overlay */}
                  <Box className="embla-details-overlay">
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      sx={{ mb: 1, fontWeight: 700 }}
                      className="embla-product-title"
                    >
                      {displayTitle || "Product Name"} {/* 💡 USE displayTitle HERE */}
                    </Typography>

                    {/* MUI Button for Call-to-Action */}
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ mt: 2 }}
                    >
                      Shop Now
                    </Button>
                  </Box>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>
    </Box>
  );
}
