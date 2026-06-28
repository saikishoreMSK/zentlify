// Required affiliate disclosure (FTC + Amazon Associates Operating Agreement).
// Lightweight and dependency-free so it can be dropped in anywhere — next to a
// Buy button, in the footer, etc.

export default function AffiliateDisclosure({ style }) {
  return (
    <p
      style={{
        fontSize: "0.78rem",
        lineHeight: 1.4,
        color: "#777",
        margin: "8px 0",
        ...style,
      }}
    >
      As an Amazon Associate, Zentlify earns from qualifying purchases.
    </p>
  );
}
