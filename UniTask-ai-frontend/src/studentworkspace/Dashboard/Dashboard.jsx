import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress,} from '@mui/material';
import DashboardCard from './DashboardCard';
import { dashboardStyles } from './Dashboard_style';
import { dashboardCardData } from './dashboardConfig.jsx';
import api from '../../api';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Define the main Dashboard functional component.
const Dashboard = () => {
  // State to hold the data for dashboard cards.
  const [dashboardData, setDashboardData] = useState([]);
  // State to manage the loading status of data fetching.
  const [loading, setLoading] = useState(true);
  // State to store any errors that occur.
  const [error, setError] = useState(null);

  // Helper function to get the current user's ID from local storage.
  const getCurrentUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        return user.id;
      }
    } catch (error) {
      console.error('Failed to get user ID:', error);
    }
    return null; // Return null if no user is found or an error occurs.
  };

  // Effect to fetch all necessary dashboard data on component mount.
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if the user is logged in.
        const userId = getCurrentUserId();
        if (!userId) {
          console.warn('User not logged in, using default data');
          setDashboardData(getDefaultDashboardData()); // Use fallback data.
          setLoading(false);
          return;
        }
        // Fetch multiple data points concurrently without failing if one request errors.
        const [coursesResponse, assignmentsResponse, faqsResponse] = await Promise.allSettled([
          api.get('/courses/'),
          api.get(`/assignments`),
          api.get('/faqs/assignment/1') // Note: Hardcoded FAQ ID.
        ]);

        // Safely get the count from the fulfilled course promise, or 0.
        const coursesCount = coursesResponse.status === 'fulfilled' 
          ? coursesResponse.value.data.length 
          : 0;

        // Safely get the count from the fulfilled assignments promise, or 0.
        const assignmentsCount = assignmentsResponse.status === 'fulfilled' 
          ? assignmentsResponse.value.data.length 
          : 0;
        
        // Safely get the count from the fulfilled FAQs promise, or 0.
        const faqsCount = faqsResponse.status === 'fulfilled' 
          ? faqsResponse.value.data.length 
          : 0;

        // Construct the data for dashboard cards using the fetched counts.
        const dynamicDashboardData = [
          {
            icon: <MenuBookIcon />,
            title: 'Course',
            description: `You have ${coursesCount} ${coursesCount === 1 ? 'course' : 'courses'}`,
            path: '/student/course',
          },
          {
            icon: <AssignmentIcon />,
            title: 'Assignment',
            description: assignmentsCount > 0 
              ? `${assignmentsCount} ${assignmentsCount === 1 ? 'assignment' : 'assignments'} created`
              : 'No assignments yet',
            path: '/student/assignment',
          },
          {
            icon: <HelpOutlineIcon />,
            title: 'FAQs',
            description: `${faqsCount} FAQ${faqsCount !== 1 ? 's' : ''}`,
            path: '/student/faqs',
          },
        ];

        setDashboardData(dynamicDashboardData);

        // Log warnings for any API requests that failed.
        if (coursesResponse.status === 'rejected') {
          console.warn('Failed to fetch courses:', coursesResponse.reason);
        }
        if (assignmentsResponse.status === 'rejected') {
          console.warn('Failed to fetch assignments:', assignmentsResponse.reason);
        }
        if (faqsResponse.status === 'rejected') {
          console.warn('Failed to fetch FAQs:', faqsResponse.reason);
        }

      } catch (error) {
        // Handle any unexpected errors during the process.
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setDashboardData(getDefaultDashboardData()); // Use fallback data on error.
      } finally {
        setLoading(false); // Stop loading.
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Function to provide a default set of data for the dashboard cards.
  const getDefaultDashboardData = () => [
    {
      icon: <MenuBookIcon />,
      title: 'Course',
      description: 'You have x course',
      path: '/course-detail',
    },
    {
      icon: <AssignmentIcon />,
      title: 'Assignment',
      description: 'x new assignment',
      path: '/assignment',
    },
    {
      icon: <HelpOutlineIcon />,
      title: 'FAQs',
      description: 'x FAQs',
      path: '/faqs',
    },
  ];

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
            {dashboardData.map((item, index) => (
              <DashboardCard 
                key={index}
                {...item}
                isFirst={index === 0}
                isLast={index === dashboardData.length - 1}
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
        A quick overview of your student dashboard.
      </Typography>

      {/* Container for the grid of dashboard cards. */}
      <Box sx={dashboardStyles.cardsContainer}>
        <Box sx={dashboardStyles.cardsGrid}>
          {/* Map over the dashboard data to create a card for each item. */}
          {dashboardData.map((item, index) => (
            <DashboardCard 
              key={index}
              {...item}
              isFirst={index === 0}
              isLast={index === dashboardData.length - 1}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default Dashboard;