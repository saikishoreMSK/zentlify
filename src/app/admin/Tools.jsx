"use client";
import { useState } from "react";
import { db } from "../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Typography, Button, CircularProgress, Stack } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useToast } from "@/components/ToastProvider";

const EXPORT_COLUMNS = [
  "name",
  "description",
  "link",
  "image",
  "images",
  "categories",
  "badge",
  "zentlifyScore",
  "clickCount",
];

// --- tiny CSV helpers (no external deps) ----------------------------------
function csvEscape(value) {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCSV(rows) {
  const header = EXPORT_COLUMNS.join(",");
  const body = rows
    .map((r) =>
      EXPORT_COLUMNS.map((c) => {
        if (c === "categories" || c === "images")
          return csvEscape((r[c] || []).join("|"));
        return csvEscape(r[c]);
      }).join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
}

// Parse CSV into array of objects. Handles quoted fields, commas and newlines.
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c !== "")) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((c) => c !== "")) rows.push(row);
  }
  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cols) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
    return obj;
  });
}

export default function Tools() {
  const toast = useToast();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const snap = await getDocs(collection(db, "products"));
      const rows = snap.docs.map((d) => d.data());
      const csv = toCSV(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zentlify-products.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast(`Exported ${rows.length} products`, "success");
    } catch (err) {
      toast(err.message || "Export failed", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    setImporting(true);
    try {
      const text = await file.text();
      const records = parseCSV(text);
      if (records.length === 0) {
        toast("No rows found in the CSV.", "warning");
        return;
      }

      let ok = 0;
      let failed = 0;
      for (const rec of records) {
        const images = (rec.images || "")
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
        if (!images.length && rec.image) images.push(rec.image.trim());

        const body = {
          name: rec.name,
          description: rec.description || "",
          link: rec.link || "",
          images,
          categories: (rec.categories || "")
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean),
          badge: rec.badge || "",
          zentlifyScore: rec.zentlifyScore || 0,
        };

        if (!body.name || images.length === 0) {
          failed++;
          continue;
        }
        try {
          const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (res.ok) ok++;
          else failed++;
        } catch {
          failed++;
        }
      }
      toast(`Import complete: ${ok} added, ${failed} skipped/failed.`, ok ? "success" : "warning");
    } catch (err) {
      toast(err.message || "Import failed", "error");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Import / Export
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Export</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Download all products as a CSV (categories and images are
            pipe-separated, e.g. <code>Tech|Home</code>).
          </Typography>
          <Button
            variant="outlined"
            startIcon={exporting ? <CircularProgress size={18} /> : <DownloadIcon />}
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? "Exporting…" : "Export products CSV"}
          </Button>
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>Import</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Upload a CSV with headers: <code>name, link, image, description,
            images, categories, badge, zentlifyScore</code>. Each row needs at
            least a <strong>name</strong> and an <strong>image</strong> (or
            pipe-separated <strong>images</strong>).
          </Typography>
          <Button
            component="label"
            variant="contained"
            startIcon={importing ? <CircularProgress size={18} /> : <UploadFileIcon />}
            disabled={importing}
          >
            {importing ? "Importing…" : "Import products CSV"}
            <input type="file" accept=".csv,text/csv" hidden onChange={handleImport} />
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
