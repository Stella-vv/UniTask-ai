// test/tutorworkspace/CourseAdd/CourseAddPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  // --- Import new components ---
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
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
import { courseAddStyles } from './CourseAddPage_style';
import api from '../../api';

const CourseAddPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    semester: '', // Default value to empty string
    description: '',
  });

  // --- MODIFICATION: Add state for assessments ---
  const [assessments, setAssessments] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  // --- MODIFICATION: Add handlers for assessments ---
  const handleAddAssessment = () => {
    if (currentAssessment.trim()) {
      setAssessments([...assessments, currentAssessment.trim()]);
      setCurrentAssessment('');
    }
  };

  const handleRemoveAssessment = (indexToRemove) => {
    setAssessments(assessments.filter((_, index) => index !== indexToRemove));
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.year.toString().trim()) newErrors.year = 'Year is required';
    if (!/^\d{4}$/.test(formData.year)) newErrors.year = 'Please enter a valid year';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');
    try {
      // --- MODIFICATION: Add assessment data to the submission object ---
      const submissionData = {
        ...formData,
        // Convert the array to a JSON string for the backend
        assessment: JSON.stringify(assessments)
      };

      await api.post('/courses/', submissionData);
      alert('Course added successfully!');
      navigate('/tutor/course');
    } catch (err) {
      console.error('Failed to add course:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add course. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      navigate('/tutor/course');
    }
  };

  return (
    <Box sx={courseAddStyles.container}>
      <Box sx={courseAddStyles.topHeader}>
        <Typography variant="h4" sx={courseAddStyles.headerTitle}>
          Add New Course
        </Typography>
      </Box>

      <Box sx={courseAddStyles.formContainer}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Course Name and Year fields remain the same */}
        <Box sx={courseAddStyles.fieldContainer}>
            <Typography variant="h6" sx={courseAddStyles.fieldLabel}>Course Name:<span style={{ color: '#f44336' }}>*</span></Typography>
            <TextField
                fullWidth
                value={formData.name}
                onChange={handleInputChange('name')}
                sx={courseAddStyles.textField}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
            />
        </Box>

        <Box sx={courseAddStyles.fieldContainer}>
            <Typography variant="h6" sx={courseAddStyles.fieldLabel}>Year:<span style={{ color: '#f44336' }}>*</span></Typography>
            <TextField
                type="number"
                fullWidth
                value={formData.year}
                onChange={handleInputChange('year')}
                sx={courseAddStyles.textField}
                error={!!validationErrors.year}
                helperText={validationErrors.year}
            />
        </Box>

        {/* --- MODIFIED: Semester Field --- */}
        <Box sx={courseAddStyles.fieldContainer}>
          <Typography variant="h6" sx={courseAddStyles.fieldLabel}>Semester:<span style={{ color: '#f44336' }}>*</span></Typography>
          <FormControl fullWidth error={!!validationErrors.semester}>
            <Select
              value={formData.semester}
              onChange={handleInputChange('semester')}
              sx={courseAddStyles.selectField}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select a Term
              </MenuItem>
              <MenuItem value="T1">Term 1</MenuItem>
              <MenuItem value="T2">Term 2</MenuItem>
              <MenuItem value="T3">Term 3</MenuItem>
            </Select>
            {validationErrors.semester && <FormHelperText>{validationErrors.semester}</FormHelperText>}
          </FormControl>
        </Box>

        {/* Description field remains the same */}
        <Box sx={courseAddStyles.fieldContainer}>
            <Typography variant="h6" sx={courseAddStyles.fieldLabel}>Description:<span style={{ color: '#f44336' }}>*</span></Typography>
            <TextField
                fullWidth
                multiline
                rows={5}
                value={formData.description}
                onChange={handleInputChange('description')}
                sx={courseAddStyles.textField}
                error={!!validationErrors.description}
                helperText={validationErrors.description}
            />
        </Box>

        {/* --- MODIFICATION: Add UI for assessments --- */}
        <Box sx={courseAddStyles.fieldContainer}>
            <Typography variant="h6" sx={courseAddStyles.fieldLabel}>Assessments:</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    value={currentAssessment}
                    onChange={(e) => setCurrentAssessment(e.target.value)}
                    placeholder="Add an assessment item (e.g., Final Exam 40%)"
                    sx={courseAddStyles.textField}
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

        {/* Buttons remain the same */}
        <Box sx={courseAddStyles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={courseAddStyles.confirmButton}
          >
            {submitting ? 'Submitting...' : 'Confirm'}
          </Button>
          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={submitting}
            startIcon={<CloseIcon />}
            sx={courseAddStyles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseAddPage;