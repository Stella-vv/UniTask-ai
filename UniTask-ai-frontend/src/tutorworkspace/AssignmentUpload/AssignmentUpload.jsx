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

const AssignmentUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseName: '',
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    rubrics: null,
    attachment: null,
  });

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError('');
        const response = await api.get('/courses/');
        const fetchedCourses = response.data || [];
        setCourses(fetchedCourses);

        if (fetchedCourses.length > 0) {
          setFormData(prev => ({
            ...prev,
            courseId: fetchedCourses[0].id
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
  }, []);

  const handleCourseChange = (event) => {
    const selectedCourseName = event.target.value;
    const selectedCourse = courses.find(course => course.name === selectedCourseName);
    
    setFormData(prev => ({
      ...prev,
      courseName: selectedCourseName,
      courseId: selectedCourse ? selectedCourse.id : ''
    }));
    if (errors.courseName) {
      setErrors(prev => ({
        ...prev,
        courseName: null
      }));
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleFileUpload = (field) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));

      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: null
        }));
      }
    }
  };

  const handleRemoveFile = (field) => () => {
    setFormData(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    return `${dateString} 23:59:59`;
  };

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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.dueDate);

      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCurrentUserId = () => {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        console.log('Current user:', user);
        return user.id;
      }
    } catch (error) {
      console.error('Failed to get user ID:', error);
    }
    return null;
  };

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  const userId = getCurrentUserId();
  if (!userId) {
    alert('Please login first');
    navigate('/login');
    return;
  }

  setIsLoading(true);

  try {
    const submitData = new FormData();
    submitData.append('name', formData.title);
    submitData.append('description', formData.description);
    submitData.append('due_date', formatDateForBackend(formData.dueDate));
    submitData.append('course_id', formData.courseId);
    submitData.append('user_id', userId);
    if (formData.rubrics) submitData.append('rubric', formData.rubrics);
    if (formData.attachment) submitData.append('attachment', formData.attachment);

    console.log(' Submitting assignment data (FormData)...');

    const response = await api.post('/assignments', submitData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('✅ Assignment created successfully:', response.data);
    alert('Assignment uploaded successfully!');
    navigate('/tutor/assignment');

  } catch (error) {
    console.error('❌ Upload failed:', error);

    const errorMessage = error.response?.data?.error ||
                         error.response?.data?.message ||
                         'Upload failed. Please try again.';
    alert(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/tutor/assignment');
      console.log('Cancel action');
    }
  };

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

  return (
          <Box sx={assignmentUploadStyles.container}>
      <Box sx={assignmentUploadStyles.topHeader}>
        <UploadIcon sx={assignmentUploadStyles.uploadIcon} />
        <Typography variant="h4" sx={assignmentUploadStyles.headerTitle}>
          Upload Assignment
        </Typography>
      </Box>

      <Box sx={assignmentUploadStyles.formContainer}>
        {coursesError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {coursesError}
          </Alert>
        )}

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
            <Typography variant="caption" color="error">
              {errors.courseName}
            </Typography>
          )}
        </Box>

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
          />
        </Box>

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
                    {formData.rubrics ? (
                      <IconButton onClick={handleRemoveFile('rubrics')}>
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <IconButton component="label">
                        <UploadIcon sx={{ color: '#62BBF5' }} />
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload('rubrics')}
                        />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={assignmentUploadStyles.textField}
            />
          </Box>
        </Box>

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
                        <input
                          type="file"
                          hidden
                          onChange={handleFileUpload('attachment')}
                        />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={assignmentUploadStyles.textField}
            />
          </Box>
        </Box>

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

export default AssignmentUpload;