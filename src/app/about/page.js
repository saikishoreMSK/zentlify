// src/app/components/About.js

"use client";
import React from 'react';
// 💡 MUI Imports
import { Container, Typography, Box, List, ListItem, ListItemText, ListItemIcon, Fade, Grid } from '@mui/material';
// 💡 Animation Import
import { useInView } from 'react-intersection-observer';
// 💡 Icon Imports
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

// Custom component to apply Fade-in on scroll
const AnimatedSection = ({ children, delay = 0 }) => {
    // 💡 Use react-intersection-observer hook
    const { ref, inView } = useInView({
        triggerOnce: true, // Animation triggers only once
        threshold: 0.1,    // Start animation when 10% of the element is visible
    });

    return (
        <Fade in={inView} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
            <Box ref={ref} sx={{ minHeight: '100px' }}>
                {children}
            </Box>
        </Fade>
    );
};


export default function About() {
    return (
        // 1. Use MUI Container and Box for consistent structure (replaces .about-container)
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, color: '#333' }}>
            
            {/* Title */}
            <Typography variant="h3" component="h1" gutterBottom align="center" 
                sx={{ 
                    fontWeight: 'bold', 
                    color: '#1e1e1e', 
                    mb: { xs: 3, md: 5 } 
                }}
            >
                About Zentlify 🚀
            </Typography>

            {/* Introduction */}
            <Typography variant="h6" component="p" gutterBottom sx={{ mb: 4, textAlign: 'justify' }}>
                Welcome to <Box component="strong" sx={{ color: '#FF9900' }}>Zentlify</Box> – your one-stop destination for exploring and shopping for Amazon-affiliated products! 
                At Zentlify, we aim to simplify your online shopping experience by curating an extensive collection of products from various categories, 
                ensuring that you find everything you need in one place.
            </Typography>

            {/* Mission */}
            <AnimatedSection>
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#34495e', mt: 3, mb: 2 }}>
                    Our Mission
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, textAlign: 'justify' }}>
                    Our mission is to make online shopping seamless, efficient, and enjoyable. By affiliating with Amazon, we provide you with 
                    access to a vast range of high-quality products, ensuring you always find the best deals and offers.
                </Typography>
            </AnimatedSection>
            
            {/* What We Offer */}
            <AnimatedSection delay={200}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#34495e', mt: 3, mb: 2 }}>
                    What We Offer 🎁
                </Typography>
                {/* Use MUI List component */}
                <List sx={{ mb: 4, bgcolor: '#f5f5f5', borderRadius: 2, p: 2 }}>
                    {[
                        "Over 1,000 hand-picked Amazon-affiliated products.",
                        "Curated collections across multiple categories like electronics, fashion, home essentials, and more.",
                        "Exclusive discounts and deals to maximize your savings.",
                        "Easy navigation and user-friendly design for a seamless shopping experience.",
                        "Reliable product reviews to help you make informed decisions.",
                    ].map((item, index) => (
                        <ListItem key={index} disableGutters>
                            <ListItemIcon sx={{ minWidth: 35, color: '#FF9900' }}>
                                <CheckCircleOutlineIcon />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1">{item}</Typography>} />
                        </ListItem>
                    ))}
                </List>
            </AnimatedSection>

            {/* Our Achievements */}
            <AnimatedSection delay={400}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#34495e', mt: 3, mb: 2 }}>
                    Our Achievements 🏆
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    Since our inception, Zentlify has achieved significant milestones:
                </Typography>
                 <List sx={{ mb: 4 }}>
                    {[
                        "Over ₹30,000 in revenue generated through affiliate links.",
                        "Built a strong social media presence across 10 platforms.",
                        "Gained the trust of hundreds of satisfied customers.",
                    ].map((item, index) => (
                        <ListItem key={index} disableGutters>
                            <ListItemIcon sx={{ minWidth: 35, color: '#1e1e1e' }}>
                                <EmojiEventsIcon />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body1">{item}</Typography>} />
                        </ListItem>
                    ))}
                </List>
            </AnimatedSection>

            {/* Why Choose Zentlify? */}
            <AnimatedSection delay={600}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#34495e', mt: 3, mb: 2 }}>
                    Why Choose Zentlify?
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, textAlign: 'justify' }}>
                    Zentlify isn’t just a website – it’s a community of shoppers who value **quality, convenience, and affordability.** We’re committed to enhancing your shopping experience, one product at a time.
                </Typography>
            </AnimatedSection>

            {/* Contact Us */}
            <AnimatedSection delay={800}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#34495e', mt: 3, mb: 2 }}>
                    Contact Us <ContactSupportIcon sx={{ verticalAlign: 'middle', ml: 1 }} />
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, textAlign: 'justify' }}>
                    Got questions or feedback? Feel free to reach out! We’re always here to help.
                </Typography>
            </AnimatedSection>

        </Container>
    );
}