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
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
        setLoading(true); // Show a loading state during deletion
        setError('');
        
        await api.delete(`/courses/${course.id}`);
        
        alert('Course deleted successfully!');
        navigate('/tutor/course'); // Navigate back to the course list
        
      } catch (err) {
        console.error('Failed to delete course:', err);
        setError('Failed to delete the course. Please try again.');
        setLoading(false); // Turn off loading on error
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
        {/* Display error message if deletion fails */}
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
              disabled={loading} // Disable button while loading/deleting
            >
              Modify
            </Button>
            <Button 
              variant="contained" 
              startIcon={<DeleteIcon />}
              sx={courseDetailStyles.deleteButton}
              onClick={handleDelete}
              disabled={loading} // Disable button while loading/deleting
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

        <Box sx={courseDetailStyles.navigationButtons}>
          <Button
            component={RouterLink} to="/tutor/assignment" variant="contained"
            startIcon={<AssignmentIcon />} sx={courseDetailStyles.navButton}
          >
            Assignment
          </Button>
          {/* <Button
            // Navigate to Q&As
            component={RouterLink} to="/tutor/assignment/${assignmentId}/qnas" variant="contained"
            startIcon={<LiveHelpIcon />} sx={courseDetailStyles.navButton}
          >
            Q&As
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetail;