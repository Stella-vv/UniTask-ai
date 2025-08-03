// src/PublicPage/Login/Login.jsx (Corrected)

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Link as MuiLink } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from "../../api";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/login', { email, password });

      if (data.token && data.user && data.user.role) {
        // 1. Store authentication info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role);

        // 2. Redirect based on the role
        if (data.user.role === 'student') {
          nav('/student'); // Redirect students to /student
        } else if (data.user.role === 'tutor') {
          // --- MODIFIED: Changed the path from '/dashboard' to '/tutor' ---
          nav('/tutor');
        } else {
          setErr('Unrecognized user role.');
        }
      } else {
        setErr('Login failed: Invalid data received from server.');
      }
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={10}
      p={4}
      boxShadow={3}
      borderRadius={2}
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" mb={2} align="center">
        UniTask Login
      </Typography>

      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        sx={{ mt: 2 }}
      >
        Login
      </Button>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 2 }}
      >
        Don’t have an account?{' '}
        <MuiLink component={RouterLink} to="/register" underline="hover">
          Register
        </MuiLink>
      </Typography>
    </Box>
  );
}