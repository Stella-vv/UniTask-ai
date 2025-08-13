import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { dashboardCardStyles } from './Dashboard_style';

const DashboardCard = ({ icon, title, description, path, isFirst, isLast }) => {
  return (
    <Box
      component={RouterLink}
      to={path}
      sx={{
        ...dashboardCardStyles.cardContainer,
        ...(isFirst && dashboardCardStyles.firstCard),
        ...(isLast && dashboardCardStyles.lastCard),
      }}
    >

      <Box sx={dashboardCardStyles.iconContainer}>
        {icon}
      </Box>
      
      <Typography variant="h6" sx={dashboardCardStyles.title}>
        {title}
      </Typography>

      <Typography variant="body2" sx={dashboardCardStyles.description}>
        {description}
      </Typography>
    </Box>
  );
};

export default DashboardCard;