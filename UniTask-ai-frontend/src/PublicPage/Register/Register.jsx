import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, MenuItem, Link as MuiLink } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../../api'; 

// Export the Register functional component.
export default function Register() {
  // Hook for programmatic navigation.
  const nav = useNavigate();
  // State for user input: email, password, role, school, and year.
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('student'); // Default role is 'student'.
  const [school, setSchool]     = useState('CSE');     // Default school is 'CSE'.
  const [year, setYear]         = useState(new Date().getFullYear()); // Default year is the current year.
  // State for handling error and success messages from the API.
  const [err, setErr]           = useState('');
  const [msg, setMsg]           = useState('');

  // Function to handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    try {
      // Send a POST request to the '/register' endpoint with user data.
      const { data } = await api.post('/register', {
        email,
        password,
        role,
        school,
        year
      });
      // On success, set the success message from the response.
      setMsg(data.message);
      // Redirect to the login page after a 1-second delay.
      setTimeout(() => nav('/login'), 1000);
    } catch (e) {
      // On failure, set the error message from the response or a default message.
      setErr(e.response?.data?.message || 'Register failed');
    }
  };

  // Main component render.
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

      {/* Conditionally render error or success alerts. */}
      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
      {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

      {/* Email input field. */}
      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {/* Password input field. */}
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {/* Role selection dropdown. */}
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

      {/* School selection dropdown. */}
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

      {/* Year selection dropdown. */}
      <TextField
        select
        fullWidth
        label="Year"
        margin="normal"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      >
        {/* Dynamically generate year options. */}
        {[2024, 2025, 2026, 2027].map((yr) => (
          <MenuItem key={yr} value={yr}>{yr}</MenuItem>
        ))}
      </TextField>

      {/* Submit button for the form. */}
      <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
        Register
      </Button>

      {/* Link to navigate to the login page. */}
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