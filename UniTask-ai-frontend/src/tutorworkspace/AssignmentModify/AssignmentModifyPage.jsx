// test/tutorworkspace/AssignmentModify/AssignmentModifyPage.jsx (Final Corrected Version)

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { assignmentModifyStyles } from './AssignmentModifyPage_style';
import api from '../../api';

const AssignmentModifyPage = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  const [formData, setFormData] = useState({
    courseName: '',
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
  });

  const [existingRubric, setExistingRubric] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [newRubricFile, setNewRubricFile] = useState(null);
  const [newAttachmentFile, setNewAttachmentFile] = useState(null);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const courses = [{ id: 1, name: 'COMP9900 - Capstone Project' }];
        setCourses(courses);

        const response = await api.get(`/assignments/detail/${assignmentId}`);
        const assignment = response.data;
        
        console.log('Fetched assignment data:', assignment);

        setFormData({
          courseName: assignment.courseName || courses[0].name,
          courseId: assignment.course_id,
          title: assignment.name,
          description: assignment.description || '',
          dueDate: assignment.dueDate ? assignment.dueDate.split(' ')[0] : '',
        });

        if (assignment.rubric) setExistingRubric(assignment.rubric);
        if (assignment.attachments && assignment.attachments.length > 0) {
            setExistingAttachment(assignment.attachments[0]);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load assignment data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (field === 'rubric') setNewRubricFile(file);
    if (field === 'attachment') setNewAttachmentFile(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const submitData = new FormData();
      submitData.append('name', formData.title);
      submitData.append('description', formData.description);
      submitData.append('due_date', `${formData.dueDate} 23:59:59`);
      submitData.append('course_id', formData.courseId);

      if (newRubricFile) {
        submitData.append('rubric', newRubricFile);
      } else if (!existingRubric) {
        submitData.append('delete_rubric', 'true');
      }
      
      if (newAttachmentFile) {
        submitData.append('attachment', newAttachmentFile);
      } else if (!existingAttachment) {
        submitData.append('delete_attachment', 'true');
      }

      await api.put(`/assignments/${assignmentId}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert('Assignment updated successfully!');
      navigate(`/tutor/assignment-detail/${assignmentId}`);
    } catch (err) {
      console.error('Failed to update assignment:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update assignment. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      navigate(`/tutor/assignment-detail/${assignmentId}`);
    }
  };
  
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  const rubricFileName = newRubricFile?.name || existingRubric?.fileName || existingRubric?.filename || '';
  const attachmentFileName = newAttachmentFile?.name || existingAttachment?.fileName || existingAttachment?.filename || '';

  return (
    <Box sx={assignmentModifyStyles.container}>
      <Box sx={assignmentModifyStyles.topHeader}>
        <EditIcon sx={assignmentModifyStyles.headerIcon} />
        <Typography variant="h4" sx={assignmentModifyStyles.headerTitle}>
          Modify Assignment
        </Typography>
      </Box>
      <Box sx={assignmentModifyStyles.formContainer}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Course Name */}
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Course Name:</Typography>
          <FormControl fullWidth>
            <Select value={formData.courseName || ''} readOnly sx={assignmentModifyStyles.selectField}>
              <MenuItem value={formData.courseName}>{formData.courseName}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* Title, Description, Due Date */}
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Title:</Typography>
          <TextField fullWidth value={formData.title} onChange={handleInputChange('title')} sx={assignmentModifyStyles.textField} />
        </Box>
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Description:</Typography>
          <TextField fullWidth multiline rows={5} value={formData.description} onChange={handleInputChange('description')} sx={assignmentModifyStyles.textField} />
        </Box>
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Due Date:</Typography>
          <TextField type="date" value={formData.dueDate} onChange={handleInputChange('dueDate')} sx={assignmentModifyStyles.dateField} InputLabelProps={{ shrink: true }} />
        </Box>
        
        {/* --- Rubrics File Input (Direct JSX) --- */}
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Rubrics:</Typography>
          <TextField
            fullWidth
            value={rubricFileName}
            placeholder="Choose Rubrics"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  {rubricFileName ? (
                    <IconButton onClick={() => { setNewRubricFile(null); setExistingRubric(null); }}>
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    <IconButton component="label">
                      <UploadIcon sx={{ color: '#62BBF5' }} />
                      <input type="file" hidden onChange={(e) => handleFileUpload('rubric', e)} />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            sx={assignmentModifyStyles.textField}
          />
        </Box>
        
        {/* --- Attachment File Input (Direct JSX) --- */}
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Attachment:</Typography>
          <TextField
            fullWidth
            value={attachmentFileName}
            placeholder="Choose Attachment"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  {attachmentFileName ? (
                    <IconButton onClick={() => { setNewAttachmentFile(null); setExistingAttachment(null); }}>
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    <IconButton component="label">
                      <UploadIcon sx={{ color: '#62BBF5' }} />
                      <input type="file" hidden onChange={(e) => handleFileUpload('attachment', e)} />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            sx={assignmentModifyStyles.textField}
          />
        </Box>

        {/* Action Buttons */}
        <Box sx={assignmentModifyStyles.buttonContainer}>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting || loading} startIcon={submitting ? <CircularProgress size={20} /> : <CheckIcon />} sx={assignmentModifyStyles.confirmButton}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="contained" onClick={handleCancel} disabled={submitting} startIcon={<CloseIcon />} sx={assignmentModifyStyles.cancelButton}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentModifyPage;