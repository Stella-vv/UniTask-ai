// test/tutorworkspace/CourseDetail/CourseDetail.jsx (Modified for dynamic data)

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

// In a real app, this ID might come from user selection or another part of the state.
const COURSE_ID_TO_DISPLAY = 1;

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
        // Fetch a specific course. Replace with your actual logic if needed.
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
  }, []);

  const handleModify = () => {
    if (course && course.id) {
      navigate(`/tutor/course-modify/${course.id}`);
    } else {
      alert('Cannot modify course: Course ID is missing.');
    }
  };

  const handleDelete = () => {
    // Implement delete logic here.
    // Make sure to ask for confirmation.
    if (window.confirm('Are you sure you want to delete this course?')) {
      console.log('Deleting course:', course.id);
      // await api.delete(`/courses/${course.id}`);
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

  // NOTE: This assumes the 'assessments' data is part of the course object from the API.
  // If not, you may need to adjust this part.
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
          <Box sx={courseDetailStyles.actionButtons}>
            <Button 
              variant="contained" 
              startIcon={<EditIcon />}
              sx={courseDetailStyles.modifyButton}
              onClick={handleModify} // Added onClick handler
            >
              Modify
            </Button>
            <Button 
              variant="contained" 
              startIcon={<DeleteIcon />}
              sx={courseDetailStyles.deleteButton}
              onClick={handleDelete} // Added onClick handler
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Typography variant="h6" sx={courseDetailStyles.courseId}>
          Course ID: {course.id}
        </Typography>

        <Box sx={{ mb: 2 }}> {/* Added a Box for better spacing */}
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
          <Button
            component={RouterLink} to="/tutor/qnas" variant="contained"
            startIcon={<LiveHelpIcon />} sx={courseDetailStyles.navButton}
          >
            Q&As
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetail;