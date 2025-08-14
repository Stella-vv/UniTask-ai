import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Define the page component for adding a new course.
const CourseAddPage = () => {
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // State to hold the main form data for the new course.
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    semester: '', 
    description: '',
  });

  // State to manage the list of assessments for the course.
  const [assessments, setAssessments] = useState([]);
  // State for the current assessment item being typed by the user.
  const [currentAssessment, setCurrentAssessment] = useState('');

  // State to track form submission status and errors.
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  // State to hold field-specific validation errors.
  const [validationErrors, setValidationErrors] = useState({});

  // A higher-order function to handle changes in form inputs.
  const handleInputChange = (field) => (event) => {
    // Update the form data state.
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    // Clear the validation error for the field being edited.
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handler to add the current assessment text to the assessments list.
  const handleAddAssessment = () => {
    if (currentAssessment.trim()) {
      setAssessments([...assessments, currentAssessment.trim()]);
      setCurrentAssessment(''); // Clear the input field.
    }
  };

  // Handler to remove an assessment from the list by its index.
  const handleRemoveAssessment = (indexToRemove) => {
    setAssessments(assessments.filter((_, index) => index !== indexToRemove));
  };


  // Function to validate the form fields before submission.
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.year.toString().trim()) newErrors.year = 'Year is required';
    if (!/^\d{4}$/.test(formData.year)) newErrors.year = 'Please enter a valid year';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setValidationErrors(newErrors);
    // Return true if there are no errors.
    return Object.keys(newErrors).length === 0;
  };

  // Handler to submit the new course data to the API.
  const handleSubmit = async () => {
    // Stop submission if validation fails.
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');
    try {
      // Prepare the data for submission, stringifying the assessments array.
      const submissionData = {
        ...formData,
        assessment: JSON.stringify(assessments)
      };

      // Send a POST request to create the new course.
      await api.post('/courses/', submissionData);
      alert('Course added successfully!');
      navigate('/tutor/course'); // Navigate back on success.
    } catch (err) {
      console.error('Failed to add course:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add course. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for the cancel button, with a confirmation prompt.
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      navigate('/tutor/course');
    }
  };

  // Main component render.
  return (
    <Box sx={courseAddStyles.container}>
      {/* Header section. */}
      <Box sx={courseAddStyles.topHeader}>
        <Typography variant="h4" sx={courseAddStyles.headerTitle}>
          Add New Course
        </Typography>
      </Box>

      {/* Form container. */}
      <Box sx={courseAddStyles.formContainer}>
        {/* Display a global error alert if an error exists. */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Course Name input field with validation. */}
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

        {/* Year input field with validation. */}
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

        {/* Semester selection dropdown with validation. */}
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

        {/* Description text area with validation. */}
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

        {/* Section for adding and listing assessment items. */}
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
            {/* List of currently added assessments. */}
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

        {/* Action buttons for submitting or canceling the form. */}
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

// Export the component for use in other parts of the application.
export default CourseAddPage;