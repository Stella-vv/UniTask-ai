import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Typography, Avatar } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './StudentSidebar.jsx';
import { styles } from './MainLayout_style.js';

const MainHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Box sx={styles.mainHeader}>
      <Typography variant="h4" sx={styles.headerTitle}>
        Hi, {user ? user.email : 'Student'}
      </Typography>
      <Box sx={styles.headerProfile}>
        <Avatar sx={styles.avatar}>
          {user ? user.email.charAt(0).toUpperCase() : 'S'}
        </Avatar>
        <ExitToAppIcon sx={styles.logoutIcon} onClick={handleLogout} />
      </Box>
    </Box>
  );
};

const StudentMainLayout = () => {
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

export default StudentMainLayout;