// Server-side category list (admin-editable, stored in config/categories).
// Falls back to defaults when missing or unreadable.

import { db } from "@/app/api/firebase";
import { doc, getDoc } from "firebase/firestore";
import { unstable_cache } from "next/cache";
import { DEFAULT_CATEGORIES } from "@/lib/categoryConstants";

export const CATEGORIES_TAG = "categories";

async function fetchCategories() {
  try {
    const snap = await getDoc(doc(db, "config", "categories"));
    const list = snap.exists() ? snap.data()?.list : null;
    return Array.isArray(list) && list.length ? list : DEFAULT_CATEGORIES;
  } catch (err) {
    console.error("Failed to load categories:", err);
    return DEFAULT_CATEGORIES;
  }
}

export const getCategories = unstable_cache(fetchCategories, ["site-categories"], {
  tags: [CATEGORIES_TAG],
  revalidate: 300,
});
