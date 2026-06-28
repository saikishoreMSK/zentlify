"use client";
// The single, canonical product card used across the grid and the sliders so
// every product looks identical site-wide.

import Link from "next/link";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ProductBadge from "@/components/ProductBadge";
import RatingStars from "@/components/RatingStars";
import { trackClick } from "@/lib/trackClick";

export default function ProductCard({ product }) {
  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxShadow: 3,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      {product.badge && (
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
          <ProductBadge badge={product.badge} />
        </Box>
      )}

      <Box
        component={Link}
        href={`/products/${product.id}`}
        sx={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        {/* Fixed 1:1 frame so every product image occupies the exact same area,
            centered with object-fit: contain (no cropping, no jumpy sizes). */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            bgcolor: "#fff",
            borderBottom: "1px solid #f2f2f2",
          }}
        >
          <Box
            component="img"
            src={product.image || "/placeholder.jpg"}
            alt={product.name || "Product"}
            loading="lazy"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              p: 1.5,
            }}
          />
        </Box>
        <CardContent sx={{ p: 1.5, pb: 1 }}>
          <Typography
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: "0.9rem",
              lineHeight: 1.4,
              height: "2.52em", // exactly two lines, always
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name || "Product"}
          </Typography>
          <Box sx={{ mt: 0.5, minHeight: 20 }}>
            <RatingStars value={product.zentlifyScore} />
          </Box>
        </CardContent>
      </Box>

      <Box sx={{ p: 1.5, pt: 0, mt: "auto" }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="small"
          endIcon={<ShoppingCartIcon />}
          component="a"
          href={product.link}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={() => trackClick(product.id)}
        >
          Buy on Amazon
        </Button>
      </Box>
    </Card>
  );
}
