import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../api';
import { faqUploadStyles as styles } from './FaqUpload_style';

// Define the component for uploading a new FAQ for an assignment.
const FaqUpload = () => {
  // Hooks for navigation and accessing URL parameters.
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  // State to hold form data, assignment name, errors, and loading status.
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });
  const [assignmentName, setAssignmentName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // A memoized function to fetch the parent assignment's name for display.
  const fetchAssignmentName = useCallback(async () => {
      if (assignmentId) {
        try {
          const response = await api.get(`/assignments/detail/${assignmentId}`);
          setAssignmentName(response.data.name);
        } catch (err) {
          console.error("Failed to fetch assignment name:", err);
        }
      }
  }, [assignmentId]); // Re-run if assignmentId changes.

  // Effect to fetch the assignment name when the component mounts.
  useEffect(() => {
    fetchAssignmentName();
  }, [fetchAssignmentName]);

  // Helper function to get the current user's ID from local storage.
  const getCurrentUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString).id : null;
    } catch (e) {
      console.error('Failed to get user ID:', e);
      return null;
    }
  };

  // A higher-order function to handle changes in form inputs.
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear the validation error for the field being edited.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // Function to validate the form fields before submission.
  const validateForm = () => {
    const newErrors = {};
    if (!formData.question.trim()) newErrors.question = 'Please enter a question.';
    if (!formData.answer.trim()) newErrors.answer = 'Please enter an answer.';
    setErrors(newErrors);
    // Return true if there are no errors.
    return Object.keys(newErrors).length === 0;
  };

  // Handler to submit the new FAQ data to the API.
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Ensure the user is logged in before submitting.
    const userId = getCurrentUserId();
    if (!userId) {
      alert('Please login first.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare the data payload for the API request.
      const body = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        uploaded_by: userId,
        assignment_id: assignmentId,
      };
    
      // Send a POST request to create the new FAQ.
      await api.post('/faqs/', body);
      alert('FAQ uploaded successfully!');
      
      // Navigate back to the FAQ list on success.
      navigate(`/tutor/assignment/${assignmentId}/faqs`); 
    } catch (e) {
      console.error('FAQ upload failed:', e);
      const msg = e.response?.data?.message || 'Upload failed. Please try again.';
      alert(`Upload failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for the cancel button, with a confirmation prompt.
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(`/tutor/assignment/${assignmentId}/faqs`);
    }
  };

  // Main component render.
  return (
    <Box sx={styles.container}>
      {/* Header section with dynamic title. */}
      <Box sx={styles.topHeader}>
        <Typography variant="h4" sx={styles.headerTitle}>
          Upload FAQ for  {assignmentName || `Assignment ${assignmentId}`}
        </Typography>
      </Box>

      {/* Form container. */}
      <Box sx={styles.formContainer}>
        {/* Question input field with validation. */}
        <Box sx={styles.fieldContainer}>
          <Typography variant="h6" sx={styles.fieldLabel}>
            Question: <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.question}
            onChange={handleInputChange('question')}
            placeholder="Enter the question"
            error={!!errors.question}
            helperText={errors.question}
            sx={styles.textField}
            disabled={isLoading}
          />
        </Box>

        {/* Answer text area with validation. */}
        <Box sx={styles.fieldContainer}>
          <Typography variant="h6" sx={styles.fieldLabel}>
            Answer: <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.answer}
            onChange={handleInputChange('answer')}
            placeholder="Enter the answer"
            error={!!errors.answer}
            helperText={errors.answer}
            sx={styles.textField}
            disabled={isLoading}
          />
        </Box>

        {/* Action buttons for submitting or canceling the form. */}
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={styles.confirmButton}
          >
            {isLoading ? 'Uploading...' : 'Confirm'}
          </Button>

          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={isLoading}
            startIcon={<CloseIcon />}
            sx={styles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default FaqUpload;