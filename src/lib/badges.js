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

// Display colors per badge (background, text).
export const BADGE_COLORS = {
  "Editor's Pick": { bg: "#6c5ce7", fg: "#fff" },
  "Top Rated": { bg: "#0984e3", fg: "#fff" },
  "Hot Deal": { bg: "#e17055", fg: "#fff" },
  "Limited Time": { bg: "#d63031", fg: "#fff" },
};
