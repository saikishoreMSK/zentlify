"use client";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader";

// Branded intro overlay that sits on top of the (already-rendered) page for a
// few seconds, then disappears. Kept as a small client island so the homepage
// itself can be a Server Component.
export default function IntroOverlay() {
  const [intro, setIntro] = useState("loader"); // "loader" | "video" | "done"

  useEffect(() => {
    const t1 = setTimeout(() => setIntro("video"), 1000);
    const t2 = setTimeout(() => setIntro("done"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (intro === "done") return null;

  return (
    <div className="intro-overlay">
      {intro === "loader" ? (
        <Loader />
      ) : (
        <div className="video-container">
          <video src="/zentlify-logo.mp4" autoPlay muted className="logo-video" />
        </div>
      )}
    </div>
  );
}
