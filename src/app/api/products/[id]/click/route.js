// Public endpoint that records an affiliate click (fire-and-forget from the
// browser via navigator.sendBeacon). Increments the product's clickCount, which
// powers the click-driven "Best Seller" section. Intentionally unauthenticated;
// it can only bump a counter.

import { NextResponse } from "next/server";
import { getAdminDb } from "@/app/api/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request, { params }) {
  const { id } = await params;

  try {
    await getAdminDb()
      .collection("products")
      .doc(id)
      .update({ clickCount: FieldValue.increment(1) });
  } catch (err) {
    // Non-critical — never block the user's trip to Amazon over analytics.
    console.error("click tracking failed:", err);
  }

  return new NextResponse(null, { status: 204 });
}
