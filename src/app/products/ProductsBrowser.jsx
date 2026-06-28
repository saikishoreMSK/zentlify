"use client";
import { useState } from "react";
import "./products.css";
import Radio from "./components/Radio";
import Link from "next/link";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { trackClick } from "@/lib/trackClick";
import ProductBadge from "@/components/ProductBadge";

const ITEMS_PER_PAGE = 12;

function normalizeCategory(cat) {
  if (!cat || cat === "All") return "All";
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
}

// Interactive catalog UI. Receives the full product list from the server (so it
// is in the initial HTML for SEO) and handles search / category / pagination
// entirely on the client.
export default function ProductsBrowser({ initialProducts = [], initialCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(
    normalizeCategory(initialCategory)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.categories?.includes(selectedCategory);
    const matchesSearch =
      !searchQuery || (product.name || "").toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Radio onCategoryChange={handleCategoryChange} />

      <Box sx={{ p: 2, minHeight: "30vh" }}>
        <Grid container spacing={3}>
          {currentProducts.map((product) => {
            const productName = product.name || "";
            const words = productName.split(" ");
            const limitedName = words.slice(0, 3).join(" ");
            const displayTitle =
              limitedName + (words.length > 3 ? "..." : "");

            return (
              <Grid item xs={8} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 3,
                  }}
                >
                  <Link
                    href={`/products/${product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      loading="lazy"
                      sx={{
                        height: { xs: 100, sm: 150, md: 180 },
                        width: { xs: 100, sm: 150, md: 180 },
                        objectFit: "cover",
                        p: 1,
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                      {product.badge && (
                        <Box sx={{ mb: 0.5 }}>
                          <ProductBadge badge={product.badge} />
                        </Box>
                      )}
                      <Typography
                        component="h2"
                        sx={{ height: 20, overflow: "hidden", fontWeight: "bold" }}
                      >
                        {displayTitle}
                      </Typography>
                    </CardContent>
                  </Link>

                  {/* Real affiliate anchor (sibling of the product Link, not
                      nested) — crawlable, rel=sponsored, and click-tracked. */}
                  <Box sx={{ p: 1.5, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      color="primary"
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
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </>
  );
}
