// Server-side reader for homepage promo banners. Cached and busted via
// revalidateTag("banners") when an admin changes a banner.

import { db } from "@/app/api/firebase";
import { collection, getDocs } from "firebase/firestore";
import { unstable_cache } from "next/cache";

export const BANNERS_TAG = "banners";

async function fetchBanners() {
  const snap = await getDocs(collection(db, "banners"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export const getAllBanners = unstable_cache(fetchBanners, ["all-banners"], {
  tags: [BANNERS_TAG],
  revalidate: 300,
});

// Active banners, ordered. Returns [] on any error (e.g. before the Firestore
// rules are published) so the homepage just falls back to the trending hero.
export async function getActiveBanners() {
  try {
    const all = await getAllBanners();
    return all
      .filter((b) => b.active !== false && b.image)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.error("Failed to load banners:", err);
    return [];
  }
}
