import React from 'react';
import { Box, CssBaseline, Typography, Avatar } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routing
import Sidebar from './StudentSidebar.jsx';
import { styles } from './MainLayout_style.js'; 

// This component represents the header in the main content area
const MainHeader = () => (
  <Box sx={styles.mainHeader}>
    <Typography variant="h4" sx={styles.headerTitle}>
      Hi, Taylor
    </Typography>
    <Box sx={styles.headerProfile}>
      <Avatar sx={styles.avatar}>T</Avatar>
      <ExitToAppIcon sx={styles.logoutIcon} />
    </Box>
  </Box>
);

const MainLayout = () => {
  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.appContainer}>
        <CssBaseline />
        <Sidebar />
        <Box component="main" sx={styles.mainContent}>
          <MainHeader />
          <Box sx={styles.pageContentContainer}>
            {/* The Outlet will render the specific page component */}
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;