"use client";
import { useState } from "react";
import { ALLOWED_BADGES } from "@/lib/badges";
import { useToast } from "@/components/ToastProvider";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Chip,
  Typography,
  Stack,
  CircularProgress,
  Rating,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import { uploadToCloudinary } from "@/lib/uploadImage";
import { useCategories } from "@/lib/useCategories";
import { SPECIAL_CATEGORIES } from "@/lib/categoryConstants";

const AddProduct = () => {
  const toast = useToast();
  const categoryList = useCategories();
  const CATEGORIES = [...categoryList, ...SPECIAL_CATEGORIES];
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [score, setScore] = useState(0);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    link: "",
    badge: "",
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    event.target.value = ""; // allow re-selecting the same file later

    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        urls.push(await uploadToCloudinary(file));
      }
      setImages((prev) => [...prev, ...urls]);
      toast(`${urls.length} image(s) uploaded`, "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast(error.message || "Error uploading image", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const makePrimary = (index) =>
    setImages((prev) => {
      const next = [...prev];
      const [picked] = next.splice(index, 1);
      return [picked, ...next];
    });

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || images.length === 0) {
      toast("Please provide a product name and at least one image.", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          categories: selectedCategories,
          images,
          zentlifyScore: score,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to add product");

      toast("Product added successfully!", "success");
      setProduct({ name: "", description: "", link: "", badge: "" });
      setSelectedCategories([]);
      setImages([]);
      setScore(0);
    } catch (error) {
      console.error("Error adding product:", error);
      toast(error.message || "Error adding product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 680 }}>
      <Stack spacing={2.5}>
        {/* Image upload + previews */}
        <Box sx={{ border: "2px dashed #ccc", borderRadius: 2, p: 2.5 }}>
          {images.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
              {images.map((url, i) => (
                <Box
                  key={url}
                  sx={{
                    position: "relative",
                    width: 96,
                    height: 96,
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
                    onClick={() => removeImage(i)}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      bgcolor: "rgba(0,0,0,0.55)",
                      color: "#fff",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
                      p: 0.25,
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  {i === 0 ? (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        bgcolor: "#FF9900",
                        color: "#1e1e1e",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      PRIMARY
                    </Box>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => makePrimary(i)}
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        fontSize: "0.6rem",
                        bgcolor: "rgba(0,0,0,0.55)",
                        color: "#fff",
                        borderRadius: 0,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
                      }}
                    >
                      Make primary
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          )}

          <Button
            component="label"
            variant="outlined"
            startIcon={
              uploading ? <CircularProgress size={18} /> : <CloudUploadIcon />
            }
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Add Image(s)"}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileUpload}
            />
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.secondary" }}>
            The first image is the primary (shown on cards). Add several for the
            product gallery.
          </Typography>
        </Box>

        <TextField
          label="Product name"
          required
          fullWidth
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
        />

        <TextField
          label="Amazon affiliate link"
          fullWidth
          value={product.link}
          onChange={(e) => setProduct({ ...product, link: e.target.value })}
        />

        <TextField
          select
          label="Badge (optional)"
          fullWidth
          value={product.badge}
          onChange={(e) => setProduct({ ...product, badge: e.target.value })}
        >
          <MenuItem value="">No badge</MenuItem>
          {ALLOWED_BADGES.map((b) => (
            <MenuItem key={b} value={b}>
              {b}
            </MenuItem>
          ))}
        </TextField>

        {/* Editorial Zentlify Score */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>
            Zentlify Score (editorial rating)
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Rating
              value={score}
              precision={0.5}
              onChange={(_e, v) => setScore(v || 0)}
              emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
            />
            <Typography variant="body2" color="text.secondary">
              {score ? `${score}/5` : "Not rated"}
            </Typography>
          </Stack>
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
                  selectedCategories.includes(category) ? "primary" : "default"
                }
                variant={
                  selectedCategories.includes(category) ? "filled" : "outlined"
                }
                onClick={() => toggleCategory(category)}
              />
            ))}
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={submitting}
          sx={{ alignSelf: "flex-start" }}
        >
          {submitting ? "Adding…" : "Add Product"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AddProduct;
