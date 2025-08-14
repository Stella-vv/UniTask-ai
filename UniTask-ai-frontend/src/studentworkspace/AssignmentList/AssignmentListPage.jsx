import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
import { studentAssignmentListStyles as styles } from './AssignmentListPage_style.js';

// Define the functional component to display a list of student assignments.
const StudentAssignmentList = () => {
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // Hook to access the current URL's location object (e.g., to get state passed during navigation).
  const location = useLocation(); 
  // State to store the list of assignments.
  const [assignments, setAssignments] = useState([]);
  // State to manage loading status for assignments.
  const [loading, setLoading] = useState(true);
  // State to store any errors during data fetching.
  const [error, setError] = useState(null);

  // State to store the list of available courses.
  const [courses, setCourses] = useState([]);
  // State for the currently selected course ID, initialized from location state or empty.
  const [selectedCourseId, setSelectedCourseId] = useState(location.state?.defaultCourseId || '');
  // State to manage loading status for courses.
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Effect to fetch available courses when the component mounts.
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        // Fetch the list of courses from the API.
        const res = await api.get('/courses/');
        const fetchedCourses = res.data || [];
        setCourses(fetchedCourses);

        // If no default course is provided via location state, select the first course by default.
        if (!location.state?.defaultCourseId && fetchedCourses.length > 0) {
          setSelectedCourseId(fetchedCourses[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setCoursesLoading(false); // Stop loading.
      }
    };
    fetchCourses();
  }, [location.state?.defaultCourseId]); // Dependency array to re-run if defaultCourseId changes.

  // Effect to fetch assignments whenever the selected course ID changes.
  useEffect(() => {
    // If no course is selected, clear assignments and stop loading.
    if (!selectedCourseId) {
      setLoading(false);
      setAssignments([]);
      return;
    }

    const fetchAssignments = async () => {
      try {
        setLoading(true); // Start loading.
        setError(null); // Reset errors.
        // Fetch assignments for the currently selected course.
        const response = await api.get(`/assignments/course/${selectedCourseId}`);
        setAssignments(response.data);
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
        setError('Failed to load assignments for the selected course.');
      } finally {
        setLoading(false); // Stop loading.
      }
    };

    fetchAssignments();
  }, [selectedCourseId]); // Dependency array to re-run when selectedCourseId changes.

  // Handler to navigate to the detailed view of a specific assignment.
  const handleViewAssignmentDetail = (assignmentId) => {
    navigate(`/student/assignment/${assignmentId}`);
  };

  // Handler to update the state when the user selects a different course.
  const handleCourseChange = (event) => {
    setSelectedCourseId(event.target.value);
  };

  // Main component render.
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Section */}
      <Box sx={{
        bgcolor: 'primary.main', color: 'white',
        mt: -4, ml: -4, mr: -4, width: 'calc(100% + 64px)', p: 3,
        height: '80px', display: 'flex', alignItems: 'center',
        borderTopLeftRadius: '16px', borderTopRightRadius: '16px',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.75rem' }}>
          Course Assignments
        </Typography>
      </Box>

      {/* Content Area */}
      <Box sx={{
        bgcolor: '#EFF8FF',
        ml: -4, mr: -4, width: 'calc(100% + 64px)', mb: -4, p: 4,
        flexGrow: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
      }}>
        
        {/* Course Filter Dropdown */}
        <Box sx={styles.filterContainer}>
          <FormControl sx={styles.formControl} fullWidth variant="outlined" disabled={coursesLoading}>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourseId}
              onChange={handleCourseChange}
              label="Select Course"
              sx={{ bgcolor: 'white' }}
            >
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
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleViewAssignmentDetail(assignment.id)}>
                    <ListItemText
                      primary={assignment.name}
                      secondary={assignment.dueDate ? `Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}` : 'No due date'}
                    />
                  </ListItemButton>
                </ListItem>
                {/* Add a divider between list items, but not after the last one. */}
                {index < assignments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
            No assignments found for this course.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default StudentAssignmentList;