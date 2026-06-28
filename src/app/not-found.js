import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
        gap: 12,
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: 0 }}>404</h1>
      <p style={{ color: "#666" }}>
        We couldn&apos;t find the page you were looking for.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 8,
          padding: "10px 20px",
          background: "#27ae60",
          color: "#fff",
          borderRadius: 6,
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
