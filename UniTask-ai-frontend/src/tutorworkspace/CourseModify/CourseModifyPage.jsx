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
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    Add as AddIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
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

  const [assessments, setAssessments] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/courses/${courseId}`);

      const courseData = response.data;
      setFormData({
        name: courseData.name,
        year: courseData.year,
        description: courseData.description,
        semester: courseData.semester,
      });

      if (courseData.assessment) {
          try {
              const parsed = JSON.parse(courseData.assessment);
              if (Array.isArray(parsed)) {
                  setAssessments(parsed);
              }
          } catch (e) {
              console.error("Could not parse assessment JSON from DB:", e);
              setAssessments([courseData.assessment]);
          }
      }

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

  const handleAddAssessment = () => {
    if (currentAssessment.trim()) {
      setAssessments([...assessments, currentAssessment.trim()]);
      setCurrentAssessment('');
    }
  };

  const handleRemoveAssessment = (indexToRemove) => {
    setAssessments(assessments.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const submissionData = {
        ...formData,
        assessment: JSON.stringify(assessments)
      };
      await api.put(`/courses/${courseId}`, submissionData);
      alert('Course updated successfully!');
      navigate(`/tutor/course/${courseId}`); 
    } catch (err) {
      console.error('Failed to update course:', err);
      setError('Failed to update course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(`/tutor/course/${courseId}`); 
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
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Course Name:<span style={{ color: '#f44336' }}>*</span></Typography>
          <TextField fullWidth value={formData.name} onChange={handleInputChange('name')} sx={courseModifyStyles.textField}/>
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Year:<span style={{ color: '#f44336' }}>*</span></Typography>
          <TextField type="number" fullWidth value={formData.year} onChange={handleInputChange('year')} sx={courseModifyStyles.textField}/>
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Semester:<span style={{ color: '#f44336' }}>*</span></Typography>
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
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Description:<span style={{ color: '#f44336' }}>*</span></Typography>
          <TextField fullWidth multiline rows={5} value={formData.description} onChange={handleInputChange('description')} sx={courseModifyStyles.textField}/>
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
            <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Assessments:</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    value={currentAssessment}
                    onChange={(e) => setCurrentAssessment(e.target.value)}
                    placeholder="Add an assessment item (e.g., Final Exam 40%)"
                    sx={courseModifyStyles.textField}
                />
                <Button variant="contained" onClick={handleAddAssessment} startIcon={<AddIcon />}>Add</Button>
            </Box>
            <List dense>
                {assessments.map((item, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveAssessment(index)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={item} />
                    </ListItem>
                ))}
            </List>
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