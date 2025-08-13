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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { courseDetailStyles } from './CourseDetail_style';
import api from '../../api';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError('Could not load course details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleGoToAssignments = () => {
    if (course && course.id) {
      navigate('/tutor/assignment', { state: { defaultCourseId: course.id } });
    }
  };

  const handleGoBack = () => {
    navigate('/tutor/course');
  };

  const handleModify = () => {
    if (course && course.id) {
      
      navigate(`/tutor/course/modify/${course.id}`);
    } else {
      alert('Cannot modify course: Course ID is missing.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        setLoading(true);
        setError('');
        
        await api.delete(`/courses/${course.id}`);
        
        alert('Course deleted successfully!');
        navigate('/tutor/course');
        
      } catch (err) {
        console.error('Failed to delete course:', err);
        setError('Failed to delete the course. Please try again.');
        setLoading(false);
      }
    }
  };

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

  let assessmentsList = [];
  if (course && course.assessment) {
    try {
      const parsed = JSON.parse(course.assessment);
      if (Array.isArray(parsed)) {
        assessmentsList = parsed;
      }
    } catch (e) {
      console.error("Failed to parse assessment JSON:", e);
      assessmentsList = [];
    }
  }

  return (
    <Box sx={courseDetailStyles.container}>
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
      
      <Box sx={courseDetailStyles.contentArea}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={courseDetailStyles.titleSection}>
          <Typography variant="h4" sx={courseDetailStyles.courseTitle}>
            {course.name}
          </Typography>
          <Box sx={courseDetailStyles.actionButtons}>
            <Button 
              variant="contained" 
              startIcon={<EditIcon />}
              sx={courseDetailStyles.modifyButton}
              onClick={handleModify}
              disabled={loading} 
            >
              Modify
            </Button>
            <Button 
              variant="contained" 
              startIcon={<DeleteIcon />}
              sx={courseDetailStyles.deleteButton}
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" sx={courseDetailStyles.courseId}>
          Course ID: {course.id}
        </Typography>

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

        <Box sx={courseDetailStyles.assessmentsSection}>
          <Typography variant="h6" sx={courseDetailStyles.sectionTitle}>
            Assessments
          </Typography>
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

export default CourseDetail;