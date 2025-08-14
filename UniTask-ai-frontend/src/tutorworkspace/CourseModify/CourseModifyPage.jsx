import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { courseModifyStyles } from './CourseModifyPage_style';
import api from '../../api';

// Define the page component for modifying an existing course.
const CourseModifyPage = () => {
  // Hooks for navigation and accessing URL parameters.
  const navigate = useNavigate();
  const { courseId } = useParams();

  // State to hold the main form data for the course being edited.
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    description: '',
    semester: '',
  });

  // State to manage the list of assessments for the course.
  const [assessments, setAssessments] = useState([]);
  // State for the current assessment item being typed by the user.
  const [currentAssessment, setCurrentAssessment] = useState('');

  // State to track loading and form submission status.
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // State to store any error messages.
  const [error, setError] = useState('');

  // A memoized function to fetch the course data.
  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch the details of the specific course to be modified.
      const response = await api.get(`/courses/${courseId}`);

      const courseData = response.data;
      // Populate the form state with the fetched data.
      setFormData({
        name: courseData.name,
        year: courseData.year,
        description: courseData.description,
        semester: courseData.semester,
      });

      // Safely parse the 'assessment' field, which is stored as a JSON string.
      if (courseData.assessment) {
          try {
              const parsed = JSON.parse(courseData.assessment);
              if (Array.isArray(parsed)) {
                  setAssessments(parsed);
              }
          } catch (e) {
              // Fallback for improperly formatted data.
              console.error("Could not parse assessment JSON from DB:", e);
              setAssessments([courseData.assessment]);
          }
      }

    } catch (err) {
      console.error('Failed to fetch course data:', err);
      setError('Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [courseId]); // Dependency array ensures this function is recreated only if courseId changes.

  // Effect to call the data fetching function on component mount.
  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // A higher-order function to handle changes in form inputs.
  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
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

  // Handler to submit the updated course data to the API.
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      // Prepare the data for submission, stringifying the assessments array.
      const submissionData = {
        ...formData,
        assessment: JSON.stringify(assessments)
      };
      // Send a PUT request to update the course.
      await api.put(`/courses/${courseId}`, submissionData);
      alert('Course updated successfully!');
      navigate(`/tutor/course/${courseId}`); // Navigate back to the detail page on success.
    } catch (err) {
      console.error('Failed to update course:', err);
      setError('Failed to update course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for the cancel button, with a confirmation prompt.
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate(`/tutor/course/${courseId}`); 
    }
  };

  // Display a loading indicator while fetching initial data.
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  // Main component render.
  return (
    <Box sx={courseModifyStyles.container}>
      {/* Header section. */}
      <Box sx={courseModifyStyles.topHeader}>
        <Typography variant="h4" sx={courseModifyStyles.headerTitle}>
          Modify Course
        </Typography>
      </Box>

      {/* Form container. */}
      <Box sx={courseModifyStyles.formContainer}>
        {/* Display an error alert if an error exists. */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Form fields for course details. */}
        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Course Name:<span style={{ color: '#f44336' }}>*</span></Typography>
          <TextField fullWidth value={formData.name} onChange={handleInputChange('name')} sx={courseModifyStyles.textField}/>
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Year:<span style={{ color: '#f44336' }}>*</span></Typography>
          <TextField type="number" fullWidth value={formData.year} onChange={handleInputChange('year')} sx={courseModifyStyles.textField}/>
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Semester:<span style={{ color: '#f44336' }}>*</span></Typography>
          <FormControl fullWidth>
            <Select
              value={formData.semester}
              onChange={handleInputChange('semester')}
              sx={courseModifyStyles.selectField}
            >
              <MenuItem value="T1">Term 1</MenuItem>
              <MenuItem value="T2">Term 2</MenuItem>
              <MenuItem value="T3">Term 3</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={courseModifyStyles.fieldContainer}>
          <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Description:<span style={{ color: '#f44336' }}>*</span></Typography>
          <TextField fullWidth multiline rows={5} value={formData.description} onChange={handleInputChange('description')} sx={courseModifyStyles.textField}/>
        </Box>

        {/* Section for adding and listing assessment items. */}
        <Box sx={courseModifyStyles.fieldContainer}>
            <Typography variant="h6" sx={courseModifyStyles.fieldLabel}>Assessments:</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    value={currentAssessment}
                    onChange={(e) => setCurrentAssessment(e.target.value)}
                    placeholder="Add an assessment item (e.g., Final Exam 40%)"
                    sx={courseModifyStyles.textField}
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

        {/* Action buttons for saving or canceling the modification. */}
        <Box sx={courseModifyStyles.buttonContainer}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={courseModifyStyles.confirmButton}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="contained"
            onClick={handleCancel}
            disabled={submitting}
            startIcon={<CloseIcon />}
            sx={courseModifyStyles.cancelButton}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default CourseModifyPage;