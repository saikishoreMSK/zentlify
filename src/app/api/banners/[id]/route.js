// Update / delete a promo banner. Admin-only.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/app/api/firebaseAdmin";
import { getAdminSession } from "@/lib/requireAdmin";
import { BANNERS_TAG } from "@/lib/banners";
import { deleteCloudinaryImage, publicIdFromUrl } from "@/lib/cloudinary";

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

  const update = {};
  if (typeof payload.image === "string") update.image = payload.image;
  if (typeof payload.headline === "string") update.headline = payload.headline;
  if (typeof payload.subtext === "string") update.subtext = payload.subtext;
  if (typeof payload.link === "string") update.link = payload.link;
  if (typeof payload.active === "boolean") update.active = payload.active;
  if (typeof payload.order !== "undefined") update.order = Number(payload.order) || 0;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  try {
    await getAdminDb().collection("banners").doc(id).update(update);
    revalidateTag(BANNERS_TAG);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Failed to update banner:", err);
    return NextResponse.json(
      { error: "Failed to update banner" },
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
    const docRef = getAdminDb().collection("banners").doc(id);
    const snap = await docRef.get();
    if (snap.exists) {
      const publicId = publicIdFromUrl(snap.data()?.image);
      if (publicId) await deleteCloudinaryImage(publicId);
    }
    await docRef.delete();
    revalidateTag(BANNERS_TAG);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Failed to delete banner:", err);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
