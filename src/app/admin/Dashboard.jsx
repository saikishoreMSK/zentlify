"use client";
// Admin analytics overview, driven by the clickCount we track on every product.

import { useEffect, useState, useMemo } from "react";
import { db } from "../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory2";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const BRAND = { charcoal: "#1e1e1e", amber: "#FF9900" };

function StatCard({ icon, label, value, color }) {
  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            bgcolor: color,
            color: "#fff",
            borderRadius: 2,
            p: 1.2,
            display: "flex",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "products"));
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setProducts([]);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    if (!products) return null;
    const totalClicks = products.reduce(
      (sum, p) => sum + (p.clickCount || 0),
      0
    );
    const zeroClicks = products.filter((p) => !(p.clickCount > 0)).length;
    const top = [...products]
      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
      .slice(0, 8);

    const byCategory = {};
    for (const p of products) {
      for (const c of p.categories || []) {
        byCategory[c] = (byCategory[c] || 0) + (p.clickCount || 0);
      }
    }
    const categories = Object.entries(byCategory)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks);

    return { totalClicks, zeroClicks, top, categories };
  }, [products]);

  if (!products) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const maxCat = stats.categories[0]?.clicks || 1;

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<InventoryIcon />}
            label="Total products"
            value={products.length}
            color={BRAND.charcoal}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<TouchAppIcon />}
            label="Total affiliate clicks"
            value={stats.totalClicks}
            color={BRAND.amber}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<VisibilityOffIcon />}
            label="Products with 0 clicks"
            value={stats.zeroClicks}
            color="#888"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top products */}
        <Grid item xs={12} md={7}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Top performers
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Clicks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.top.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell sx={{ maxWidth: 280 }}>
                        <Typography noWrap variant="body2">
                          {p.name || "(unnamed)"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{p.clickCount || 0}</TableCell>
                    </TableRow>
                  ))}
                  {stats.top.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2}>No products yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Clicks by category */}
        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 2 }}>
                Clicks by category
              </Typography>
              {stats.categories.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No click data yet.
                </Typography>
              )}
              {stats.categories.map((c) => (
                <Box key={c.name} sx={{ mb: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2">{c.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {c.clicks}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(c.clicks / maxCat) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
