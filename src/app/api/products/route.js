// Server-side product creation. Admin-only. Writes via the Admin SDK so the
// Firestore rules can deny all client writes.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/app/api/firebaseAdmin";
import { getAdminSession } from "@/lib/requireAdmin";
import { PRODUCTS_TAG } from "@/lib/products";
import { ALLOWED_BADGES } from "@/lib/badges";

const ALLOWED_CATEGORIES = [
  "Dogs",
  "Cats",
  "Home",
  "Tech",
  "Cars",
  "Trending",
  "Best",
];

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, description = "", link = "", image } = payload;
  const categories = Array.isArray(payload.categories)
    ? payload.categories.filter((c) => ALLOWED_CATEGORIES.includes(c))
    : [];
  const badge = ALLOWED_BADGES.includes(payload.badge) ? payload.badge : "";

  if (!name || !image) {
    return NextResponse.json(
      { error: "name and image are required" },
      { status: 400 }
    );
  }

  try {
    const docRef = await getAdminDb().collection("products").add({
      name,
      description,
      link,
      image,
      badge,
      categories,
      clickCount: 0,
      createdAt: new Date().toISOString(),
    });
    revalidateTag(PRODUCTS_TAG);
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("Failed to create product:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
