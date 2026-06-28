// src/app/contact/page.js

"use client";
import React from 'react';
// MUI Imports
import { Container, Typography, Box, Grid, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';

const ContactPage = () => {
  // 1. Initialize state for form data
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      subject: '',
      message: '',
  });
  
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (event) => {
      event.preventDefault();
      
      // 2. Perform submission logic (API call, etc.)
      // await api.post('/contact', formData); 
  
      // 3. Reset the state back to initial values to clear fields
      setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
      });
  
      alert('Message sent successfully!');
  };
    return (
        <Container 
            maxWidth="lg" 
            sx={{ 
                py: { xs: 5, md: 8 },
                // 💡 Use the light site background for the outer container
                bgcolor: '#FAFAF8' 
            }}
        >
            
            <Typography variant="h3" component="h1" align="center" gutterBottom 
                sx={{ 
                    fontWeight: 'bold', 
                    // 💡 Set the title color to your Accent/Primary color
                    color: '#FF9900', 
                    mb: { xs: 4, md: 6 } 
                }}
            >
                Get In Touch With Zentlify
            </Typography>

            <Grid container spacing={{ xs: 4, md: 8 }}>
                
                {/* Column 1: Contact Information */}
                <Grid item xs={12} md={4}>
                    <Box 
                        sx={{ 
                            p: 3, 
                            borderRadius: 2, 
                            // 💡 Use a contrasting color for the info box background
                            bgcolor: '#ffffff', // White background for contrast against #FAFAF8
                            boxShadow: 3 
                        }}
                    >
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                            Contact Information
                        </Typography>
                        
                        {/* Icons use the Primary color */}
                        <Box display="flex" alignItems="center" mb={2}>
                            <EmailIcon sx={{ mr: 2, color: '#FF9900' }} />
                            <Typography variant="body1">
                                support@zentlify.com
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                            <PhoneIcon sx={{ mr: 2, color: '#FF9900' }} />
                            <Typography variant="body1">
                                +91 98765 43210
                            </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="flex-start" mb={2}>
                            <LocationOnIcon sx={{ mr: 2, mt: 0.5, color: '#FF9900' }} />
                            <Typography variant="body1">
                                123 E-Commerce Lane, Digital City, India
                            </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                            We typically respond within 24 hours.
                        </Typography>
                    </Box>
                </Grid>

                {/* Column 2: Contact Form */}
                <Grid item xs={12} md={8}>
                    <Box component="form" onSubmit={handleSubmit} 
                        sx={{ 
                            p: 3, 
                            borderRadius: 2, 
                            // 💡 Use a contrasting color for the form box background
                            bgcolor: '#ffffff', // White background
                            boxShadow: 3 
                        }}
                    >
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                            Send Us a Message
                        </Typography>

                        {/* TextFields (MUI components will use the primary theme color for focus/labels) */}
                        <Grid container spacing={2} mb={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth required label="Your Name" name="name" variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth required label="Your Email" name="email" type="email" variant="outlined" />
                            </Grid>
                        </Grid>

                        <TextField fullWidth required label="Subject" name="subject" variant="outlined" sx={{ mb: 2 }} />

                        <TextField fullWidth required label="Your Message" name="message" multiline rows={4} variant="outlined" sx={{ mb: 3 }} />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            // 💡 Set button color to your Accent/Primary color
                            sx={{ py: 1.5, bgcolor: '#FF9900', color: '#1e1e1e', '&:hover': { bgcolor: '#FF9900', opacity: 0.9 } }}
                            endIcon={<SendIcon />}
                        >
                            Send Message
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContactPage;