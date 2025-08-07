// src/tutorworkspace/AssignmentList/AssignmentListPage.jsx (Final Fix, copied from Student's working version)

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
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { tutorAssignmentListStyles as styles } from './AssignmentListPage_style.js';

const AssignmentList = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [coursesLoading, setCoursesLoading] = useState(true);

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
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
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
  }, [selectedCourseId]);

  const handleCourseChange = (event) => {
    setSelectedCourseId(event.target.value);
  };

  const handleUploadAssignment = () => {
    navigate('/tutor/assignment/upload');
  };

  const handleViewAssignmentDetail = (assignmentId) => {
    navigate(`/tutor/assignment/${assignmentId}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
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

      {/* Content Area */}
      <Box sx={styles.contentArea}>

        {/* Course Filter Dropdown */}
        <Box sx={styles.filterContainer}>
          <FormControl fullWidth disabled={coursesLoading}>
            <InputLabel>Filter by Course</InputLabel>
            {/* --- MODIFICATION: Style is applied directly to the Select component --- */}
            <Select
              value={selectedCourseId}
              onChange={handleCourseChange}
              label="Filter by Course"
              sx={{ bgcolor: 'white', borderRadius: '8px' }}
            >
              <MenuItem value="">
                <em>All Courses</em>
              </MenuItem>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Loading/Error/Content Display */}
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : assignments.length > 0 ? (
          <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1 }}>
            {assignments.map((assignment, index) => (
              <React.Fragment key={assignment.id}>
                <ListItemButton onClick={() => handleViewAssignmentDetail(assignment.id)}>
                  <ListItemText
                    primary={assignment.name}
                    secondary={assignment.dueDate ? `Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}` : 'No due date'}
                  />
                </ListItemButton>
                {index < assignments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No assignments found.
          </Typography>
        )}
        
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

export default AssignmentList;