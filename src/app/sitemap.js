import { db } from "./api/firebase";
import { collection, getDocs } from "firebase/firestore";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zentlify.com";

export default async function sitemap() {
  const staticRoutes = ["", "/products", "/about", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  let productRoutes = [];
  try {
    const snapshot = await getDocs(collection(db, "products"));
    productRoutes = snapshot.docs.map((doc) => ({
      url: `${siteUrl}/products/${doc.id}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (err) {
    // If Firestore is unreachable at build/request time, still return the
    // static routes rather than failing the whole sitemap.
    console.error("sitemap: failed to load products", err);
  }

  return [...staticRoutes, ...productRoutes];
}
