import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import DashboardCard from './DashboardCard';
import { dashboardStyles } from './Dashboard_style';
import { dashboardCardData } from './dashboardConfig.jsx';
import api from '../../api';

// Define the Dashboard component for the tutor's view.
const Dashboard = () => {

  // State to hold the data for dashboard cards, initialized with default data.
  const [dynamicDashboardData, setDynamicDashboardData] = useState(dashboardCardData);
  // State to manage the loading status of data fetching.
  const [loading, setLoading] = useState(true);
  // State to store any errors that occur.
  const [error, setError] = useState(null);

  // Effect to fetch all necessary dashboard data on component mount.
  useEffect(() => {
    const fetchTutorDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch multiple data points concurrently without failing if one request errors.
        const [coursesResponse, assignmentsResponse] = await Promise.allSettled([
          api.get('/courses/'),
          api.get(`/assignments`), 
        ]);

        // Safely get the count from the fulfilled course promise, or 0.
        const coursesCount = coursesResponse.status === 'fulfilled' 
          ? coursesResponse.value.data.length 
          : 0;

        // Safely get the count from the fulfilled assignments promise, or 0.
        const assignmentsCount = assignmentsResponse.status === 'fulfilled' 
          ? assignmentsResponse.value.data.length 
          : 0;
        
        // Update the default dashboard data with the live counts from the API.
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
          return item; // Return other items unchanged.
        });

        setDynamicDashboardData(updatedDashboardData);

        // Log warnings for any API requests that failed.
        if (coursesResponse.status === 'rejected') {
          console.warn('Failed to fetch courses:', coursesResponse.reason);
        }
        if (assignmentsResponse.status === 'rejected') {
          console.warn('Failed to fetch assignments:', assignmentsResponse.reason);
        }

      } catch (error) {
        // Handle any unexpected errors during the process.
        console.error('Error fetching tutor dashboard data:', error);
        setError('Failed to load dashboard data');
        setDynamicDashboardData(dashboardCardData); // Fallback to default data on error.
      } finally {
        setLoading(false); // Stop loading.
      }
    };

    fetchTutorDashboardData();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Conditional rendering for the loading state.
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

  // Conditional rendering for the error state.
  if (error) {
    return (
      <Box sx={dashboardStyles.container}>
        <Typography variant="h5" sx={dashboardStyles.welcomeText}>
          A quick overview of your teaching dashboard.
        </Typography>
        <Typography variant="body1" color="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Typography>
        {/* Render cards with default data even on error. */}
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

  // Main component render for a successful data fetch.
  return (
    <Box sx={dashboardStyles.container}>
      <Typography variant="h5" sx={dashboardStyles.welcomeText}>
        A quick overview of your teaching dashboard.
      </Typography>
      {/* Container for the grid of dashboard cards. */}
      <Box sx={dashboardStyles.cardsContainer}>
        <Box sx={dashboardStyles.cardsGrid}>
          {/* Map over the dashboard data to create a card for each item. */}
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

// Export the component for use in other parts of the application.
export default Dashboard;