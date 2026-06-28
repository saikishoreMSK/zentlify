// Server-side product data layer.
//
// All product reads for server components go through here. We fetch the whole
// catalog once (cached) and derive trending/popular/by-category in memory, so
// the homepage no longer fires several overlapping Firestore queries from the
// browser. The cache is busted via revalidateTag("products") whenever an admin
// adds/edits/deletes a product.

import { db } from "@/app/api/firebase";
import { collection, getDocs } from "firebase/firestore";
import { unstable_cache } from "next/cache";

export const PRODUCTS_TAG = "products";

async function fetchAllProducts() {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Cached across requests for 5 minutes (and busted immediately on admin writes).
export const getAllProducts = unstable_cache(fetchAllProducts, ["all-products"], {
  tags: [PRODUCTS_TAG],
  revalidate: 300,
});

export async function getProductsByCategory(category) {
  const all = await getAllProducts();
  return all.filter((p) => p.categories?.includes(category));
}

// "You may also like" — products that share at least one (non-special) category
// with the given product, excluding the product itself.
export async function getRelatedProducts(product, max = 8) {
  if (!product) return [];
  const all = await getAllProducts();
  const skip = new Set(["Trending", "Best"]);
  const cats = (product.categories || []).filter((c) => !skip.has(c));

  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categories || []).some((c) => cats.includes(c))
    )
    .slice(0, max);
}

// "Best Seller" section data: most-clicked products first, topped up with the
// manual "Best" category until enough click data has accumulated.
export async function getPopularProducts(max = 10) {
  const all = await getAllProducts();

  const popular = all
    .filter((p) => (p.clickCount || 0) > 0)
    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    .slice(0, max);

  if (popular.length < max) {
    for (const b of all.filter((p) => p.categories?.includes("Best"))) {
      if (popular.length >= max) break;
      if (!popular.some((p) => p.id === b.id)) popular.push(b);
    }
  }

  return popular;
}
