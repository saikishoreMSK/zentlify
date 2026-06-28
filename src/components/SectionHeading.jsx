// Consistent section heading with an amber underline accent.

export default function SectionHeading({ children, align = "center" }) {
  return (
    <div style={{ textAlign: align, margin: "32px 0 12px" }}>
      <h2
        style={{
          display: "inline-block",
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#1e1e1e",
          margin: 0,
        }}
      >
        {children}
        <span
          style={{
            display: "block",
            width: 56,
            height: 4,
            background: "#FF9900",
            borderRadius: 2,
            margin: align === "center" ? "8px auto 0" : "8px 0 0",
          }}
        />
      </h2>
    </div>
  );
}
