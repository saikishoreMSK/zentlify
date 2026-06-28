"use client";
import { useEffect, useState } from "react";
import { db } from "../api/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useToast } from "@/components/ToastProvider";
import { DEFAULT_CATEGORIES, SPECIAL_CATEGORIES } from "@/lib/categoryConstants";

export default function CategoryManager() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "config", "categories"));
        const stored = snap.exists() ? snap.data()?.list : null;
        setList(
          Array.isArray(stored) && stored.length ? stored : DEFAULT_CATEGORIES
        );
      } catch {
        setList(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const add = () => {
    const name = input.trim();
    if (!name) return;
    if (list.some((c) => c.toLowerCase() === name.toLowerCase())) {
      toast("That category already exists.", "warning");
      return;
    }
    setList([...list, name]);
    setInput("");
  };

  const remove = (name) => setList(list.filter((c) => c !== name));

  const move = (index, dir) => {
    const next = [...list];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setList(next);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list }),
      });
      const r = await res.json();
      if (!res.ok) throw new Error(r.error || "Save failed");
      setList(r.list);
      toast("Categories saved", "success");
    } catch (err) {
      toast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
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
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Browse Categories
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        These power the homepage chips and the products filter. (“Trending” and
        “Best” are always available and drive site sections.)
      </Typography>

      <Stack spacing={1} sx={{ mb: 2 }}>
        {list.map((c, i) => (
          <Box
            key={c}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              border: "1px solid #eee",
              borderRadius: 1,
              bgcolor: "#fff",
            }}
          >
            <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{c}</Typography>
            <Button size="small" onClick={() => move(i, -1)} disabled={i === 0}>
              ↑
            </Button>
            <Button
              size="small"
              onClick={() => move(i, 1)}
              disabled={i === list.length - 1}
            >
              ↓
            </Button>
            <Button size="small" color="error" onClick={() => remove(c)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <TextField
          size="small"
          label="New category"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <Button variant="outlined" startIcon={<AddIcon />} onClick={add}>
          Add
        </Button>
      </Stack>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Always available:&nbsp;
        </Typography>
        {SPECIAL_CATEGORIES.map((s) => (
          <Chip key={s} label={s} size="small" sx={{ mr: 0.5 }} />
        ))}
      </Box>

      <Button variant="contained" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save Categories"}
      </Button>
    </Box>
  );
}
