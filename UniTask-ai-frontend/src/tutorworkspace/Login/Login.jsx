// src/pages/Login.jsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
//import axios from '../api';        // 你在 src/api/index.js 里 export 默认 Axios 实例
import api from "../../api";     //  ← 多上一层目录

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr]           = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/login', { email, password });
      // 保存 token / user，可根据需求放 localStorage 或 Context
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      nav('/dashboard');                        // 登录成功跳转
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
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
    </Box>
  );
}