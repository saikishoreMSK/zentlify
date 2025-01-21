import { db } from "../../api/firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./ProductDetails.module.css";
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

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.productImage} />
      </div>
      <div className={styles.detailsContainer}>
        <h1 className={styles.productName}>{product.name}</h1>
        <p className={styles.productDescription}>{product.description}</p>
        <h2 className={styles.productPrice}>{product.price}rs</h2>
      </div>
    </div>
  );
}
