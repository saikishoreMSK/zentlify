// Fire-and-forget affiliate click tracking. Uses sendBeacon so it survives the
// page navigating away to Amazon, and never delays that navigation.

export function trackClick(productId) {
  if (!productId || typeof navigator === "undefined") return;
  const url = `/api/products/${productId}/click`;
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      fetch(url, { method: "POST", keepalive: true });
    }
  } catch {
    // ignore — analytics must never break the click-through
  }
}
