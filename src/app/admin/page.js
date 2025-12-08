// src/app/admin/page.js

"use client";
import React, { useState, useEffect } from "react"; // Ensure React is imported
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddProduct from "./AddProduct/page";
import ManageProducts from "./ManageProducts/page";
import Loader from "@/components/Loader";
// 💡 NEW MUI IMPORTS
import { 
    Box, 
    Typography, 
    Button as MuiButton, 
    CircularProgress, 
    AppBar, 
    Toolbar, 
    Container, 
    Stack 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
// import './admin.css'; // This file will be mostly replaced by MUI styles

const AdminPage = () => {
    // ... (rest of state and hooks remain the same)
    const [activeComponent, setActiveComponent] = useState("addProduct");
    const { data: session, status } = useSession();
    const router = useRouter();

    const [showLoader, setShowLoader] = useState(true);
    const [showVideo, setShowVideo] = useState(false);

    // ... (useEffect hooks remain the same)

    // ... (Auth/Loading/Unauthenticated Handlers remain the same)
    
// --- Auth/Loading/Unauthenticated Handlers ---

    // 1. Handle Loading State
    if (status === "loading") {
        return (
            // Use Box and CircularProgress for cleaner loading state
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                {showLoader || showVideo ? (
                    // Keep your video/loader logic here, wrapped in a Box if needed
                    <Box>
                         {showLoader ? (
                            <Loader />
                        ) : showVideo ? (
                            <div className="video-container">
                                <video
                                    src="/zentlify-logo.mp4"
                                    autoPlay
                                    muted
                                    className="logo-video"
                                />
                            </div>
                        ) : null}
                    </Box>
                ) : (
                    <CircularProgress /> // Show default loader after video/initial loader is gone
                )}
                
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Authenticating...
                </Typography>
            </Box>
        );
    }

    // 2. Handle Unauthenticated State
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
        router.push('/login');
        return null;
    }


    // 3. Render the Dashboard
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#FDF7F4' }}>
            
            {/* Header / App Bar */}
            <AppBar position="static" sx={{ bgcolor: '#1e1e1e' }}>
                <Toolbar>
                  {/* Title on the left, takes up remaining space */}
                  <Typography 
                      variant="h6" 
                      component="div" 
                      sx={{ flexGrow: 1, color: '#f9c74f', fontWeight: 'bold' }}
                  >
                      Zentlify Admin Panel
                  </Typography>
                  
                  {/* Sign Out Button (Made very small) */}
                  <MuiButton
                      onClick={() => signOut({ callbackUrl: '/' })}
                      color="error"
                      variant="contained"
                      // 1. Use the 'small' size prop
                      size="small" 
                      startIcon={<LogoutIcon fontSize="small" />} // 2. Reduce the icon size too
                      sx={{ 
                          // 3. Override default minimum width to make it compact
                          minWidth: 0, 
                          p: 1, // 4. Reduce padding for a smaller visual footprint
                          whiteSpace: 'nowrap' // Prevents button content from wrapping
                      }}
                  >
                      Sign Out
                  </MuiButton>
              </Toolbar>
            </AppBar>
            
            {/* Main Content Container */}
            <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }}>
                
                {/* Navbar (Tabs) - Use Stack for layout */}
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}
                >
                    <MuiButton
                        variant={activeComponent === "addProduct" ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setActiveComponent("addProduct")}
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ minWidth: 200 }}
                    >
                        Add Products
                    </MuiButton>
                    
                    <MuiButton
                        variant={activeComponent === "manageProducts" ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setActiveComponent("manageProducts")}
                        startIcon={<ListAltIcon />}
                        sx={{ minWidth: 200 }}
                    >
                        Manage Products
                    </MuiButton>
                </Stack>

                {/* Main Content Area */}
                <Box className="main-content" sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 3 }}>
                    {activeComponent === "addProduct" && <AddProduct />}
                    {activeComponent === "manageProducts" && <ManageProducts />}
                </Box>
              </Container>
            </Box>
    );
};

export default AdminPage;