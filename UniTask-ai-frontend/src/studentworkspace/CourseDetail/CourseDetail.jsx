import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { courseDetailStyles } from './CourseDetail_style';
import api from '../../api';

// Define the component to show details for a single course.
const StudentCourseDetail = () => {
  // Get the 'courseId' from the URL parameters.
  const { courseId } = useParams();
  // State to hold the fetched course data.
  const [course, setCourse] = useState(null);
  // State to manage the loading status of the API call.
  const [loading, setLoading] = useState(true);
  // State to store any errors that occur during data fetching.
  const [error, setError] = useState('');
  // Hook for programmatic navigation.
  const navigate = useNavigate(); 

  // Effect to fetch course details when the component mounts or courseId changes.
  useEffect(() => {
    const fetchCourse = async () => {
      // Ensure courseId is available before making an API call.
      if (!courseId) {
          setError('Course ID not found in URL.');
          setLoading(false);
          return;
      }
      try {
        setLoading(true);
        setError('');
        // Fetch data for the specific course using its ID.
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError('Could not load course details. Please try again.');
      } finally {
        setLoading(false); // Stop loading regardless of outcome.
      }
    };
    fetchCourse();
  }, [courseId]); // Dependency array ensures this runs when courseId changes.

  // Handler to navigate back to the main course list page.
  const handleGoBack = () => {
    navigate('/student/course');
  };

  // Handler to navigate to the assignment page for this course.
  const handleGoToAssignments = () => {
    if (course && course.id) {
      // Navigate and pass the course ID in the location state.
      navigate('/student/assignment', { state: { defaultCourseId: course.id } });
    }
  };

  // Conditional rendering for the loading state.
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

  // Conditional rendering for an error state or if no course is found.
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

  // Parse the assessment data, which is expected to be a JSON string.
  let assessmentsList = [];
  if (course && course.assessment) {
    try {
      // Safely parse the JSON string into an array.
      const parsed = JSON.parse(course.assessment);
      if (Array.isArray(parsed)) {
        assessmentsList = parsed;
      }
    } catch (e) {
      // Log error if parsing fails and keep the list empty.
      console.error("Failed to parse assessment JSON:", e);
      assessmentsList = [];
    }
  }

  // Main component render.
  return (
    <Box sx={courseDetailStyles.container}>
      {/* Header section with title and back button. */}
      <Box sx={courseDetailStyles.topBlueHeader}>
        <Typography variant="h4" sx={courseDetailStyles.headerTitle}>
          Course Detail
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={courseDetailStyles.backButton}
        >
          Back
        </Button>
      </Box>
      
      {/* Main content area for course details. */}
      <Box sx={courseDetailStyles.contentArea}>
        <Box sx={courseDetailStyles.titleSection}>
          <Typography variant="h4" sx={courseDetailStyles.courseTitle}>
            {course.name}
          </Typography>
        </Box>

        <Typography variant="h6" sx={courseDetailStyles.courseId}>
          Course ID: {course.id}
        </Typography>

        {/* Course availability information. */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={courseDetailStyles.sectionTitle}>
              Availability:
          </Typography>
          <Typography variant="body1" sx={{ ...courseDetailStyles.summaryText, fontSize: '1rem'}}>
            This course is open in semester {course.semester} of {course.year}
          </Typography>
        </Box>
        
        {/* Course summary/description. */}
        <Box sx={courseDetailStyles.summarySection}>
          <Typography variant="h6" sx={courseDetailStyles.sectionTitle}>
            Course Summary
          </Typography>
          <Typography variant="body1" sx={courseDetailStyles.summaryText}>
            {course.description}
          </Typography>
        </Box>

        {/* Assessments section. */}
        <Box sx={courseDetailStyles.assessmentsSection}>
          <Typography variant="h6" sx={courseDetailStyles.sectionTitle}>
            Assessments
          </Typography>
          {/* Conditionally render the list of assessments or a message. */}
          {assessmentsList.length > 0 ? (
            <List sx={courseDetailStyles.assessmentsList}>
              {assessmentsList.map((assessmentItem, index) => (
                <ListItem key={index} sx={courseDetailStyles.assessmentItem}>
                  <ListItemText 
                    primary={`${index + 1}. ${assessmentItem}`}
                    primaryTypographyProps={{ sx: courseDetailStyles.assessmentText }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={courseDetailStyles.summaryText}>
              No assessment information provided for this course.
            </Typography>
          )}
        </Box>

        {/* Section with navigation buttons. */}
        <Box sx={courseDetailStyles.navigationButtons}>
          <Button
            onClick={handleGoToAssignments}
            variant="contained"
            startIcon={<AssignmentIcon />} 
            sx={courseDetailStyles.navButton}
          >
            Assignment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Export the component for use elsewhere.
export default StudentCourseDetail;