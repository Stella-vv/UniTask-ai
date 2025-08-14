import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { assignmentUploadStyles } from './AssignmentUpload_style';
import api from '../../api';

// Define the component for uploading a new assignment.
const AssignmentUpload = () => {
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // State to hold all form data, including text inputs and files.
  const [formData, setFormData] = useState({
    courseName: '',
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    rubrics: null,
    attachment: null,
  });

  // State for managing the course selection dropdown.
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState('');
  // State for field-specific validation errors and submission status.
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Effect to fetch available courses when the component mounts.
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError('');
        // Fetch the list of courses from the API.
        const response = await api.get('/courses/');
        const fetchedCourses = response.data || [];
        setCourses(fetchedCourses);

        // If courses are found, set the first one as the default selection.
        if (fetchedCourses.length > 0) {
          setFormData(prev => ({
            ...prev,
            courseId: fetchedCourses[0].id,
            courseName: fetchedCourses[0].name
          }));
        } else {
          setCoursesError('No courses found. Please add a course first.');
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCoursesError('Failed to load courses. Please try again.');
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []); // Empty dependency array ensures this runs only once.

  // Handler for when a course is selected from the dropdown.
  const handleCourseChange = (event) => {
    const selectedCourseName = event.target.value;
    const selectedCourse = courses.find(course => course.name === selectedCourseName);
    
    // Update both course name and ID in the form state.
    setFormData(prev => ({
      ...prev,
      courseName: selectedCourseName,
      courseId: selectedCourse ? selectedCourse.id : ''
    }));
    // Clear validation error for the course field upon change.
    if (errors.courseName) {
      setErrors(prev => ({ ...prev, courseName: null }));
    }
  };

  // A higher-order function to handle changes in text-based input fields.
  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    // Clear validation error for the field being edited.
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // A higher-order function to handle file selection.
  const handleFileUpload = (field) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      // Clear validation error for the file field upon selection.
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    }
  };

  // A higher-order function to remove a selected file.
  const handleRemoveFile = (field) => () => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  // Helper to format the date string for the backend API.
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    return `${dateString} 23:59:59`; // Append end-of-day time.
  };

  // Function to validate the form fields before submission.
  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Please select course';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Please input assignment title';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Please select deadline';
    } else {
      // Check if the selected due date is in the past.
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.dueDate);

      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors.
  };

  // Helper function to get the current user's ID from local storage.
  const getCurrentUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        return user.id;
      }
    } catch (error) {
      console.error('Failed to get user ID:', error);
    }
    return null;
  };

  // Handler to submit the new assignment data to the API.
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userId = getCurrentUserId();
    if (!userId) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      // Use FormData to handle multipart form data (including files).
      const submitData = new FormData();
      submitData.append('name', formData.title);
      submitData.append('description', formData.description);
      submitData.append('due_date', formatDateForBackend(formData.dueDate));
      submitData.append('course_id', formData.courseId);
      submitData.append('user_id', userId);
      if (formData.rubrics) submitData.append('rubric', formData.rubrics);
      if (formData.attachment) submitData.append('attachment', formData.attachment);

      // Send a POST request to create the new assignment.
      const response = await api.post('/assignments', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('✅ Assignment created successfully:', response.data);
      alert('Assignment uploaded successfully!');
      navigate('/tutor/assignment'); // Navigate back on success.
    } catch (error) {
      console.error('❌ Upload failed:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Upload failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for the cancel button, with a confirmation prompt.
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/tutor/assignment');
    }
  };

  // Display a loading indicator while fetching courses.
  if (coursesLoading) {
    return (
      <Box sx={assignmentUploadStyles.container}>
        <Box sx={assignmentUploadStyles.topHeader}>
          <UploadIcon sx={assignmentUploadStyles.uploadIcon} />
          <Typography variant="h4" sx={assignmentUploadStyles.headerTitle}>
            Upload Assignment
          </Typography>
        </Box>
        <Box sx={assignmentUploadStyles.formContainer}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading courses...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Main component render.
  return (
    <Box sx={assignmentUploadStyles.container}>
      <Box sx={assignmentUploadStyles.topHeader}>
        <UploadIcon sx={assignmentUploadStyles.uploadIcon} />
        <Typography variant="h4" sx={assignmentUploadStyles.headerTitle}>
          Upload Assignment
        </Typography>
      </Box>

      <Box sx={assignmentUploadStyles.formContainer}>
        {/* Display an alert if there was an error loading courses. */}
        {coursesError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {coursesError}
          </Alert>
        )}

        {/* Course selection dropdown. */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Course name : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <FormControl fullWidth error={!!errors.courseName}>
            <Select
              value={formData.courseName}
              onChange={handleCourseChange}
              sx={assignmentUploadStyles.selectField}
              IconComponent={ArrowDownIcon}
              disabled={courses.length === 0}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.name}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.courseName && (
            <Typography variant="caption" color="error">{errors.courseName}</Typography>
          )}
        </Box>

        {/* Title input field. */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Title : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formData.title}
            onChange={handleInputChange('title')}
            error={!!errors.title}
            helperText={errors.title}
            sx={assignmentUploadStyles.textField}
            placeholder="Enter assignment title"
          />
        </Box>

        {/* Description text area. */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Description :
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange('description')}
            sx={assignmentUploadStyles.textField}
            placeholder="Enter assignment description"
          />
        </Box>

        {/* Due date picker. */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Due Date : <span style={{ color: '#f44336' }}>*</span>
          </Typography>
          <TextField
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange('dueDate')}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
            sx={assignmentUploadStyles.dateField}
            InputLabelProps={{ shrink: true }} // Ensures label doesn't overlap with date value.
          />
        </Box>

        {/* Rubrics file upload field. */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Rubrics :
          </Typography>
          <Box sx={assignmentUploadStyles.fileUploadContainer}>
            <TextField
              fullWidth
              value={formData.rubrics ? formData.rubrics.name : ''}
              placeholder="Choose rubric"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    {/* Show a clear icon if a file is selected, otherwise show an upload icon. */}
                    {formData.rubrics ? (
                      <IconButton onClick={handleRemoveFile('rubrics')}>
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <IconButton component="label">
                        <UploadIcon sx={{ color: '#62BBF5' }} />
                        <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileUpload('rubrics')} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={assignmentUploadStyles.textField}
            />
          </Box>
        </Box>

        {/* Attachment file upload field. */}
        <Box sx={assignmentUploadStyles.fieldContainer}>
          <Typography variant="h6" sx={assignmentUploadStyles.fieldLabel}>
            Attachment :
          </Typography>
          <Box sx={assignmentUploadStyles.fileUploadContainer}>
            <TextField
              fullWidth
              value={formData.attachment ? formData.attachment.name : ''}
              placeholder="Choose Attachment(PDF, DOCX, TXT, ZIP, CSV, IPYNB, XLSX)"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    {formData.attachment ? (
                      <IconButton onClick={handleRemoveFile('attachment')}>
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <IconButton component="label">
                        <UploadIcon sx={{ color: '#62BBF5' }} />
                        <input type="file" hidden onChange={handleFileUpload('attachment')} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={assignmentUploadStyles.textField}
            />
          </Box>
        </Box>

        {/* Action buttons for submitting or canceling the form. */}
        <Box sx={assignmentUploadStyles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading || courses.length === 0}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={assignmentUploadStyles.confirmButton}
          >
            {isLoading ? 'Uploading...' : 'Confirm'}
          </Button>
          
          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={isLoading}
            startIcon={<CloseIcon />}
            sx={assignmentUploadStyles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default AssignmentUpload;