"use client";
// Product image gallery: a main 1:1 image with a thumbnail strip. Falls back to
// a single image gracefully.

import { useState } from "react";
import { Box } from "@mui/material";

export default function ProductGallery({ images = [], alt = "" }) {
  const valid = images.filter(Boolean);
  const [active, setActive] = useState(0);

  if (valid.length === 0) return null;
  const main = valid[Math.min(active, valid.length - 1)];

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          bgcolor: "#fff",
          border: "1px solid #eee",
          borderRadius: 2,
        }}
      >
        <Box
          component="img"
          src={main}
          alt={alt}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            p: 2,
          }}
        />
      </Box>

      {valid.length > 1 && (
        <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
          {valid.map((url, i) => (
            <Box
              key={url}
              component="button"
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              sx={{
                width: 64,
                height: 64,
                p: 0,
                cursor: "pointer",
                bgcolor: "#fff",
                border: i === active ? "2px solid #FF9900" : "1px solid #ddd",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={url}
                alt=""
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
