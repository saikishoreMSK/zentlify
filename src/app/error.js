"use client";
// Root error boundary. Catches render/runtime errors in the route tree and
// gives the user a way to recover instead of a blank screen.

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
      <h1 style={{ fontSize: "1.6rem", fontWeight: "bold" }}>
        Something went wrong
      </h1>
      <p style={{ color: "#666", maxWidth: 480 }}>
        Sorry, an unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        style={{
          marginTop: 8,
          padding: "10px 20px",
          background: "#27ae60",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Try again
      </button>
    </div>
  );
}
