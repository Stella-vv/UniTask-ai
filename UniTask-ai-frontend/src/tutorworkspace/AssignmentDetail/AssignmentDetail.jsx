import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Forum as ForumIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  LiveHelp as QnaIcon, 
  HelpOutline as FaqIcon, 
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { assignmentDetailStyles } from './AssignmentDetail_style';
import api from '../../api';

// Define the component to display detailed information about a single assignment for a tutor.
const AssignmentDetail = () => {
  // Get the 'assignmentId' from the URL parameters.
  const { assignmentId } = useParams();
  // Hook for programmatic navigation.
  const navigate = useNavigate();

  // State to hold the fetched and formatted assignment data.
  const [assignmentData, setAssignmentData] = useState(null);
  // State to manage the loading status of API calls.
  const [loading, setLoading] = useState(true);
  // State to store any error messages.
  const [error, setError] = useState(null);

  // Effect to fetch assignment details when the component mounts or assignmentId changes.
  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if a user is logged in.
        const userString = localStorage.getItem('user');
        if (!userString) {
          setError('User not logged in. Please log in again.');
          setLoading(false);
          navigate('/login');
          return;
        }

        const user = JSON.parse(userString);

        // Check if an assignment ID is provided in the URL.
        if (!assignmentId) {
          setError('Assignment ID not provided');
          setLoading(false);
          return;
        }

        // Fetch the raw assignment data from the API.
        const response = await api.get(`/assignments/detail/${assignmentId}`);
        const assignment = response.data;

        // Format the raw data into a clean object with default fallbacks.
        const formattedAssignment = {
          id: assignment.id,
          name: assignment.name,
          dueDate: assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-GB') : 'No due date',
          description: assignment.description || 'No description provided',
          rubric: assignment.rubric || null,
          attachments: assignment.attachments || [],
          courseName: assignment.courseName || 'Unknown Course',
        };

        setAssignmentData(formattedAssignment);
        
      } catch (err) {
        console.error('Failed to fetch assignment details:', err);
        // Handle specific API error statuses.
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError('Assignment not found');
        } else {
          setError('Failed to fetch assignment details. Please check your connection and try again.');
        }
      } finally {
        setLoading(false); // Stop loading.
      }
    };

    if (assignmentId) {
      fetchAssignmentDetail();
    }
  }, [assignmentId, navigate]); // Dependencies for the effect.

  // Handler to navigate to the assignment modification page.
  const handleModify = () => {
    navigate(`/tutor/assignment/modify/${assignmentId}`);
  };

  // Handler to navigate back to the main assignment list.
  const handleGoBack = () => {
    navigate('/tutor/assignment');
  };

  // Handler to delete the current assignment after confirmation.
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      try {
        setLoading(true); 

        // Send a DELETE request to the API.
        await api.delete(`/assignments/${assignmentData.id}`);
        
        alert('Assignment deleted successfully!');
        
        // Navigate back to the list after successful deletion.
        navigate('/tutor/assignment');
        
      } catch (err) {
        console.error('Failed to delete assignment:', err);
        setError('Failed to delete assignment, please try again.');
        setLoading(false); 
      }
    }
  };

  // Handler to navigate to the assignment's forum page.
  const handleGoToForum = () => {
    navigate(`/tutor/assignment/${assignmentId}/forum`);
  };

  // Handler to navigate to the assignment's Q&A page.
  const handleGoToQAs = () => {
    navigate(`/tutor/assignment/${assignmentId}/qnas`);
  };

  // Handler to navigate to the assignment's FAQ page.
  const handleGoToFAQs = () => {
    navigate(`/tutor/assignment/${assignmentId}/faqs`);
  };

  // Handler to initiate a file download.
  const handleDownloadFile = (fileObject) => {
    const filename = fileObject?.filename;
    if (!filename) { alert('Filename is not available.'); return; }
    // Construct the full download URL.
    const downloadUrl = `${api.defaults.baseURL}/assignments/download/${filename}`;
    // Create a temporary anchor element to trigger the download.
    const link = document.createElement('a');
    link.href = downloadUrl;
    // Clean up the filename for display (removes timestamp prefix).
    const displayName = filename.split('_').slice(1).join('_') || filename;
    link.setAttribute('download', displayName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  // Helper function to return a specific icon based on the file type.
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <DescriptionIcon sx={{ color: '#f40f02' }} />;
      case 'doc':
      case 'docx':
        return <DescriptionIcon sx={{ color: '#2b579a' }} />;
      case 'html':
        return <DescriptionIcon sx={{ color: '#e34c26' }} />;
      default:
        return <AttachFileIcon sx={{ color: '#666' }} />;
    }
  };

  // Conditional rendering for the loading state.
  if (loading) {
    return (
      <Box sx={assignmentDetailStyles.container}>
        <Box sx={assignmentDetailStyles.topHeader}>
          <Typography variant="h4" sx={assignmentDetailStyles.headerTitle}>
            Assignment Detail
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{...assignmentDetailStyles.modifyButton, ...assignmentDetailStyles.backButton}}
          >
            Back
          </Button>
        </Box>
        <Box sx={{...assignmentDetailStyles.contentArea, justifyContent: 'center', alignItems: 'center'}}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Conditional rendering for the error state.
  if (error) {
    return (
      <Box sx={assignmentDetailStyles.container}>
        <Box sx={assignmentDetailStyles.topHeader}>
          <Typography variant="h4" sx={assignmentDetailStyles.headerTitle}>
            Assignment Detail
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{...assignmentDetailStyles.modifyButton, ...assignmentDetailStyles.backButton}}
          >
            Back
          </Button>
        </Box>
        <Box sx={{...assignmentDetailStyles.contentArea, justifyContent: 'center', alignItems: 'center'}}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Box>
    );
  }

  // Main component render.
  return (
    <Box sx={assignmentDetailStyles.container}>
      {/* Header section with title and back button. */}
      <Box sx={assignmentDetailStyles.topHeader}>
        <Typography variant="h4" sx={assignmentDetailStyles.headerTitle}>
          Assignment Detail
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{...assignmentDetailStyles.modifyButton, ...assignmentDetailStyles.backButton}}
        >
          Back
        </Button>
      </Box>

      {/* Main content area. */}
      <Box sx={assignmentDetailStyles.contentArea}>
        {/* Title section with action buttons (Modify, Delete). */}
        <Box sx={assignmentDetailStyles.titleSection}>
          <Typography variant="h4" sx={assignmentDetailStyles.assignmentTitle}>
            {assignmentData.name}
          </Typography>
          <Box sx={assignmentDetailStyles.actionButtons}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleModify}
              sx={assignmentDetailStyles.modifyButton}
            >
              Modify
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={assignmentDetailStyles.deleteButton}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {/* Due date information. */}
        <Box sx={assignmentDetailStyles.infoSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.infoLabel}>
            Due Date : <span style={{ fontWeight: 400 }}>{assignmentData.dueDate}</span>
          </Typography>
        </Box>

        {/* Assignment description. */}
        <Box sx={assignmentDetailStyles.descriptionSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Assignment Description:
          </Typography>
          <Typography variant="body1" sx={assignmentDetailStyles.descriptionText}>
            {assignmentData.description}
          </Typography>
        </Box>

        {/* Conditionally render the rubric if it exists. */}
        {assignmentData.rubric && assignmentData.rubric.filename && (
          <Box sx={assignmentDetailStyles.rubricSection}>
            <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
              Rubric:
            </Typography>
            <Chip
              label={assignmentData.rubric.filename}
              onClick={() => handleDownloadFile(assignmentData.rubric)}
              sx={assignmentDetailStyles.fileChip}
              clickable
            />
          </Box>
        )}

        {/* List of attachments. */}
        <Box sx={assignmentDetailStyles.attachmentSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Attachment(s):
          </Typography>
            <List sx={assignmentDetailStyles.attachmentList}>
              {/* Filter out any invalid file objects before mapping. */}
              {assignmentData.attachments.filter(file => file && (file.fileName || file.filename)).map((file, index) => (
                <ListItem
                  key={file.id || index}
                  sx={assignmentDetailStyles.attachmentItem}
                  onClick={() => handleDownloadFile(file)}
                >
                  <Box sx={assignmentDetailStyles.fileIcon}>
                    {getFileIcon(file.type)}
                  </Box>
                  <ListItemText
                    primary={file.fileName || file.filename}
                    primaryTypographyProps={{
                      sx: assignmentDetailStyles.fileName
                    }}
                  />
                </ListItem>
              ))}
            </List>
        </Box>

        {/* Container for bottom navigation buttons. */}
        <Box sx={assignmentDetailStyles.bottomButtonContainer}>
          <Button
            variant="contained"
            startIcon={<ForumIcon />}
            onClick={handleGoToForum}
            sx={assignmentDetailStyles.actionButton}
          >
            Forum
          </Button>
          <Button
            variant="contained"
            startIcon={<QnaIcon />}
            onClick={handleGoToQAs}
            sx={assignmentDetailStyles.actionButton}
          >
            Q&As
          </Button>
          <Button
            variant="contained"
            startIcon={<FaqIcon />}
            onClick={handleGoToFAQs}
            sx={assignmentDetailStyles.actionButton}
          >
            FAQs
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default AssignmentDetail;