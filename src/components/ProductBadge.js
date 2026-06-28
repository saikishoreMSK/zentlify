// Small editorial badge chip (e.g. "Editor's Pick"). Renders nothing if the
// product has no badge. Dependency-free so it works in any context.

import { BADGE_COLORS } from "@/lib/badges";

export default function ProductBadge({ badge, style }) {
  if (!badge) return null;
  const colors = BADGE_COLORS[badge] || { bg: "#333", fg: "#fff" };

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: colors.bg,
        color: colors.fg,
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.02em",
        padding: "3px 8px",
        borderRadius: 999,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {badge}
    </span>
  );
}
