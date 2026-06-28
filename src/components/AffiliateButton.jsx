"use client";
// A real affiliate anchor (crawlable, rel="sponsored") that records a click on
// the way out. Use this for "Buy on Amazon" CTAs.

import { trackClick } from "@/lib/trackClick";

export default function AffiliateButton({ productId, href, className, style, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
      style={style}
      onClick={() => trackClick(productId)}
    >
      {children}
    </a>
  );
}
