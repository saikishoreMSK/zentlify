// Create a promo banner. Admin-only; writes via the Admin SDK.

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdminDb } from "@/app/api/firebaseAdmin";
import { getAdminSession } from "@/lib/requireAdmin";
import { BANNERS_TAG } from "@/lib/banners";

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

  const { image, headline = "", subtext = "", link = "" } = payload;
  if (!image) {
    return NextResponse.json({ error: "image is required" }, { status: 400 });
  }

  try {
    const docRef = await getAdminDb().collection("banners").add({
      image,
      headline,
      subtext,
      link,
      active: payload.active !== false,
      order: Number(payload.order) || 0,
      createdAt: new Date().toISOString(),
    });
    revalidateTag(BANNERS_TAG);
    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("Failed to create banner:", err);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
