// Update the editable category list (config/categories). Admin-only.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/app/api/firebaseAdmin";
import { getAdminSession } from "@/lib/requireAdmin";
import { CATEGORIES_TAG } from "@/lib/categories";
import { PRODUCTS_TAG } from "@/lib/products";

export async function PUT(request) {
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

  if (!Array.isArray(payload.list)) {
    return NextResponse.json({ error: "list must be an array" }, { status: 400 });
  }

  // Clean: trim, drop empties, dedupe (case-insensitive), cap length.
  const seen = new Set();
  const list = [];
  for (const raw of payload.list) {
    if (typeof raw !== "string") continue;
    const name = raw.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(name);
    if (list.length >= 40) break;
  }

  try {
    await getAdminDb()
      .collection("config")
      .doc("categories")
      .set({ list, updatedAt: new Date().toISOString() });
    revalidateTag(CATEGORIES_TAG);
    revalidateTag(PRODUCTS_TAG); // category pages depend on it
    return NextResponse.json({ list });
  } catch (err) {
    console.error("Failed to save categories:", err);
    return NextResponse.json(
      { error: "Failed to save categories" },
      { status: 500 }
    );
  }
}
