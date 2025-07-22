import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress,} from '@mui/material';
import DashboardCard from './DashboardCard';
import { dashboardStyles } from './Dashboard_style';
import { dashboardCardData } from './dashboardConfig.jsx';
import api from '../../api';

const Dashboard = () => {

  const [dynamicDashboardData, setDynamicDashboardData] = useState(dashboardCardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get current user ID
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
    return null;
  };

  useEffect(() => {
    const fetchTutorDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getCurrentUserId();
        if (!userId) {
          console.warn('User not logged in, using default data');
          setDynamicDashboardData(dashboardCardData);
          setLoading(false);
          return;
        }

        // Fetch data from multiple APIs concurrently
        const [coursesResponse, assignmentsResponse, faqsResponse, qasResponse] = await Promise.allSettled([
          api.get('/courses/'), // Get all courses
          api.get(`/assignments`), // Get tutor's assignments
          api.get('/faqs/course/1'), // Get FAQs for course 1 (you can make this dynamic)
          api.get('/qa/course/1/uploads') // Get Q&A uploads for course 1
        ]);

        // Process results and handle any failed requests
        const coursesCount = coursesResponse.status === 'fulfilled' 
          ? coursesResponse.value.data.length 
          : 0;

        const assignmentsCount = assignmentsResponse.status === 'fulfilled' 
          ? assignmentsResponse.value.data.length 
          : 0;

        const faqsCount = faqsResponse.status === 'fulfilled' 
          ? faqsResponse.value.data.length 
          : 0;

        const qasCount = qasResponse.status === 'fulfilled' 
          ? qasResponse.value.data.length 
          : 0;

        // Update dashboard data with dynamic counts using your existing config structure
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
          } else if (item.title === 'Q&As') {
            return {
              ...item,
              description: `${qasCount} Q&A${qasCount !== 1 ? 's' : ''}`,
            };
          } else if (item.title === 'FAQs') {
            return {
              ...item,
              description: `${faqsCount} FAQ${faqsCount !== 1 ? 's' : ''}`,
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
        if (faqsResponse.status === 'rejected') {
          console.warn('Failed to fetch FAQs:', faqsResponse.reason);
        }
        if (qasResponse.status === 'rejected') {
          console.warn('Failed to fetch Q&As:', qasResponse.reason);
        }

      } catch (error) {
        console.error('Error fetching tutor dashboard data:', error);
        setError('Failed to load dashboard data');
        // Fall back to default data on error
        setDynamicDashboardData(dashboardCardData);
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
        {/* Still show cards with fallback data */}
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
      {/* Welcome Message */}
      <Typography variant="h5" sx={dashboardStyles.welcomeText}>
        A quick overview of your teaching dashboard.
      </Typography>

      {/* Cards Container */}
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
  // return (
  //   <Box sx={dashboardStyles.container}>
  //     {/* Welcome Message */}
  //     <Typography variant="h5" sx={dashboardStyles.welcomeText}>
  //       A quick overview of your teaching dashboard.
  //     </Typography>

  //     {/* Cards Container */}
  //     <Box sx={dashboardStyles.cardsContainer}>
  //       <Box sx={dashboardStyles.cardsGrid}>
  //         {dashboardCardData.map((item, index) => (
  //           <DashboardCard 
  //             key={index}
  //             {...item}
  //             isFirst={index === 0}
  //             isLast={index === dashboardCardData.length - 1}
  //           />
  //         ))}
  //       </Box>
  //     </Box>
  //   </Box>
  // );
};

export default Dashboard;