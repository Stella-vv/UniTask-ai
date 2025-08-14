import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import { tutorAssignmentListStyles as styles } from './AssignmentListPage_style.js';

// Define the component to display a list of assignments for a tutor.
const AssignmentList = () => {
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // Hook to access the current URL's location object.
  const location = useLocation(); 
  // State to store the list of assignments.
  const [assignments, setAssignments] = useState([]);
  // State to manage loading status for assignments.
  const [loading, setLoading] = useState(false);
  // State to store any errors during data fetching.
  const [error, setError] = useState(null);

  // State for the list of courses used in the filter.
  const [courses, setCourses] = useState([]);
  // State for the currently selected course ID, initialized from location state or empty.
  const [selectedCourseId, setSelectedCourseId] = useState(location.state?.defaultCourseId || '');
  // State to track loading status for courses.
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Effect to fetch available courses when the component mounts.
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const response = await api.get('/courses/');
        setCourses(response.data || []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []); // Empty dependency array ensures this runs only once.

  // Effect to fetch assignments when the component mounts or the selected course changes.
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        // Fetch assignments for a specific course or all assignments if none is selected.
        if (selectedCourseId) {
          response = await api.get(`/assignments/course/${selectedCourseId}`);
        } else {
          response = await api.get('/assignments');
        }
        setAssignments(response.data);
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
        setError('Failed to load assignments. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [selectedCourseId]); // Re-run this effect when the selected course ID changes.

  // Handler to update state when the user changes the course filter.
  const handleCourseChange = (event) => {
    setSelectedCourseId(event.target.value);
  };

  // Handler to navigate to the assignment upload page.
  const handleUploadAssignment = () => {
    navigate('/tutor/assignment/upload');
  };

  // Handler to navigate to the detailed view of a specific assignment.
  const handleViewAssignmentDetail = (assignmentId) => {
    navigate(`/tutor/assignment/${assignmentId}`);
  };

  // Main component render.
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header section with the page title. */}
      <Box sx={{
        bgcolor: 'primary.main', color: 'white',
        mt: -4, ml: -4, mr: -4, width: 'calc(100% + 64px)', p: 3,
        height: '80px', display: 'flex', alignItems: 'center',
        borderTopLeftRadius: '16px', borderTopRightRadius: '16px',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.75rem' }}>
          Assignment List
        </Typography>
      </Box>

      {/* Main content area. */}
      <Box sx={styles.contentArea}>

        {/* Course filter dropdown menu. */}
        <Box sx={styles.filterContainer}>
          <FormControl fullWidth disabled={coursesLoading}>
            <InputLabel>Filter by Course</InputLabel>
            <Select
              value={selectedCourseId}
              onChange={handleCourseChange}
              label="Filter by Course"
              sx={{ bgcolor: 'white', borderRadius: '8px' }}
            >
              <MenuItem value="">
                <em>All Courses</em>
              </MenuItem>
              {/* Map over fetched courses to create dropdown options. */}
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Conditional rendering: show loader, error, assignment list, or no-assignments message. */}
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : assignments.length > 0 ? (
          <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1 }}>
            {/* Map over assignments and render each as a list item. */}
            {assignments.map((assignment, index) => (
              <React.Fragment key={assignment.id}>
                <ListItemButton onClick={() => handleViewAssignmentDetail(assignment.id)}>
                  <ListItemText
                    primary={assignment.name}
                    secondary={assignment.dueDate ? `Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}` : 'No due date'}
                  />
                </ListItemButton>
                {/* Add a divider between items, but not after the last one. */}
                {index < assignments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No assignments found.
          </Typography>
        )}
        
        {/* Button to navigate to the assignment upload page. */}
        <Button
          variant="contained"
          onClick={handleUploadAssignment}
          sx={styles.uploadButton}
        >
          Upload Assignment
        </Button>
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default AssignmentList;