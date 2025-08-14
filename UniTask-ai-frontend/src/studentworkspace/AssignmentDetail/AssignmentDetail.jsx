import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  ListItemButton,
} from '@mui/material';
import { Forum as ForumIcon, Description as DescriptionIcon, AttachFile as AttachFileIcon, HelpOutline as HelpIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { assignmentDetailStyles } from './AssignmentDetail_style.js'; 

// Define the StudentAssignmentDetail functional component.
const StudentAssignmentDetail = () => {
  // Get the 'assignmentId' from the URL parameters.
  const { assignmentId } = useParams();
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // State to hold the fetched assignment data.
  const [assignmentData, setAssignmentData] = useState(null);
  // State to manage the loading status of the API call.
  const [loading, setLoading] = useState(true);
  // State to store any errors that occur during the API call.
  const [error, setError] = useState(null);

  // useEffect hook to fetch assignment details when the component mounts or assignmentId changes.
  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        setLoading(true); // Start loading.
        setError(null); // Clear previous errors.
        // Validate if assignmentId is present.
        if (!assignmentId) {
          setError('Assignment ID not provided');
          setLoading(false); return;
        }
        // Make an API GET request to fetch assignment details.
        const response = await api.get(`/assignments/detail/${assignmentId}`);
        // Update state with the fetched data.
        setAssignmentData(response.data);
      } catch (err) {
        // Log and set error state if the fetch fails.
        console.error('Failed to fetch assignment details:', err);
        setError('Failed to fetch assignment details. Please check your connection and try again.');
      } finally {
        // Stop loading regardless of success or failure.
        setLoading(false);
      }
    };
    fetchAssignmentDetail();
  }, [assignmentId]); // Dependency array ensures this runs when assignmentId changes.

  // Handler to navigate back to the main assignment list page.
  const handleGoBack = () => {
    navigate('/student/assignment');
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
    link.click(); // Programmatically click the link.
    link.parentNode.removeChild(link); // Clean up the DOM.
  };

  // Helper function to get a display-friendly name from a file object.
  const getDisplayName = (fileObject) => {
    if (!fileObject) return 'Unnamed File';
    return fileObject.filename || 'Unnamed File';
  };

  // Helper function to return a specific icon based on the file extension.
  const getFileIcon = (fileObject) => {
    const fileName = getDisplayName(fileObject);
    const extension = fileName?.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return <DescriptionIcon sx={{ color: '#f40f02' }} />;
      case 'doc': case 'docx': return <DescriptionIcon sx={{ color: '#2b579a' }} />;
      default: return <AttachFileIcon sx={{ color: '#666' }} />;
    }
  };
  
  // Handler to navigate to the assignment's forum page.
  const handleGoToForum = () => {
    navigate(`/student/assignment/${assignmentId}/forum`);
  };

  // Handler to navigate to the assignment's help/chat page.
  const handleGoToChat = () => {
    navigate(`/student/assignment/${assignmentId}/help`);
  };

  // Conditional rendering for the loading state.
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  // Conditional rendering for the error state.
  if (error) return <Alert severity="error">{error}</Alert>;
  // Conditional rendering if no data is found.
  if (!assignmentData) return <Typography>No assignment data found.</Typography>;

  // Main component render.
  return (
    <Box sx={assignmentDetailStyles.container}>
      {/* Top header section with title and back button */}
      <Box sx={assignmentDetailStyles.topHeader}>
        <Typography variant="h4" sx={assignmentDetailStyles.headerTitle}>Assignment Detail</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={assignmentDetailStyles.backButton}
        >
          Back
        </Button>
      </Box>

      {/* Main content area for assignment details */}
      <Box sx={assignmentDetailStyles.contentArea}>
        <Box sx={assignmentDetailStyles.mainContentWrapper}>
          <Typography variant="h4" sx={assignmentDetailStyles.assignmentTitle}>{assignmentData.name}</Typography>
          <Box sx={assignmentDetailStyles.infoSection}>
            <Typography variant="h6" sx={assignmentDetailStyles.infoLabel}>Due Date : <span style={{ fontWeight: 400 }}>{new Date(assignmentData.dueDate).toLocaleDateString()}</span></Typography>
          </Box>
          <Box sx={assignmentDetailStyles.descriptionSection}>
            <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>Assignment Description:</Typography>
            <Typography variant="body1" sx={assignmentDetailStyles.descriptionText}>{assignmentData.description}</Typography>
          </Box>
          {/* Conditionally render the rubric section if it exists */}
          {assignmentData.rubric && (
            <Box sx={assignmentDetailStyles.rubricSection}>
              <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>Rubric:</Typography>
              <Chip
                icon={getFileIcon(assignmentData.rubric)}
                label={getDisplayName(assignmentData.rubric)}
                onClick={() => handleDownloadFile(assignmentData.rubric)}
                sx={assignmentDetailStyles.fileChip}
                clickable
              />
            </Box>
          )}
          {/* Conditionally render the attachments section if any exist */}
          {assignmentData.attachments && assignmentData.attachments.length > 0 && (
            <Box sx={assignmentDetailStyles.attachmentSection}>
              <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>Attachment(s):</Typography>
              <List sx={assignmentDetailStyles.attachmentList}>
                {/* Map through attachments and render each one */}
                {assignmentData.attachments.map((file, index) => (
                  <ListItemButton key={file.id || index} onClick={() => handleDownloadFile(file)}>
                    <Box sx={assignmentDetailStyles.fileIcon}>{getFileIcon(file)}</Box>
                    <ListItemText primary={getDisplayName(file)} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {/* Container for action buttons at the bottom */}
        <Box sx={assignmentDetailStyles.bottomButtonContainer}>
          <Button variant="contained" startIcon={<ForumIcon />} onClick={handleGoToForum} sx={assignmentDetailStyles.actionButton}>
            Forum
          </Button>
          <Button variant="contained" startIcon={<HelpIcon />} onClick={handleGoToChat} sx={assignmentDetailStyles.actionButton}>
            Help
          </Button>
        </Box>
        
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default StudentAssignmentDetail;