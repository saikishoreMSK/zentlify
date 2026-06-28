"use client";
// Read-only editorial "Zentlify Score" stars. Renders nothing when unrated.

import { Rating, Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function RatingStars({ value, size = "small", showNumber = false }) {
  const v = Number(value) || 0;
  if (!v) return null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Rating
        value={v}
        precision={0.5}
        readOnly
        size={size}
        emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
      />
      {showNumber && (
        <Typography variant="caption" color="text.secondary">
          {v.toFixed(1)}
        </Typography>
      )}
    </Box>
  );
}
