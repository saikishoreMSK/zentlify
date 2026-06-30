"use client";
// Renders a product description as clean bullet points (auto-split on sentence
// boundaries — no manual work for the admin), with a smaller font, a Show
// more/less toggle, and a scroll cap when fully expanded.

import { useState } from "react";
import { Box, Button } from "@mui/material";

function toSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .trim()
    // split after . ! ? when followed by a capital/number/quote (sentence start)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const COLLAPSED_COUNT = 3;

export default function ProductDescription({ text = "" }) {
  const [expanded, setExpanded] = useState(false);
  if (!text || !text.trim()) return null;

  const sentences = toSentences(text);
  const isLong = sentences.length > COLLAPSED_COUNT;
  const shown = expanded ? sentences : sentences.slice(0, COLLAPSED_COUNT);

  return (
    <Box>
      <Box
        component="ul"
        sx={{
          m: 0,
          pl: 2.5,
          fontSize: "0.85rem",
          color: "#444",
          lineHeight: 1.6,
          maxHeight: expanded ? 200 : "none",
          overflowY: expanded ? "auto" : "visible",
        }}
      >
        {shown.map((s, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            {s}
          </li>
        ))}
      </Box>
      {isLong && (
        <Button
          size="small"
          onClick={() => setExpanded((e) => !e)}
          sx={{ px: 0, mt: 0.5, textTransform: "none" }}
        >
          {expanded
            ? "Show less"
            : `Show more (${sentences.length - COLLAPSED_COUNT} more)`}
        </Button>
      )}
    </Box>
  );
}
