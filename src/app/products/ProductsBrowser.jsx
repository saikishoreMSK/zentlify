"use client";
import { useState } from "react";
import "./products.css";
import Radio from "./components/Radio";
import { Grid, Box, Pagination, Typography } from "@mui/material";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";

const ITEMS_PER_PAGE = 12;

function normalizeCategory(cat) {
  if (!cat || cat === "All") return "All";
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
}

// Interactive catalog UI. Receives the full product list from the server (so it
// is in the initial HTML for SEO) and handles search / category / pagination
// entirely on the client.
export default function ProductsBrowser({
  initialProducts = [],
  initialCategory,
  initialSearch = "",
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    normalizeCategory(initialCategory)
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch.toLowerCase());
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
      <SectionHeading>
        {selectedCategory === "All" ? "All Products" : selectedCategory}
      </SectionHeading>
      <Radio onCategoryChange={handleCategoryChange} />

      <Box sx={{ p: 2, minHeight: "30vh", maxWidth: 1200, mx: "auto" }}>
        {currentProducts.length === 0 ? (
          <Typography sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
            No products found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {currentProducts.map((product) => (
              <Grid item xs={6} sm={4} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
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
