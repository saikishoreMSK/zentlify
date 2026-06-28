"use client";
// Client hook: live category list from config/categories (public read), with a
// graceful fallback to the defaults.

import { useEffect, useState } from "react";
import { db } from "@/app/api/firebase";
import { doc, getDoc } from "firebase/firestore";
import { DEFAULT_CATEGORIES } from "@/lib/categoryConstants";

export function useCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "config", "categories"));
        const list = snap.exists() ? snap.data()?.list : null;
        if (active && Array.isArray(list) && list.length) setCategories(list);
      } catch {
        // keep defaults
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return categories;
}
