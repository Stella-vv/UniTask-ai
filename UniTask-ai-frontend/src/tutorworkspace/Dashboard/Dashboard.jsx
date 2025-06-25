// import { Typography } from '@mui/material';

// const Dashboard = () => {
//   return (
//     <div>
//       <Typography variant="h5" gutterBottom>
//         Dashboard
//       </Typography>
//       <Typography variant="body1">
//         Welcome to your dashboard. All your main content will be displayed here.
//       </Typography>
//     </div>
//   );
// };

// export default Dashboard;

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
        A quick overview of your teaching dashboard.
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