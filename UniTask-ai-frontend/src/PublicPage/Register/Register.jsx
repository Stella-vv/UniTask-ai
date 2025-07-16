import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, MenuItem, Link as MuiLink } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../../api'; // 根据你的项目层级调整路径

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('student');   // 默认学生
  const [school, setSchool]     = useState('CSE');
  const [year, setYear]         = useState(new Date().getFullYear());
  const [err, setErr]           = useState('');
  const [msg, setMsg]           = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/register', {
        email,
        password,
        role,
        school,
        year
      });
      setMsg(data.message); // "User registered!"
      setTimeout(() => nav('/login'), 1000);
    } catch (e) {
      setErr(e.response?.data?.message || 'Register failed');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      maxWidth={400}
      mx="auto"
      mt={10}
      p={4}
      boxShadow={3}
      borderRadius={2}
    >
      <Typography variant="h5" mb={2} align="center">
        UniTask Register
      </Typography>

      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

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
      <TextField
        select
        fullWidth
        label="Role"
        margin="normal"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <MenuItem value="student">Student</MenuItem>
        <MenuItem value="tutor">Tutor</MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        label="School"
        margin="normal"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
        required
      >
        <MenuItem value="CSE">CSE</MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        label="Year"
        margin="normal"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      >
        {[2024, 2025, 2026, 2027].map((yr) => (
          <MenuItem key={yr} value={yr}>{yr}</MenuItem>
        ))}
      </TextField>

      <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
        Register
      </Button>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 2 }}
      >
        Already have an account?{' '}
        <MuiLink component={RouterLink} to="/login" underline="hover">
          Log in
        </MuiLink>
      </Typography>
    </Box>
  );
}