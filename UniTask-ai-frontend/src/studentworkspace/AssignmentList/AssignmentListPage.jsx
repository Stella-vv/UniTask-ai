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
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { studentAssignmentListStyles as styles } from './AssignmentListPage_style.js';

const StudentAssignmentList = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Effect to fetch the list of courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const res = await api.get('/courses/');
        const fetchedCourses = res.data || [];
        setCourses(fetchedCourses);

        // --- MODIFICATION: Default to the first course ---
        if (fetchedCourses.length > 0) {
          setSelectedCourseId(fetchedCourses[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []); // This effect runs only once to populate the dropdown

  // Effect to fetch assignments based on the selected course
  useEffect(() => {
    // --- MODIFICATION: Do not fetch if no course is selected ---
    if (!selectedCourseId) {
      setLoading(false);
      setAssignments([]); // Ensure the list is empty if no course is selected
      return;
    }

    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/assignments/course/${selectedCourseId}`);
        setAssignments(response.data);
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
        setError('Failed to load assignments for the selected course.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [selectedCourseId]); // This effect re-runs whenever selectedCourseId changes

  const handleViewAssignmentDetail = (assignmentId) => {
    navigate(`/student/assignment/${assignmentId}`);
  };

  const handleCourseChange = (event) => {
    setSelectedCourseId(event.target.value);
  };

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
          {/* --- MODIFICATION: Using outlined variant for the select box --- */}
          <FormControl sx={styles.formControl} fullWidth variant="outlined" disabled={coursesLoading}>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourseId}
              onChange={handleCourseChange}
              label="Select Course"
              sx={{ bgcolor: 'white' }}
            >
              {/* You can optionally add an "All Courses" option if needed */}
              {/* <MenuItem value=""><em>All Courses</em></MenuItem> */}
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Assignment List or Status Indicator */}
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : assignments.length > 0 ? (
          <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1 }}>
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

export default StudentAssignmentList;