
// src/app/products/[id]/page.js
import React from "react";
import { db } from "../../api/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import styles from "./ProductDetails.module.css";

import Bestseller from "@/components/Bestseller";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import AffiliateButton from "@/components/AffiliateButton";
import ProductBadge from "@/components/ProductBadge";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import RatingStars from "@/components/RatingStars";
import SectionHeading from "@/components/SectionHeading";
import { Box } from "@mui/material";
import { getRelatedProducts, getPopularProducts } from "@/lib/products";
// import Image from "next/image"; // optional if you switch from <img> to <Image>

async function getProduct(id) {
  if (!id || typeof id !== "string") {
    console.error("Invalid product id:", id);
    return null;
  }

  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return null;
    }

    return productSnap.data();
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product not found" };
  }

  const description = truncateDescription(product.description || "", 160);
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image ? [{ url: product.image }] : [],
      type: "website",
    },
  };
}

const truncateDescription = (text = "", maxLength = 150) => {
  if (text.length > maxLength) {
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "...";
  }
  return text;
};

export default async function ProductDetails({ params }) {
  const { id } = await params; // ✅ await the promise

  const product = await getProduct(id);

  if (!product) {
    // return <h1 className={styles.notFound}>Product not found</h1>;
    return notFound();
  }

  // Related rows below the fold, fetched once on the server (no client refetch).
  const [related, popular] = await Promise.all([
    getRelatedProducts({ ...product, id }, 8),
    getPopularProducts(10),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image ? [product.image] : undefined,
    description: product.description || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <ProductGallery
            images={
              product.images?.length ? product.images : [product.image]
            }
            alt={product.name}
          />
        </div>

        <div className={styles.detailsContainer}>
          {product.badge && (
            <div>
              <ProductBadge badge={product.badge} />
            </div>
          )}
          <h1 className={styles.productName}>{product.name}</h1>
          {product.zentlifyScore ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <RatingStars
                value={product.zentlifyScore}
                size="medium"
                showNumber
              />
              <span style={{ fontSize: "0.8rem", color: "#777" }}>
                Zentlify Score
              </span>
            </div>
          ) : null}
          {product.description && (
            <p className={styles.productDescription}>{product.description}</p>
          )}

          {product.link && (
            <AffiliateButton
              productId={id}
              href={product.link}
              className={styles.buyButton}
            >
              Buy on Amazon
            </AffiliateButton>
          )}
          <p style={{ fontSize: "0.9rem", color: "#555", margin: "4px 0 0" }}>
            💰 Check the latest price on Amazon — prices update in real time.
          </p>
          <AffiliateDisclosure />
        </div>
      </div>

      {related.length > 0 && (
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, pb: 2 }}>
          <SectionHeading align="left">You may also like</SectionHeading>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(auto-fill, minmax(170px, 1fr))",
              },
              gap: 2,
            }}
          >
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Box>
        </Box>
      )}

      <Bestseller products={popular} />
    </>
  );
}
