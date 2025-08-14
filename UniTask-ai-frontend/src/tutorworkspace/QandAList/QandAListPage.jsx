import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import api from '../../api';
import { qandaListPageStyles as styles } from './QandAListPage_style';


// Define the component to display a list of uploaded Q&A files for an assignment.
const QandAListPage = () => {
  // Hooks for navigation and accessing URL parameters.
  const navigate = useNavigate();
  const { assignmentId } = useParams();

  // State to hold the list of Q&A files, loading status, errors, and assignment name.
  const [qaList, setQAList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assignmentName, setAssignmentName] = useState('');

  // A memoized function to fetch the assignment name and its Q&A file list.
  const fetchQAList = useCallback(async () => {
    if (!assignmentId) {
      setError("Assignment ID is not provided.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Fetch assignment details to get the name for the header.
      const assignmentRes = await api.get(`/assignments/detail/${assignmentId}`);
      setAssignmentName(assignmentRes.data.name);
      // Fetch the list of Q&A files for the assignment.
      const response = await api.get(`/qa/assignment/${assignmentId}/uploads`);
      setQAList(response.data);
    } catch (err) {
      console.error('Failed to fetch QA list:', err);
      setError('Failed to load Q&A list for this assignment.');
      setQAList([]); // Clear list on error.
    } finally {
      setLoading(false);
    }
  }, [assignmentId]); // Re-run if assignmentId changes.

  // Effect to call the data fetching function on component mount.
  useEffect(() => {
    fetchQAList();
  }, [fetchQAList]);

  // Handler to navigate back to the parent assignment detail page.
  const handleGoBack = () => {
    navigate(`/tutor/assignment/${assignmentId}`);
  };

  // Handler to navigate to the Q&A upload page.
  const handleUploadClick = () => {
    navigate(`/tutor/assignment/${assignmentId}/qnas/upload`);
  };

  // Handler to delete a specific Q&A file after confirmation.
  const handleDeleteFile = async (qaIdToDelete) => {
    if (window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
        try {
            // Send a DELETE request to the API.
            await api.delete(`/qa/delete/${qaIdToDelete}`);
            
            // Optimistically update the UI by removing the item from the state.
            setQAList(prevList => prevList.filter(qa => qa.id !== qaIdToDelete));

            alert('File deleted successfully!');

        } catch (err) {
            console.error('Failed to delete file:', err);
            setError('Failed to delete the file. Please try again.');
        }
    }
  };

  // Helper function to return a specific icon based on the file type.
  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('pdf')) return <DescriptionIcon sx={{ color: '#f40f02' }} />;
    return <AttachFileIcon sx={{ color: '#666' }} />;
  };

  // Helper function to format a date string into a readable local format.
  const formatUploadTime = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleString();
  };

  // Initial loading state before the assignment name is fetched.
  if (loading && !assignmentName) {
    return (
        <Box sx={styles.container}>
            <Box sx={styles.topHeader}>
                <Typography variant="h4" sx={styles.headerTitle}>
                    Q&As
                </Typography>
            </Box>
            <Box sx={{...styles.contentArea, justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress />
            </Box>
        </Box>
    );
  }

  // Main component render.
  return (
    <Box sx={styles.container}>
      {/* Header section with dynamic title and back button. */}
      <Box sx={styles.topHeader}>
        <Typography variant="h4" sx={styles.headerTitle}>
          Q&As for {assignmentName || `Assignment ${assignmentId}`}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={styles.backButton}
        >
          Back
        </Button>
      </Box>        
      {/* Main content area. */}
      <Box sx={styles.contentArea}>
        {/* Display error message if any. */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Section with control buttons like 'Upload'. */}
        <Box sx={styles.controlSection}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleUploadClick}
            sx={styles.uploadButton}
          >
            Upload Q&A
          </Button>
        </Box>

        {/* Conditional rendering for loading, empty, or data states. */}
        {loading ? (
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2 }}>Loading Q&As...</Typography>
            </Box>
        ) : qaList.length === 0 ? (
            // Display an empty state message if no Q&A files are found.
            <Box sx={styles.emptyState}>
              <DescriptionIcon sx={styles.emptyIcon} />
              <Typography variant="h6" sx={{ mb: 1 }}>No Q&As Found</Typography>
              <Typography variant="body2">No Q&As have been uploaded for this assignment yet.</Typography>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={handleUploadClick}
                sx={{ mt: 2 }}
              >
                Upload First Q&A
              </Button>
            </Box>
        ) : (
            // Map through the Q&A file list and render each item.
            <Box sx={styles.qaList}>
              <List sx={{ p: 0 }}>
                {qaList.map((qa, index) => (
                  <React.Fragment key={qa.id}>
                    <ListItem sx={styles.qaItem}>
                      <Box sx={styles.fileIcon}>{getFileIcon(qa.filetype)}</Box>
                      <Box sx={styles.qaInfo}>
                        <Typography sx={styles.fileName}>{qa.filename}</Typography>
                        <Typography sx={styles.fileDetails}>Uploaded: {formatUploadTime(qa.created_at)}</Typography>
                      </Box>
                      {/* Download link for the file. */}
                      <a href={`${api.defaults.baseURL}/qa/download/${qa.id}`} download={qa.filename} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <IconButton sx={{ ml: 1 }} data-testid="DownloadIcon">
                              <DownloadIcon />
                          </IconButton>
                      </a>
                      {/* Delete button for the file. */}
                      <IconButton 
                        onClick={() => handleDeleteFile(qa.id)} 
                        sx={{ 
                            ml: 1, 
                            '&:hover': {
                                color: 'error.main', 
                            },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                    {/* Add a divider between items, but not after the last one. */}
                    {index < qaList.length - 1 && <Divider sx={{ mx: 3 }} />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
        )}
        
      </Box>
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default QandAListPage;