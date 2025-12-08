// src/app/login/page.js

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// 💡 NEW MUI Imports
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false); // New state for loading indicator

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. Call the signIn function with the 'credentials' provider ID
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    
    setLoading(false);

    // 2. Handle the result
    if (result.error) {
      if (result.error.includes("CredentialsSignin")) {
        setError("Invalid username or password. Please try again.");
      } else {
        setError("An unknown error occurred during sign-in.");
      }
    } else if (result.ok) {
      // 3. If sign-in is successful, redirect the user to the protected admin page
      router.push('/admin');
    }
  };

  return (
    // 💡 Use MUI Box and Container for centering and structure
    <Container component="main" maxWidth="xs" 
        sx={{ 
            minHeight: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'background.default' 
        }}
    >
      <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
                borderRadius: 2,
                bgcolor: 'background.paper', // Uses your theme's paper color (usually white/light grey)
                boxShadow: 8, // Prominent shadow for the login box
            }}
        >
            {/* Lock Icon */}
            <LockOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            
            {/* Title */}
            <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 3, fontWeight: 'bold' }}>
                Admin Login
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                {/* Username Field */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                        startAdornment: <PersonOutlineIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    autoFocus
                />

                {/* Password Field */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        startAdornment: <VpnKeyOutlinedIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                />

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Sign In Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ mt: 3, mb: 2, py: 1.5, boxShadow: 6 }}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>
            </Box>
        </Box>
    </Container>
  );
}