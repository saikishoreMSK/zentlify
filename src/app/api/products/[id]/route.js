// Server-side product update/delete. Admin-only.

import { NextResponse } from "next/server";
import { getAdminDb } from "@/app/api/firebaseAdmin";
import { getAdminSession } from "@/lib/requireAdmin";
import { deleteCloudinaryImage, publicIdFromUrl } from "@/lib/cloudinary";

const ALLOWED_CATEGORIES = [
  "Dogs",
  "Cats",
  "Home",
  "Tech",
  "Cars",
  "Trending",
  "Best",
];

export async function PUT(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Only allow known fields to be updated.
  const update = {};
  if (typeof payload.name === "string") update.name = payload.name;
  if (typeof payload.description === "string")
    update.description = payload.description;
  if (typeof payload.link === "string") update.link = payload.link;
  if (typeof payload.image === "string") update.image = payload.image;
  if (typeof payload.price !== "undefined") update.price = payload.price;
  if (Array.isArray(payload.categories)) {
    update.categories = payload.categories.filter((c) =>
      ALLOWED_CATEGORIES.includes(c)
    );
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  try {
    await getAdminDb().collection("products").doc(id).update(update);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Failed to update product:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const docRef = getAdminDb().collection("products").doc(id);
    const snap = await docRef.get();

    // Best-effort cleanup of the Cloudinary image before removing the doc.
    if (snap.exists) {
      const publicId = publicIdFromUrl(snap.data()?.image);
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      }
    }

    await docRef.delete();
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Failed to delete product:", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
