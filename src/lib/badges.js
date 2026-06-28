// Qualitative product badges (shared by admin UI and the write API).
//
// We deliberately do NOT show manual numeric prices — Amazon's Operating
// Agreement restricts displaying prices that can go stale. Instead, products
// can carry an editorial badge, and the CTA points users to check the live
// price on Amazon.

export const ALLOWED_BADGES = [
  "Editor's Pick",
  "Top Rated",
  "Hot Deal",
  "Limited Time",
];

// Clamp an editorial "Zentlify Score" rating to 0–5 in 0.5 steps.
export function clampScore(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(5, Math.round(n * 2) / 2);
}

// Display colors per badge (background, text).
export const BADGE_COLORS = {
  "Editor's Pick": { bg: "#6c5ce7", fg: "#fff" },
  "Top Rated": { bg: "#0984e3", fg: "#fff" },
  "Hot Deal": { bg: "#e17055", fg: "#fff" },
  "Limited Time": { bg: "#d63031", fg: "#fff" },
};
