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

const FaqModifyPage = () => {
  const navigate = useNavigate();
  const { assignmentId, faqId } = useParams();

  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [assignmentName, setAssignmentName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const assignmentRes = await api.get(`/assignments/detail/${assignmentId}`);
      setAssignmentName(assignmentRes.data.name);

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
  }, [assignmentId, faqId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    setSubmitting(true);
    try {
      await api.put(`/faqs/${faqId}`, {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
      });
      alert('FAQ updated successfully!');
      navigate(`/tutor/assignment/${assignmentId}/faqs`);
    } catch (e) {
      console.error('FAQ update failed:', e);
      const msg = e.response?.data?.message || 'Update failed. Please try again.';
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(`/tutor/assignment/${assignmentId}/faqs`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this FAQ? This action cannot be undone.')) {
      setSubmitting(true); // Disable all buttons
      try {
        // Assumes a DELETE endpoint like /api/faqs/:faqId exists
        await api.delete(`/faqs/${faqId}`);
        alert('FAQ deleted successfully!');
        navigate(`/tutor/assignment/${assignmentId}/faqs`); // Go back to the list
      } catch (e) {
        console.error('FAQ deletion failed:', e);
        const msg = e.response?.data?.message || 'Deletion failed. Please try again.';
        setErrors({ form: msg });
      } finally {
        setSubmitting(false); // Re-enable buttons
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.topHeader}>
        <Typography variant="h4" sx={styles.headerTitle}>
          Modify FAQ for: {assignmentName || `Assignment ${assignmentId}`}
        </Typography>
      </Box>

      <Box sx={styles.formContainer}>
        {errors.form && <Alert severity="error" sx={{ mb: 2 }}>{errors.form}</Alert>}
        
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

export default FaqModifyPage;