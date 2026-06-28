// Admin-only endpoint that returns a short-lived signed-upload payload so the
// admin's browser can upload an image directly to Cloudinary without exposing
// the API secret or relying on a public unsigned preset.

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/requireAdmin";
import { buildUploadSignature } from "@/lib/cloudinary";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(buildUploadSignature());
  } catch (err) {
    console.error("Failed to build upload signature:", err);
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 500 }
    );
  }
}
