// src/components/MainLayout.jsx (Modified)

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Box, CssBaseline, Typography, Avatar } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { styles } from './MainLayout_style.js';

// This component represents the header in the main content area
const MainHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to hold user info

  useEffect(() => {
    // On component mount, get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []); // The empty array ensures this runs only once on mount

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Box sx={styles.mainHeader}>
      {/* Display user's email, with a fallback */}
      <Typography variant="h4" sx={styles.headerTitle}>
        Hi, {user ? user.email : 'Tutor'}
      </Typography>
      <Box sx={styles.headerProfile}>
        <Avatar sx={styles.avatar}>
          {/* Show the first letter of the email as the avatar */}
          {user ? user.email.charAt(0).toUpperCase() : 'T'}
        </Avatar>
        <ExitToAppIcon sx={styles.logoutIcon} onClick={handleLogout} />
      </Box>
    </Box>
  );
};

const MainLayout = () => {
  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.appContainer}>
        <CssBaseline />
        <Sidebar />
        <Box component="main" sx={styles.mainContent}>
          <MainHeader />
          <Box sx={styles.pageContentContainer}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;