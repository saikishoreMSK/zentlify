"use client";
// Branded sticky navbar shown on all public pages (via SiteChrome).

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputBase,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { BRAND } from "@/theme";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const submitSearch = (e) => {
    if (e.key && e.key !== "Enter") return;
    const q = search.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setDrawerOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: BRAND.charcoal, borderBottom: `2px solid ${BRAND.amber}` }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* Logo */}
        <Box
          component={Link}
          href="/"
          sx={{
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "1.4rem",
            letterSpacing: "-0.02em",
            color: BRAND.amber,
            whiteSpace: "nowrap",
          }}
        >
          Zentlify
        </Box>

        {/* Desktop nav links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: 2 }}>
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              sx={{
                color: "#f4f4f4",
                "&:hover": { color: BRAND.amber, bgcolor: "transparent" },
              }}
            >
              {link.name}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.12)",
            borderRadius: 2,
            px: 1.5,
            py: 0.25,
            width: { xs: 140, sm: 220 },
          }}
        >
          <SearchIcon sx={{ color: "#ccc", fontSize: 20, mr: 1 }} />
          <InputBase
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={submitSearch}
            sx={{ color: "#fff", fontSize: "0.9rem", width: "100%" }}
            inputProps={{ "aria-label": "search products" }}
          />
        </Box>

        {/* Mobile menu button */}
        <IconButton
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { xs: "inline-flex", md: "none" }, color: "#fff" }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 240, pt: 2 }} role="presentation">
          <Box
            sx={{
              px: 2,
              pb: 1,
              fontWeight: 800,
              fontSize: "1.2rem",
              color: BRAND.charcoal,
            }}
          >
            Zentlify
          </Box>
          <List>
            {NAV_LINKS.concat({
              name: "Affiliate Disclosure",
              href: "/disclosure",
            }).map((link) => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={link.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
