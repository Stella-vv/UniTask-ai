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
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api';
import { faqModifyStyles as styles } from './FaqModifyPage_style';

// Define the page component for modifying an existing FAQ.
const FaqModifyPage = () => {
  // Hooks for navigation and accessing URL parameters.
  const navigate = useNavigate();
  const { assignmentId, faqId } = useParams();

  // State to hold form data, assignment name, errors, and UI status.
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [assignmentName, setAssignmentName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // A memoized function to fetch initial data for the form.
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch assignment details to display the name in the header.
      const assignmentRes = await api.get(`/assignments/detail/${assignmentId}`);
      setAssignmentName(assignmentRes.data.name);

      // Fetch the specific FAQ data to populate the form.
      const faqRes = await api.get(`/faqs/${faqId}`);
      setFormData({
        question: faqRes.data.question,
        answer: faqRes.data.answer,
      });
    } catch (e) {
      console.error('Failed to fetch data:', e);
      setErrors({ form: 'Failed to load FAQ data. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [assignmentId, faqId]); // Re-run if IDs change.

  // Effect to call the data fetching function on component mount.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // Handler to submit the updated FAQ data to the API.
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      // Send a PUT request to update the FAQ.
      await api.put(`/faqs/${faqId}`, {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
      });
      alert('FAQ updated successfully!');
      // Navigate back to the FAQ list on success.
      navigate(`/tutor/assignment/${assignmentId}/faqs`);
    } catch (e) {
      console.error('FAQ update failed:', e);
      const msg = e.response?.data?.message || 'Update failed. Please try again.';
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handler for the cancel button, with a confirmation prompt.
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(`/tutor/assignment/${assignmentId}/faqs`);
    }
  };

  // Handler to delete the current FAQ after confirmation.
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this FAQ? This action cannot be undone.')) {
      setSubmitting(true); // Disable all buttons during the API call.
      try {
        await api.delete(`/faqs/${faqId}`);
        alert('FAQ deleted successfully!');
        navigate(`/tutor/assignment/${assignmentId}/faqs`); 
      } catch (e) {
        console.error('FAQ deletion failed:', e);
        const msg = e.response?.data?.message || 'Deletion failed. Please try again.';
        setErrors({ form: msg });
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Display a loading indicator while fetching initial data.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Main component render.
  return (
    <Box sx={styles.container}>
      {/* Header section with dynamic title. */}
      <Box sx={styles.topHeader}>
        <Typography variant="h4" sx={styles.headerTitle}>
          Modify FAQ for: {assignmentName || `Assignment ${assignmentId}`}
        </Typography>
      </Box>

      {/* Form container. */}
      <Box sx={styles.formContainer}>
        {/* Display a form-level error alert if an error exists. */}
        {errors.form && <Alert severity="error" sx={{ mb: 2 }}>{errors.form}</Alert>}
        
        {/* Question input field with validation. */}
        <Box sx={styles.fieldContainer}>
          <Typography variant="h6" sx={styles.fieldLabel}>
            Question: <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.question}
            onChange={handleInputChange('question')}
            error={!!errors.question}
            helperText={errors.question}
            sx={styles.textField}
            disabled={submitting}
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
            error={!!errors.answer}
            helperText={errors.answer}
            sx={styles.textField}
            disabled={submitting}
          />
        </Box>

        {/* Action buttons for saving, canceling, or deleting. */}
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={styles.confirmButton}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={submitting}
            startIcon={<CloseIcon />}
            sx={styles.cancelButton}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={submitting}
            startIcon={<DeleteIcon />}
            sx={styles.deleteButton}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default FaqModifyPage;