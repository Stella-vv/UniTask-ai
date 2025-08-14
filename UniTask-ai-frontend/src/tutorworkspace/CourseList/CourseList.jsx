import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

// Define the functional component to display a list of courses for a tutor.
const CourseList = () => {
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // State to store the list of courses.
  const [courses, setCourses] = useState([]);
  // State to manage the loading status of the API call.
  const [loading, setLoading] = useState(true);
  // State to store any errors that occur during data fetching.
  const [error, setError] = useState(null);

  // Effect to fetch courses from the API when the component mounts.
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Make an API GET request to fetch all courses.
        const response = await api.get('/courses/');
        setCourses(response.data);
      } catch (err) {
        // Log and set error state if the fetch fails.
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please ensure the backend is running and the endpoint is correct.');
      } finally {
        // Stop loading regardless of success or failure.
        setLoading(false);
      }
    };

    fetchCourses();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Handler to navigate to the detailed view of a specific course.
  const handleViewCourseDetail = (courseId) => {
    navigate(`/tutor/course/${courseId}`);
  };

  // Handler to navigate to the page for adding a new course.
  const handleAddCourse = () => {
    navigate('/tutor/course/add');
  };

  // Main component render.
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header section with the page title. */}
      <Box sx={{
        bgcolor: 'primary.main', color: 'white',
        mt: -4, ml: -4, mr: -4, width: 'calc(100% + 64px)', p: 3,
        display: 'flex', alignItems: 'center',
        borderTopLeftRadius: '16px', borderTopRightRadius: '16px',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.75rem' }}>
          Course List
        </Typography>
      </Box>

      {/* Main content area. */}
      <Box sx={{
        bgcolor: '#EFF8FF', flexGrow: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        ml: -4, mr: -4, width: 'calc(100% + 64px)', mb: -4, p: 4,
        borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px',
      }}>
        {/* Conditional rendering: show loader, error, course list, or no-courses message. */}
        {loading ? (
          <>
            <CircularProgress />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Loading courses...
            </Typography>
          </>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : courses.length > 0 ? (
          <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1 }}>
            {/* Map over the courses array and render each course as a list item. */}
            {courses.map((course, index) => (
              <React.Fragment key={course.id}>
                <ListItem
                  button
                  onClick={() => handleViewCourseDetail(course.id)}
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <ListItemText
                    primary={course.name}
                    secondary={`Semester ${course.semester} - ${course.year}`}
                  />
                </ListItem>
                {/* Add a divider between items, but not after the last one. */}
                {index < courses.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            No courses found.
          </Typography>
        )}

        {/* Button to navigate to the 'Add Course' page. */}
        <Button
          variant="contained"
          onClick={handleAddCourse}
          sx={{ mt: 3, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Add Course
        </Button>
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default CourseList;