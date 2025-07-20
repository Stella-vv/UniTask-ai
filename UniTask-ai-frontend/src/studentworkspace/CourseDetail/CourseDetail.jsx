// test/studentworkspace/CourseDetail/CourseDetail.jsx (Corrected version)

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { Link as RouterLink } from 'react-router-dom';
import { courseDetailStyles } from './CourseDetail_style';
import api from '../../api';

// We'll fetch course with ID 2 for consistency in demonstration
const COURSE_ID_TO_DISPLAY = 2;

const StudentCourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dynamic data from API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/courses/${COURSE_ID_TO_DISPLAY}`);
        setCourse(response.data);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError('Could not load course details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  // Loading and Error states
  if (loading) {
    return (
        <Box sx={courseDetailStyles.container}>
            <Box sx={courseDetailStyles.topBlueHeader}>
                <Typography variant="h4" sx={courseDetailStyles.headerTitle}>Course Detail</Typography>
            </Box>
            <Box sx={{...courseDetailStyles.contentArea, justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress />
            </Box>
        </Box>
    );
  }

  if (error || !course) {
    return (
        <Box sx={courseDetailStyles.container}>
            <Box sx={courseDetailStyles.topBlueHeader}>
                <Typography variant="h4" sx={courseDetailStyles.headerTitle}>Course Detail</Typography>
            </Box>
            <Box sx={{...courseDetailStyles.contentArea, justifyContent: 'center', alignItems: 'center'}}>
                <Alert severity="error">{error || 'Course not found.'}</Alert>
            </Box>
        </Box>
    );
  }

  // Use assessments from API if available, otherwise fall back to the static mock data.
  const assessments = course.assessments || [
    { id: 1, name: 'Final Exam Assessment Format: Individual 40%' },
    { id: 2, name: 'Hands-on Experiments (Labs) Assessment Format: Individual 20%' },
    { id: 3, name: 'Mid-lecture Quizzes Assessment Format: Individual 15%' },
    { id: 4, name: 'Term Project Assessment Format: Individual 25%' },
  ];

  return (
    <Box sx={courseDetailStyles.container}>
      <Box sx={courseDetailStyles.topBlueHeader}>
        <Typography variant="h4" sx={courseDetailStyles.headerTitle}>
          Course Detail
        </Typography>
      </Box>
      
      <Box sx={courseDetailStyles.contentArea}>
        <Box sx={courseDetailStyles.titleSection}>
          <Typography variant="h4" sx={courseDetailStyles.courseTitle}>
            {course.name}
          </Typography>
        </Box>

        <Typography variant="h6" sx={courseDetailStyles.courseId}>
          Course ID: {course.id}
        </Typography>

        {/* Display Availability */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={courseDetailStyles.sectionTitle}>
             Availability:
          </Typography>
          <Typography variant="body1" sx={{ ...courseDetailStyles.summaryText, fontSize: '1rem'}}>
            This course is open in semester {course.semester} of {course.year}
          </Typography>
        </Box>
        
        <Box sx={courseDetailStyles.summarySection}>
          <Typography variant="h6" sx={courseDetailStyles.sectionTitle}>
            Course Summary
          </Typography>
          <Typography variant="body1" sx={courseDetailStyles.summaryText}>
            {course.description}
          </Typography>
        </Box>

        {/* Display Assessments (dynamic or static) */}
        <Box sx={courseDetailStyles.assessmentsSection}>
          <Typography variant="h6" sx={courseDetailStyles.sectionTitle}>
            Assessments
          </Typography>
          <List sx={courseDetailStyles.assessmentsList}>
            {assessments.map((assessment, index) => (
              <ListItem key={assessment.id} sx={courseDetailStyles.assessmentItem}>
                <ListItemText 
                  primary={`${index + 1}. ${assessment.name}`}
                  primaryTypographyProps={{ sx: courseDetailStyles.assessmentText }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={courseDetailStyles.navigationButtons}>
          <Button
            component={RouterLink} to="/student/assignment" variant="contained"
            startIcon={<AssignmentIcon />} sx={courseDetailStyles.navButton}
          >
            Assignment
          </Button>
          <Button
            component={RouterLink} to="/student/qnas" variant="contained"
            startIcon={<LiveHelpIcon />} sx={courseDetailStyles.navButton}
          >
            Q&As
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentCourseDetail;