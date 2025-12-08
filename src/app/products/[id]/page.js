'use client'
import { db } from "../../api/firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./ProductDetails.module.css";
import Bestseller from "@/components/Bestseller";
import ImageSlider from "@/components/ImageSlider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
async function getProduct(id) {
  const productRef = doc(db, "products", id);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return null;
  }

  return productSnap.data();
}

export default async function ProductDetails({ params }) {
    const id = await params?.id;

  const product = await getProduct(id);

  if (!product) {
    return <h1 className={styles.notFound}>Product not found</h1>;
  }

  // 💡 Define a helper function to truncate the description
  const truncateDescription = (text, maxLength = 150) => {
      if (!text) return '';
      if (text.length > maxLength) {
          // Find the last space before the limit to avoid cutting a word mid-sentence
          const truncated = text.substring(0, maxLength);
          return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
      }
      return text;
  };
  const shortDescription = truncateDescription(product.description);

  return (
      <>
      <Header/>
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.productImage} />
      </div>
      <div className={styles.detailsContainer}>
        <h1 className={styles.productName}>{product.name}</h1>
        <p className={styles.productDescription}>{shortDescription}</p>
        <a href={product.link} target="_blank" rel="noopener noreferrer">
      <button className={styles.buyButton}>Buy on Amazon</button>
    </a>
      </div>
    </div>
      <ImageSlider/>
      <Bestseller/>
      <Footer/>
      </>
  );
}
