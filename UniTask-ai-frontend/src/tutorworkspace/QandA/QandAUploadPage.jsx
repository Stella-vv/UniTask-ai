// test/tutorworkspace/QandAUpload/QandAUploadPage.jsx (Modified for Assignment-specific uploads)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadPlaceholderIcon,
} from '@mui/icons-material';
import { qandaUploadPageStyles } from './QandAUploadPage_style';
import api from '../../api';

const QandAUploadPage = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams(); // Get assignmentId from URL

  const [formData, setFormData] = useState({
    attachment: null,
    description: '',
  });
  const [assignmentName, setAssignmentName] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const getCurrentUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString).id : null;
    } catch (error) {
      console.error('Failed to get user ID:', error);
      return null;
    }
  };

  const handleDescriptionChange = (event) => {
    setFormData(prev => ({ ...prev, description: event.target.value }));
  };

  const handleAttachmentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf', 'text/csv', 
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/xml', 'application/xml', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors({ attachment: 'Invalid file type. Please upload PDF, CSV, Excel, XML, or Word.' });
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors({ attachment: 'File size must be less than 10MB.' });
        return;
      }

      setFormData(prev => ({ ...prev, attachment: file }));
      setErrors(prev => ({ ...prev, attachment: null }));
    }
  };

  const handleRemoveAttachment = (event) => {
    event.stopPropagation();
    setFormData(prev => ({ ...prev, attachment: null }));
  };

  const validateForm = () => {
    if (!formData.attachment) {
      setErrors({ attachment: 'Please upload an attachment.' });
      return false;
    }
    return true;
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
      const submitData = new FormData();
      submitData.append('assignment_id', assignmentId); // Use assignment_id
      submitData.append('user_id', userId.toString());
      submitData.append('file', formData.attachment);
      if (formData.description.trim()) {
        submitData.append('description', formData.description.trim());
      }
      
      await api.post('/qa/upload', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Q&A uploaded successfully!');
      navigate(`/tutor/assignment/${assignmentId}/qnas`);
      
    } catch (error) {
      console.error('Q&A upload failed:', error);
      const errorMessage = error.response?.data?.error || 'Upload failed. Please try again.';
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(`/tutor/assignment/${assignmentId}/qnas`);
    }
  };

  return (
    <Box sx={qandaUploadPageStyles.container}>
      <Box sx={qandaUploadPageStyles.topHeader}>
        <Typography variant="h4" sx={qandaUploadPageStyles.headerTitle}>
          Upload Q&As for  {assignmentName || `Assignment ${assignmentId}`}
        </Typography>
      </Box>

      <Box sx={qandaUploadPageStyles.formContainer}>
        <Box sx={qandaUploadPageStyles.fieldContainer}>
          <Typography variant="h6" sx={qandaUploadPageStyles.fieldLabel}>
            Description:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter a description for this Q&A file (optional)"
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                borderRadius: '8px',
              },
            }}
          />
        </Box>

        <Box sx={qandaUploadPageStyles.fieldContainer}>
          <Typography variant="h6" sx={qandaUploadPageStyles.fieldLabel}>
            Attachment: <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <Box
            sx={{
              ...qandaUploadPageStyles.fileUploadArea,
              cursor: formData.attachment ? 'default' : 'pointer'
            }}
            component="label"
          >
            <input
              type="file"
              hidden
              onChange={handleAttachmentUpload}
              accept=".pdf,.csv,.xlsx,.xls,.xml,.doc,.docx"
              disabled={isLoading}
            />
            {formData.attachment ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CheckIcon sx={{ color: 'success.main', fontSize: '48px', mb: 1 }} />
                <Typography sx={qandaUploadPageStyles.uploadedFileName}>
                  {formData.attachment.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                  {(formData.attachment.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={handleRemoveAttachment} 
                  sx={{ mt: 1 }}
                  disabled={isLoading}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <>
                <CloudUploadPlaceholderIcon sx={qandaUploadPageStyles.uploadPlaceholderIcon} />
                <Typography sx={qandaUploadPageStyles.uploadPlaceholderText}>
                  Upload Q&A File
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Supported formats: PDF, CSV, Excel, XML, Word
                </Typography>
              </>
            )}
          </Box>
          {errors.attachment && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errors.attachment}
            </Typography>
          )}
        </Box>

        <Box sx={qandaUploadPageStyles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={qandaUploadPageStyles.confirmButton}
          >
            {isLoading ? 'Uploading...' : 'Confirm'}
          </Button>

          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={isLoading}
            startIcon={<CloseIcon />}
            sx={qandaUploadPageStyles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QandAUploadPage;