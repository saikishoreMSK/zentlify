// src/app/admin/page.js
"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddProduct from "./AddProduct/page";
import ManageProducts from "./ManageProducts/page";
import Dashboard from "./Dashboard";
import Banners from "./Banners";
import CategoryManager from "./CategoryManager";
import Tools from "./Tools";
import ToastProvider from "@/components/ToastProvider";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import CategoryIcon from "@mui/icons-material/Category";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import MenuIcon from "@mui/icons-material/Menu";

const BRAND = { charcoal: "#1e1e1e", amber: "#FF9900" };
const DRAWER_WIDTH = 240;

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { key: "addProduct", label: "Add Product", icon: <AddCircleOutlineIcon /> },
  { key: "manageProducts", label: "Manage Products", icon: <ListAltIcon /> },
  { key: "banners", label: "Banners", icon: <ViewCarouselIcon /> },
  { key: "categories", label: "Categories", icon: <CategoryIcon /> },
  { key: "tools", label: "Import / Export", icon: <ImportExportIcon /> },
];

const AdminPage = () => {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: BRAND.amber }} />
        <Typography variant="h6">Authenticating…</Typography>
      </Box>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") {
    router.push("/login");
    return null;
  }

  const go = (key) => {
    setActive(key);
    setMobileOpen(false);
  };

  const SidebarContent = (
    <Box
      sx={{
        height: "100%",
        bgcolor: BRAND.charcoal,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        py: 2,
      }}
    >
      <Typography
        sx={{
          px: 3,
          pb: 2,
          fontWeight: 800,
          fontSize: "1.25rem",
          color: BRAND.amber,
        }}
      >
        Zentlify Admin
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {NAV.map((item) => {
          const selected = active === item.key;
          return (
            <ListItemButton
              key={item.key}
              selected={selected}
              onClick={() => go(item.key)}
              sx={{
                mx: 1.5,
                borderRadius: 2,
                mb: 0.5,
                color: selected ? BRAND.charcoal : "#ddd",
                bgcolor: selected ? BRAND.amber : "transparent",
                "&.Mui-selected": { bgcolor: BRAND.amber },
                "&.Mui-selected:hover": { bgcolor: BRAND.amber },
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon
                sx={{ color: selected ? BRAND.charcoal : "#aaa", minWidth: 40 }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: selected ? 700 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ px: 2 }}>
        <Button
          fullWidth
          onClick={() => signOut({ callbackUrl: "/" })}
          startIcon={<LogoutIcon />}
          sx={{
            color: "#fff",
            borderColor: "rgba(255,255,255,0.3)",
            justifyContent: "flex-start",
          }}
          variant="outlined"
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  const activeLabel = NAV.find((n) => n.key === active)?.label || "";

  return (
    <ToastProvider>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FAFAF8" }}>
        {/* Desktop sidebar */}
        <Box
          component="nav"
          sx={{
            width: { md: DRAWER_WIDTH },
            flexShrink: { md: 0 },
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            sx={{
              position: "fixed",
              width: DRAWER_WIDTH,
              height: "100vh",
            }}
          >
            {SidebarContent}
          </Box>
        </Box>

        {/* Mobile drawer */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, border: 0 },
          }}
        >
          {SidebarContent}
        </Drawer>

        {/* Main column */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          {/* Mobile top bar */}
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              display: { md: "none" },
              bgcolor: BRAND.charcoal,
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileOpen(true)}
                aria-label="Open admin menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography sx={{ ml: 1, fontWeight: 700, color: BRAND.amber }}>
                Zentlify Admin
              </Typography>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, mb: 3, display: { xs: "none", md: "block" } }}
            >
              {activeLabel}
            </Typography>

            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 1,
                p: { xs: 2, md: 3 },
              }}
            >
              {active === "dashboard" && <Dashboard />}
              {active === "addProduct" && <AddProduct />}
              {active === "manageProducts" && <ManageProducts />}
              {active === "banners" && <Banners />}
              {active === "categories" && <CategoryManager />}
              {active === "tools" && <Tools />}
            </Box>
          </Box>
        </Box>
      </Box>
    </ToastProvider>
  );
};

export default AdminPage;
