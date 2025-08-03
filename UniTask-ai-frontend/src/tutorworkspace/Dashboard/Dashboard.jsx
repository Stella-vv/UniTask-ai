// test/tutorworkspace/Dashboard/Dashboard.jsx (Modified)

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import DashboardCard from './DashboardCard';
import { dashboardStyles } from './Dashboard_style';
import { dashboardCardData } from './dashboardConfig.jsx';
import api from '../../api';

const Dashboard = () => {

  const [dynamicDashboardData, setDynamicDashboardData] = useState(dashboardCardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutorDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from multiple APIs concurrently
        const [coursesResponse, assignmentsResponse] = await Promise.allSettled([
          api.get('/courses/'), // Get all courses
          api.get(`/assignments`), // Get tutor's assignments
        ]);

        // Process results
        const coursesCount = coursesResponse.status === 'fulfilled' 
          ? coursesResponse.value.data.length 
          : 0;

        const assignmentsCount = assignmentsResponse.status === 'fulfilled' 
          ? assignmentsResponse.value.data.length 
          : 0;
        
        // Update dashboard data with dynamic counts
        const updatedDashboardData = dashboardCardData.map(item => {
          if (item.title === 'Course') {
            return {
              ...item,
              description: `You have ${coursesCount} ${coursesCount === 1 ? 'course' : 'courses'}`,
            };
          } else if (item.title === 'Assignment') {
            return {
              ...item,
              description: assignmentsCount > 0 
                ? `${assignmentsCount} ${assignmentsCount === 1 ? 'assignment' : 'assignments'} created`
                : 'No assignments created yet',
            };
          }
          return item;
        });

        setDynamicDashboardData(updatedDashboardData);

        // Log any failed requests for debugging
        if (coursesResponse.status === 'rejected') {
          console.warn('Failed to fetch courses:', coursesResponse.reason);
        }
        if (assignmentsResponse.status === 'rejected') {
          console.warn('Failed to fetch assignments:', assignmentsResponse.reason);
        }

      } catch (error) {
        console.error('Error fetching tutor dashboard data:', error);
        setError('Failed to load dashboard data');
        setDynamicDashboardData(dashboardCardData); // Fallback to default
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={dashboardStyles.container}>
        <Typography variant="h5" sx={dashboardStyles.welcomeText}>
          A quick overview of your teaching dashboard.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
          <CircularProgress size={24} />
          <Typography variant="body1" color="text.secondary">
            Loading dashboard data...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={dashboardStyles.container}>
        <Typography variant="h5" sx={dashboardStyles.welcomeText}>
          A quick overview of your teaching dashboard.
        </Typography>
        <Typography variant="body1" color="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Typography>
        <Box sx={dashboardStyles.cardsContainer}>
          <Box sx={dashboardStyles.cardsGrid}>
            {dynamicDashboardData.map((item, index) => (
              <DashboardCard 
                key={index}
                {...item}
                isFirst={index === 0}
                isLast={index === dynamicDashboardData.length - 1}
              />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={dashboardStyles.container}>
      <Typography variant="h5" sx={dashboardStyles.welcomeText}>
        A quick overview of your teaching dashboard.
      </Typography>
      <Box sx={dashboardStyles.cardsContainer}>
        <Box sx={dashboardStyles.cardsGrid}>
          {dynamicDashboardData.map((item, index) => (
            <DashboardCard 
              key={index}
              {...item}
              isFirst={index === 0}
              isLast={index === dynamicDashboardData.length - 1}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;