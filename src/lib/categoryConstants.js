// Plain constants shared by both server and client (no server-only imports).

// User-facing browse categories (editable from the admin).
export const DEFAULT_CATEGORIES = [
  "Home",
  "Dogs",
  "Cats",
  "Tech",
  "Cars",
  "Kids",
  "Gifts",
];

// Functional categories that drive site sections (hero / best sellers).
// Always available in the product form regardless of the editable list.
export const SPECIAL_CATEGORIES = ["Trending", "Best"];
