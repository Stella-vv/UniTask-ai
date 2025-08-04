// src/tutorworkspace/faqs/FaqUpload.jsx (Modified for Assignment-specific uploads)

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

const FaqUpload = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams(); // Get assignmentId from URL

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });
  const [assignmentName, setAssignmentName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch assignment name for the header
  const fetchAssignmentName = useCallback(async () => {
      if (assignmentId) {
        try {
          const response = await api.get(`/assignments/detail/${assignmentId}`);
          setAssignmentName(response.data.name);
        } catch (err) {
          console.error("Failed to fetch assignment name:", err);
        }
      }
  }, [assignmentId]);

  useEffect(() => {
    fetchAssignmentName();
  }, [fetchAssignmentName]);

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString).id : null;
    } catch (e) {
      console.error('Failed to get user ID:', e);
      return null;
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.question.trim()) newErrors.question = 'Please enter a question.';
    if (!formData.answer.trim()) newErrors.answer = 'Please enter an answer.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userId = getCurrentUserId();
    if (!userId) {
      alert('Please login first.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const body = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        uploaded_by: userId,
        assignment_id: assignmentId, // Use assignment_id
      };
      
      // IMPORTANT: This requires a backend endpoint like POST /api/faqs/assignment
      await api.post('/faqs/', body);
      alert('FAQ uploaded successfully!');
      
      navigate(`/tutor/assignment/${assignmentId}/faqs`); // Navigate back to the assignment's FAQ list

    } catch (e) {
      console.error('FAQ upload failed:', e);
      const msg = e.response?.data?.message || 'Upload failed. Please try again.';
      alert(`Upload failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(`/tutor/assignment/${assignmentId}/faqs`);
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.topHeader}>
        <Typography variant="h4" sx={styles.headerTitle}>
          Upload FAQ for  {assignmentName || `Assignment ${assignmentId}`}
        </Typography>
      </Box>

      <Box sx={styles.formContainer}>
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

export default FaqUpload;