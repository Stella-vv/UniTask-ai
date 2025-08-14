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

// Define the component for modifying an existing assignment.
const AssignmentModifyPage = () => {
  // Hooks for navigation and accessing URL parameters.
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  // State to hold the form's text input data.
  const [formData, setFormData] = useState({
    courseName: '',
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
  });

  // State to manage existing and new file uploads.
  const [existingRubric, setExistingRubric] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [newRubricFile, setNewRubricFile] = useState(null);
  const [newAttachmentFile, setNewAttachmentFile] = useState(null);

  // State for the list of available courses.
  const [courses, setCourses] = useState([]);
  // State to manage loading and form submission status.
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // State to store any error messages.
  const [error, setError] = useState('');

  // Effect to fetch initial assignment data when the component mounts.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // NOTE: Courses are currently hardcoded. This should be fetched from an API.
        const courses = [{ id: 1, name: 'COMP9900 - Capstone Project' }];
        setCourses(courses);

        // Fetch the details of the assignment to be modified.
        const response = await api.get(`/assignments/detail/${assignmentId}`);
        const assignment = response.data;
        
        console.log('Fetched assignment data:', assignment);

        // Populate the form state with the fetched data.
        setFormData({
          courseName: assignment.courseName || courses[0].name,
          courseId: assignment.course_id,
          title: assignment.name,
          description: assignment.description || '',
          dueDate: assignment.dueDate ? assignment.dueDate.split(' ')[0] : '', // Format date to YYYY-MM-DD.
        });

        // Set existing files if they are present in the fetched data.
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
  }, [assignmentId]); // Re-run effect if assignmentId changes.

  // A higher-order function to handle changes in text-based input fields.
  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  // Handler for file input changes.
  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (field === 'rubric') setNewRubricFile(file);
    if (field === 'attachment') setNewAttachmentFile(file);
  };

  // Handler for submitting the form data to the API.
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      // Use FormData to handle file uploads.
      const submitData = new FormData();
      submitData.append('name', formData.title);
      submitData.append('description', formData.description);
      submitData.append('due_date', `${formData.dueDate} 23:59:59`); // Append time to date.
      submitData.append('course_id', formData.courseId);

      // Conditionally append new rubric or a flag to delete the existing one.
      if (newRubricFile) {
        submitData.append('rubric', newRubricFile);
      } else if (!existingRubric) {
        submitData.append('delete_rubric', 'true');
      }
      
      // Conditionally append new attachment or a flag to delete the existing one.
      if (newAttachmentFile) {
        submitData.append('attachment', newAttachmentFile);
      } else if (!existingAttachment) {
        submitData.append('delete_attachment', 'true');
      }

      // Send a PUT request to update the assignment.
      await api.put(`/assignments/${assignmentId}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert('Assignment updated successfully!');
      navigate(`/tutor/assignment/${assignmentId}`); // Navigate back on success.
    } catch (err) {
      console.error('Failed to update assignment:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update assignment. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for the cancel button, with a confirmation prompt.
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      navigate(`/tutor/assignment/${assignmentId}`);
    }
  };
  
  // Display a loading indicator while fetching initial data.
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  // Determine the file names to display in the UI.
  const rubricFileName = newRubricFile?.name || existingRubric?.fileName || existingRubric?.filename || '';
  const attachmentFileName = newAttachmentFile?.name || existingAttachment?.fileName || existingAttachment?.filename || '';

  // Main component render.
  return (
    <Box sx={assignmentModifyStyles.container}>
      {/* Header section. */}
      <Box sx={assignmentModifyStyles.topHeader}>
        <EditIcon sx={assignmentModifyStyles.headerIcon} />
        <Typography variant="h4" sx={assignmentModifyStyles.headerTitle}>
          Modify Assignment
        </Typography>
      </Box>
      <Box sx={assignmentModifyStyles.formContainer}>
        {/* Display an error alert if an error exists. */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Form fields for assignment details. */}
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Course Name: <span style={{ color: '#f44336' }}>*</span></Typography>
          <FormControl fullWidth>
            {/* Course name is read-only. */}
            <Select value={formData.courseName || ''} readOnly sx={assignmentModifyStyles.selectField}>
              <MenuItem value={formData.courseName}>{formData.courseName}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Title:<span style={{ color: '#f44336' }}>*</span></Typography>
          <TextField fullWidth value={formData.title} onChange={handleInputChange('title')} sx={assignmentModifyStyles.textField} />
        </Box>
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Description:</Typography>
          <TextField fullWidth multiline rows={5} value={formData.description} onChange={handleInputChange('description')} sx={assignmentModifyStyles.textField} />
        </Box>
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Due Date:<span style={{ color: '#f44336' }}>*</span></Typography>
          <TextField type="date" value={formData.dueDate} onChange={handleInputChange('dueDate')} sx={assignmentModifyStyles.dateField} InputLabelProps={{ shrink: true }} />
        </Box>

        {/* Rubric file upload field with conditional controls. */}
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
                  {/* Show a clear icon if a file is present, otherwise show an upload icon. */}
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

        {/* Attachment file upload field with conditional controls. */}
        <Box sx={assignmentModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentModifyStyles.fieldLabel}>Attachment:</Typography>
          <TextField
            fullWidth
            value={attachmentFileName}
            placeholder="Choose Attachment(PDF, DOCX, TXT, ZIP, CSV, IPYNB, XLSX)"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  {/* Show a clear icon if a file is present, otherwise show an upload icon. */}
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

        {/* Action buttons for saving or canceling the modification. */}
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

// Export the component for use in other parts of the application.
export default AssignmentModifyPage;