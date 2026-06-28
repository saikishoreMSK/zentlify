'use client';
import { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Box,
  Pagination,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Rating,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ALLOWED_BADGES } from "@/lib/badges";
import { useToast } from "@/components/ToastProvider";
import { uploadToCloudinary } from "@/lib/uploadImage";
import { useCategories } from "@/lib/useCategories";
import { SPECIAL_CATEGORIES } from "@/lib/categoryConstants";
import "./ManageProducts.css";

const ITEMS_PER_PAGE = 10;

const ManageProducts1 = () => {
  const toast = useToast();
  const categoryList = useCategories();
  const CATEGORIES = [...categoryList, ...SPECIAL_CATEGORIES];
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("clicks");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    categories: [],
    description: "",
    link: "",
    images: [],
    badge: "",
    zentlifyScore: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setFilteredProducts(productList);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This also removes its image.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Failed to delete product");
      }
      setProducts((p) => p.filter((product) => product.id !== id));
      setFilteredProducts((p) => p.filter((product) => product.id !== id));
      toast("Product deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast(error.message || "Error deleting product", "error");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProducts(
      products.filter((product) =>
        (product.name || "").toLowerCase().includes(query)
      )
    );
    setCurrentPage(1);
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    setFilteredProducts(
      category
        ? products.filter((product) => product.categories?.includes(category))
        : products
    );
    setCurrentPage(1);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      categories: product.categories || [],
      description: product.description || "",
      link: product.link || "",
      images: product.images?.length
        ? product.images
        : product.image
        ? [product.image]
        : [],
      badge: product.badge || "",
      zentlifyScore: product.zentlifyScore || 0,
    });
  };

  const handleEditUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    event.target.value = "";
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) urls.push(await uploadToCloudinary(file));
      setEditForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      toast(`${urls.length} image(s) uploaded`, "success");
    } catch (error) {
      toast(error.message || "Error uploading image", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeEditImage = (index) =>
    setEditForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));

  const makeEditPrimary = (index) =>
    setEditForm((f) => {
      const next = [...f.images];
      const [picked] = next.splice(index, 1);
      return { ...f, images: [picked, ...next] };
    });

  const toggleEditCategory = (category) =>
    setEditForm((f) => ({
      ...f,
      categories: f.categories.includes(category)
        ? f.categories.filter((c) => c !== category)
        : [...f.categories, category],
    }));

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Failed to update product");
      }
      const merged = {
        ...editForm,
        image: editForm.images[0] || "",
      };
      const updated = products.map((product) =>
        product.id === editingProduct.id ? { ...product, ...merged } : product
      );
      setProducts(updated);
      setFilteredProducts(updated);
      toast("Product updated successfully!", "success");
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      toast(error.message || "Error updating product", "error");
    }
  };

  // Sort then paginate.
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "clicks") return (b.clickCount || 0) - (a.clickCount || 0);
    if (sortBy === "newest")
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="manage-products-container">
      <input
        type="text"
        placeholder="Search by product name..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      <div className="filter-container">
        {["Dogs", "Cats", "Home", "Tech", "Cars"].map((category) => (
          <button
            key={category}
            onClick={() => handleFilter(category)}
            className={`filter-button ${
              selectedCategory === category ? "active" : ""
            }`}
          >
            {category}
          </button>
        ))}
        <button
          onClick={() => handleFilter("")}
          className={`filter-button ${selectedCategory === "" ? "active" : ""}`}
        >
          All
        </button>
      </div>

      <Box sx={{ my: 2, maxWidth: 220 }}>
        <TextField
          select
          size="small"
          fullWidth
          label="Sort by"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
        >
          <MenuItem value="clicks">Most clicked</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="name">Name (A–Z)</MenuItem>
        </TextField>
      </Box>

      <div className="products-list">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-item">
            <div className="product-image">
              <img
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                className="image"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="product-details">
              <h3>{product.name}</h3>
              <p>
                <strong>👆 Clicks:</strong> {product.clickCount || 0}
                {product.zentlifyScore ? `  •  ⭐ ${product.zentlifyScore}/5` : ""}
                {product.badge ? `  •  🏷️ ${product.badge}` : ""}
              </p>
              <p>
                <strong>Category:</strong> {product.categories?.join(", ")}
              </p>
              <p>
                <strong>Amazon Link:</strong>{" "}
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  View Product
                </a>
              </p>
            </div>

            <div className="product-actions">
              <button onClick={() => openEdit(product)} className="edit-button">
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {currentProducts.length === 0 && (
        <p style={{ textAlign: "center", width: "100%", padding: "20px" }}>
          No products found matching your criteria.
        </p>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => handlePageChange(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Edit dialog */}
      <Dialog
        open={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Product</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {/* Images */}
            <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 1.5 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
                {editForm.images.map((url, i) => (
                  <Box
                    key={url}
                    sx={{
                      position: "relative",
                      width: 84,
                      height: 84,
                      border: i === 0 ? "2px solid #FF9900" : "1px solid #e0e0e0",
                      borderRadius: 1,
                      overflow: "hidden",
                      bgcolor: "#fff",
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`Image ${i + 1}`}
                      sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeEditImage(i)}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        bgcolor: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        p: 0.25,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                    {i === 0 ? (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          bgcolor: "#FF9900",
                          color: "#1e1e1e",
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        PRIMARY
                      </Box>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => makeEditPrimary(i)}
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          fontSize: "0.55rem",
                          bgcolor: "rgba(0,0,0,0.55)",
                          color: "#fff",
                          borderRadius: 0,
                          minHeight: 0,
                          py: 0.2,
                          "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
                        }}
                      >
                        Primary
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
              <Button
                component="label"
                size="small"
                variant="outlined"
                startIcon={
                  uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />
                }
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "Add image(s)"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleEditUpload}
                />
              </Button>
            </Box>

            <TextField
              label="Product name"
              fullWidth
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
            <TextField
              label="Amazon link"
              fullWidth
              value={editForm.link}
              onChange={(e) =>
                setEditForm({ ...editForm, link: e.target.value })
              }
            />
            <TextField
              select
              label="Badge"
              fullWidth
              value={editForm.badge}
              onChange={(e) =>
                setEditForm({ ...editForm, badge: e.target.value })
              }
            >
              <MenuItem value="">No badge</MenuItem>
              {ALLOWED_BADGES.map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>
                Zentlify Score
              </Typography>
              <Rating
                value={Number(editForm.zentlifyScore) || 0}
                precision={0.5}
                onChange={(_e, v) =>
                  setEditForm({ ...editForm, zentlifyScore: v || 0 })
                }
                emptyIcon={
                  <StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />
                }
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Categories
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {CATEGORIES.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    clickable
                    color={
                      editForm.categories.includes(category)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      editForm.categories.includes(category)
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() => toggleEditCategory(category)}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditingProduct(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageProducts1;
