// src/app/components/Footer.js (MUI Refactor)

import React from 'react';
// 💡 MUI Imports
import { Container, Grid, Box, Typography, Link, IconButton, List, ListItem, ListItemText } from '@mui/material';
// Icon Imports (already present)
import { FaFacebookSquare, FaPinterestSquare, FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  // Define links data for easy mapping
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Affiliate Disclosure', href: '/disclosure' },
  ];

  const socialLinks = [
    { icon: <FaFacebookSquare />, href: '#' },
    { icon: <FaInstagramSquare />, href: '#' },
    { icon: <FaSquareXTwitter />, href: '#' },
    { icon: <FaPinterestSquare />, href: '#' },
  ];

  return (
    // 1. Use MUI Box as the main footer wrapper (replaces .footer)
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1e1e1e', // Dark background
        color: '#f4f4f4',
        py: { xs: 2.5, md: 6 }, // Responsive vertical padding
        mt: 'auto', // Push footer to the bottom
      }}
    >
      {/* 2. Use MUI Container to center content */}
      <Container maxWidth="lg">
        {/* 3. Use MUI Grid for the main three-column layout (replaces .footer-content) */}
        <Grid container spacing={{ xs: 2, md: 6 }} justifyContent="space-between">
          
          {/* Section 1: About */}
          <Grid item xs={12} sm={6} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#FF9900', fontWeight: 'bold', mb: { xs: 0.5, md: 1 } }}>
              Zentlify
            </Typography>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
              Curated, trending Amazon picks — handpicked for you.
            </Typography>
          </Grid>

          {/* Section 2: Quick Links */}
          <Grid item xs={6} sm={3} md={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#FF9900', fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            {/* Use MUI List for semantic list structure */}
            <List dense sx={{ p: 0 }}>
              {quickLinks.map((link) => (
                <ListItem key={link.name} sx={{ p: 0, py: 0.2 }}>
                  <Link 
                    href={link.href} 
                    color="inherit" 
                    underline="hover" 
                    variant="body2"
                    sx={{
                      '&:hover': { color: '#FF9900' },
                      transition: 'color 0.3s',
                      width: '100%', // ensures click area is full width
                      textAlign: { xs: 'center', sm: 'left' }
                    }}
                  >
                    {link.name}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Section 3: Follow Us */}
          <Grid item xs={6} sm={3} md={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#FF9900', fontWeight: 'bold' }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'left' } }}>
              {socialLinks.map((link, index) => (
                <IconButton 
                  key={index}
                  component={Link} // Use Link component for external navigation
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={link.icon.type.name.replace('Fa', '').replace('Square', '')}
                  sx={{ 
                    color: '#f4f4f4', 
                    '&:hover': { color: '#FF9900', backgroundColor: 'transparent' },
                    fontSize: { xs: '1.5rem', md: '1.8rem' }
                  }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom (replaces .footer-bottom) */}
        <Box
          sx={{
            textAlign: 'center',
            mt: { xs: 2, md: 4 },
            pt: { xs: 1.5, md: 2 },
            borderTop: '1px solid #444',
            fontSize: '0.8rem'
          }}
        >
          <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 1 }}>
            As an Amazon Associate, Zentlify earns from qualifying purchases.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ color: '#aaa' }}>
            &copy; {new Date().getFullYear()} Zentlify. All Rights Reserved.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

export default Footer;