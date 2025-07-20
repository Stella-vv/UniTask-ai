// src/tutorworkspace/CourseModify/CourseModifyPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
// We will create this style file in the next step
import { courseModifyStyles } from './CourseModifyPage_style'; 
import api from '../../api'; // Assuming you have a centralized api handler

const CourseModifyPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams(); // Get courseId from URL

  const [formData, setFormData] = useState({
    name: '',
    year: '',
    description: '',
    semester: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch course data when component mounts
  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // This is a placeholder for your actual API endpoint
      const response = await api.get(`/courses/${courseId}`); 
      setFormData({
        name: response.data.name,
        year: response.data.year,
        description: response.data.description,
        semester: response.data.semester,
      });
    } catch (err) {
      console.error('Failed to fetch course data:', err);
      setError('Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      // This is a placeholder for your actual API endpoint to update data
      await api.put(`/courses/${courseId}`, formData); 
      alert('Course updated successfully!');
      navigate(`/course-detail`); // Navigate back to the detail page
    } catch (err) {
      console.error('Failed to update course:', err);
      setError('Failed to update course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(`/course-detail`);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={courseModifyStyles.container}>
      <Box sx={courseModifyStyles.topHeader}>
        <Typography variant="h4" sx={courseModifyStyles.headerTitle}>
          Modify Course
        </Typography>
      </Box>

      <Box sx={courseModifyStyles.formContainer}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Course Name:</Typography>
          <TextField fullWidth value={formData.name} onChange={handleInputChange('name')} />
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Year:</Typography>
          <TextField type="number" fullWidth value={formData.year} onChange={handleInputChange('year')} />
        </Box>
        
        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Semester:</Typography>
          <TextField fullWidth value={formData.semester} onChange={handleInputChange('semester')} />
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Description:</Typography>
          <TextField fullWidth multiline rows={5} value={formData.description} onChange={handleInputChange('description')} />
        </Box>

        <Box sx={courseModifyStyles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={courseModifyStyles.confirmButton}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={submitting}
            startIcon={<CloseIcon />}
            sx={courseModifyStyles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseModifyPage;