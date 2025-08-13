import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress,} from '@mui/material';
import DashboardCard from './DashboardCard';
import { dashboardStyles } from './Dashboard_style';
import { dashboardCardData } from './dashboardConfig.jsx';
import api from '../../api';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getCurrentUserId();
        if (!userId) {
          console.warn('User not logged in, using default data');
          setDashboardData(getDefaultDashboardData());
          setLoading(false);
          return;
        }
        const [coursesResponse, assignmentsResponse, faqsResponse] = await Promise.allSettled([
          api.get('/courses/'),
          api.get(`/assignments`),
          api.get('/faqs/assignment/1')
        ]);

        const coursesCount = coursesResponse.status === 'fulfilled' 
          ? coursesResponse.value.data.length 
          : 0;

        const assignmentsCount = assignmentsResponse.status === 'fulfilled' 
          ? assignmentsResponse.value.data.length 
          : 0;

        const faqsCount = faqsResponse.status === 'fulfilled' 
          ? faqsResponse.value.data.length 
          : 0;

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
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setDashboardData(getDefaultDashboardData());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  return (
    <Box sx={dashboardStyles.container}>
      <Typography variant="h5" sx={dashboardStyles.welcomeText}>
        A quick overview of your student dashboard.
      </Typography>

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
};

export default Dashboard;