// test/tutorworkspace/CourseModify/CourseModifyPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { courseModifyStyles } from './CourseModifyPage_style';
import api from '../../api';

const CourseModifyPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    year: '',
    description: '',
    semester: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
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
      await api.put(`/courses/${courseId}`, formData);
      alert('Course updated successfully!');
      navigate(`/tutor/course-detail/${courseId}`);
    } catch (err) {
      console.error('Failed to update course:', err);
      setError('Failed to update course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(`/tutor/course-detail/${courseId}`);
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
          <TextField fullWidth value={formData.name} onChange={handleInputChange('name')} sx={courseModifyStyles.textField}/>
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Year:</Typography>
          <TextField type="number" fullWidth value={formData.year} onChange={handleInputChange('year')} sx={courseModifyStyles.textField}/>
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Semester:</Typography>
          <FormControl fullWidth>
            <Select
              value={formData.semester}
              onChange={handleInputChange('semester')}
              sx={courseModifyStyles.selectField}
            >
              <MenuItem value="T1">Term 1</MenuItem>
              <MenuItem value="T2">Term 2</MenuItem>
              <MenuItem value="T3">Term 3</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Description:</Typography>
          <TextField fullWidth multiline rows={5} value={formData.description} onChange={handleInputChange('description')} sx={courseModifyStyles.textField}/>
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