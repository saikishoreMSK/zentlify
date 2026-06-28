"use client";
import { useEffect, useState } from "react";
import { db } from "../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useToast } from "@/components/ToastProvider";
import { uploadToCloudinary } from "@/lib/uploadImage";

const EMPTY = {
  image: "",
  headline: "",
  subtext: "",
  link: "",
  active: true,
  order: 0,
};

export default function Banners() {
  const toast = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, "banners"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setBanners(list);
    } catch (err) {
      console.error(err);
      toast("Could not load banners (check Firestore rules).", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setForm({
      image: b.image || "",
      headline: b.headline || "",
      subtext: b.subtext || "",
      link: b.link || "",
      active: b.active !== false,
      order: b.order || 0,
    });
    setOpen(true);
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((f) => ({ ...f, image: url }));
      toast("Image uploaded", "success");
    } catch (err) {
      toast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.image) {
      toast("Please upload a banner image.", "warning");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/banners/${editingId}` : "/api/banners";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const r = await res.json().catch(() => ({}));
        throw new Error(r.error || "Save failed");
      }
      toast(editingId ? "Banner updated" : "Banner created", "success");
      setOpen(false);
      setLoading(true);
      await load();
    } catch (err) {
      toast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setBanners((b) => b.filter((x) => x.id !== id));
      toast("Banner deleted", "success");
    } catch (err) {
      toast(err.message || "Delete failed", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Homepage Banners
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
          Add Banner
        </Button>
      </Box>

      {banners.length === 0 ? (
        <Typography color="text.secondary">
          No banners yet. The homepage hero falls back to trending products until
          you add one.
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {banners.map((b) => (
            <Box
              key={b.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                border: "1px solid #eee",
                borderRadius: 2,
                bgcolor: "#fff",
              }}
            >
              <Box
                component="img"
                src={b.image}
                alt={b.headline || "Banner"}
                sx={{
                  width: 120,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 600 }}>
                  {b.headline || "(no headline)"}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {b.subtext || b.link || "—"}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={b.active !== false ? "Active" : "Hidden"}
                color={b.active !== false ? "success" : "default"}
              />
              <Chip size="small" label={`#${b.order || 0}`} variant="outlined" />
              <IconButton onClick={() => openEdit(b)} aria-label="Edit">
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => remove(b.id)}
                color="error"
                aria-label="Delete"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingId ? "Edit Banner" : "Add Banner"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 2, textAlign: "center" }}>
              {form.image && (
                <Box
                  component="img"
                  src={form.image}
                  alt="Banner preview"
                  sx={{
                    width: "100%",
                    maxHeight: 180,
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 1.5,
                  }}
                />
              )}
              <Button
                component="label"
                variant="outlined"
                startIcon={
                  uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />
                }
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "Upload banner image"}
                <input type="file" accept="image/*" hidden onChange={handleUpload} />
              </Button>
            </Box>

            <TextField
              label="Headline"
              fullWidth
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
            />
            <TextField
              label="Subtext"
              fullWidth
              value={form.subtext}
              onChange={(e) => setForm({ ...form, subtext: e.target.value })}
            />
            <TextField
              label="Link (e.g. /products?category=Tech or a full URL)"
              fullWidth
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                sx={{ width: 120 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.active}
                    onChange={(e) =>
                      setForm({ ...form, active: e.target.checked })
                    }
                  />
                }
                label="Active"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={save} variant="contained" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
