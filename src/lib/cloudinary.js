// Server-side Cloudinary helpers. The API secret lives only here and must never
// reach the browser.

import crypto from "crypto";

// Extract the Cloudinary public_id (including any folder) from a stored URL like
//   https://res.cloudinary.com/<cloud>/image/upload/v123456/folder/name.jpg
// -> "folder/name". Returns null if the URL isn't a recognizable Cloudinary URL.
export function publicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}

// Build a signed-upload payload for the browser. The browser then uploads the
// file directly to Cloudinary with this signature, so the API secret never
// leaves the server and the public unsigned preset is no longer needed.
export function buildUploadSignature(folder = "zentlify") {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  // Signature must cover exactly the params sent (excluding file, api_key,
  // cloud_name, resource_type), sorted alphabetically.
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return { cloudName, apiKey, timestamp, folder, signature };
}

// Delete an image from Cloudinary by public_id. Returns true on success.
export async function deleteCloudinaryImage(publicId) {
  if (!publicId) return false;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Cloudinary credentials are not configured.");
    return false;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const body = new URLSearchParams({
    public_id: publicId,
    api_key: apiKey,
    timestamp: String(timestamp),
    signature,
  });

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: "POST", body }
    );
    const data = await res.json();
    return data.result === "ok";
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
    return false;
  }
}
