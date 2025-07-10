import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import DashboardCard from './DashboardCard';
import { dashboardStyles } from './Dashboard_style';
import { dashboardCardData } from './dashboardConfig.jsx';

const Dashboard = () => {
  return (
    <Box sx={dashboardStyles.container}>
      {/* Welcome Message */}
      <Typography variant="h5" sx={dashboardStyles.welcomeText}>
        A quick overview of your student dashboard.
      </Typography>

      {/* Cards Container */}
      <Box sx={dashboardStyles.cardsContainer}>
        <Box sx={dashboardStyles.cardsGrid}>
          {dashboardCardData.map((item, index) => (
            <DashboardCard 
              key={index}
              {...item}
              isFirst={index === 0}
              isLast={index === dashboardCardData.length - 1}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;