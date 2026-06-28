// Server-side product creation. Admin-only. Writes via the Admin SDK so the
// Firestore rules can deny all client writes.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/app/api/firebaseAdmin";
import { getAdminSession } from "@/lib/requireAdmin";
import { PRODUCTS_TAG } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { SPECIAL_CATEGORIES } from "@/lib/categoryConstants";
import { ALLOWED_BADGES, clampScore } from "@/lib/badges";

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

  const { name, description = "", link = "" } = payload;
  const allowed = new Set([...(await getCategories()), ...SPECIAL_CATEGORIES]);
  const categories = Array.isArray(payload.categories)
    ? payload.categories.filter((c) => allowed.has(c))
    : [];
  const badge = ALLOWED_BADGES.includes(payload.badge) ? payload.badge : "";

  // Support multiple images; keep `image` as the primary for back-compat.
  const images = Array.isArray(payload.images)
    ? payload.images.filter((u) => typeof u === "string" && u)
    : [];
  const image = images[0] || (typeof payload.image === "string" ? payload.image : "");
  const zentlifyScore = clampScore(payload.zentlifyScore);

  if (!name || !image) {
    return NextResponse.json(
      { error: "name and at least one image are required" },
      { status: 400 }
    );
  }

  try {
    const docRef = await getAdminDb().collection("products").add({
      name,
      description,
      link,
      image,
      images: images.length ? images : [image],
      badge,
      zentlifyScore,
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
