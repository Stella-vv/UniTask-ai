import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses/');
        setCourses(response.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please ensure the backend is running and the endpoint is correct.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewCourseDetail = (courseId) => {
    navigate(`/tutor/course/${courseId}`);
  };

  const handleAddCourse = () => {
    navigate('/tutor/course/add');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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

      <Box sx={{
        bgcolor: '#EFF8FF', flexGrow: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        ml: -4, mr: -4, width: 'calc(100% + 64px)', mb: -4, p: 4,
        borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px',
      }}>
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
                {index < courses.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            No courses found.
          </Typography>
        )}

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

export default CourseList;