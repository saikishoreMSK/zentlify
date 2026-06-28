// Client helper: upload one file to Cloudinary using a server-signed payload.
// The API secret never reaches the browser. Returns the https secure_url.

export async function uploadToCloudinary(file) {
  const sigRes = await fetch("/api/upload-signature", { method: "POST" });
  if (!sigRes.ok) throw new Error("Could not authorize upload");
  const { cloudName, apiKey, timestamp, folder, signature } = await sigRes.json();

  const data = new FormData();
  data.append("file", file);
  data.append("api_key", apiKey);
  data.append("timestamp", timestamp);
  data.append("folder", folder);
  data.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: data }
  );
  const uploaded = await res.json();
  if (!res.ok || !uploaded.secure_url) {
    throw new Error(uploaded.error?.message || "Upload failed");
  }
  return uploaded.secure_url;
}
