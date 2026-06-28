"use client";
import React from "react";
import Link from "next/link";
import { Box, Chip } from "@mui/material";

// Keep in sync with the filter options in products/components/Radio.jsx so
// every category link actually returns results.
const categories = ["Home", "Dogs", "Cats", "Tech", "Cars", "Kids", "Gifts"];

const Categories = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        justifyContent: "center",
        px: 2,
        py: 2.5,
      }}
    >
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          component={Link}
          href={`/products?category=${category}`}
          clickable
          sx={{
            fontWeight: 600,
            px: 1,
            bgcolor: "#fff",
            border: "1px solid #e3e3e3",
            "&:hover": { bgcolor: "#FF9900", color: "#1e1e1e" },
          }}
        />
      ))}
    </Box>
  );
};

export default Categories;
