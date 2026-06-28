
// src/app/products/[id]/page.js
import React from "react";
import { db } from "../../api/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import styles from "./ProductDetails.module.css";

import Header from "@/components/Header";
import ImageSlider from "@/components/ImageSlider";
import Bestseller from "@/components/Bestseller";
import Footer from "@/components/Footer";
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

  const shortDescription = truncateDescription(product.description);

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
      <Header />
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          {/* If you stay with <img>, ensure product.image is a valid URL */}
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImage}
          />
          {/* Or with next/image:
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            className={styles.productImage}
            priority
          />
          */}
        </div>

        <div className={styles.detailsContainer}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productDescription}>{shortDescription}</p>

          {product.link && (
            <a
              href={product.link}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
            >
              <button className={styles.buyButton}>Buy on Amazon</button>
            </a>
          )}
        </div>
      </div>

      <ImageSlider />
      <Bestseller />
      <Footer />
    </>
  );
}
