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
  LiveHelp as QnaIcon, // Icon for Q&A
  HelpOutline as FaqIcon, // Icon for FAQ
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { assignmentDetailStyles } from './AssignmentDetail_style';
import api from '../../api';

const AssignmentDetail = () => {
  // Get assignment ID from route
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assignment detail data
  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user info from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          setError('User not logged in. Please log in again.');
          setLoading(false);
          navigate('/login');
          return;
        }

        const user = JSON.parse(userString);

        // If assignmentId is not provided, show an error
        if (!assignmentId) {
          setError('Assignment ID not provided');
          setLoading(false);
          return;
        }

        // Directly fetch the details of the specified assignment
        const response = await api.get(`/assignments/detail/${assignmentId}`);
        const assignment = response.data;


        // Format assignment data to fit existing UI components
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
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError('Assignment not found');
        } else {
          setError('Failed to fetch assignment details. Please check your connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchAssignmentDetail();
    }
  }, [assignmentId, navigate]);



  // Modify assignment
  const handleModify = () => {
    navigate(`/tutor/assignment/modify/${assignmentId}`);
  };

  const handleGoBack = () => {
    navigate('/tutor/assignment');
  };

  // handleDelete function
  const handleDelete = async () => {
    // Confirm with the user before deleting
    if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      try {
        setLoading(true); // Optional: show a loading state
        
        // Call the backend DELETE API
        await api.delete(`/assignments/${assignmentData.id}`);
        
        alert('Assignment deleted successfully!');
        
        // Navigate back to the assignment list page after deletion
        navigate('/tutor/assignment');
        
      } catch (err) {
        console.error('Failed to delete assignment:', err);
        setError('Failed to delete assignment, please try again.');
        setLoading(false); // Turn off loading state on error
      }
    }
  };

  // Navigate to forum
  const handleGoToForum = () => {
    navigate(`/tutor/assignment/${assignmentId}/forum`);
  };

  // Navigate to Q&As
  const handleGoToQAs = () => {
    navigate(`/tutor/assignment/${assignmentId}/qnas`);
  };

  // Navigate to FAQs
  const handleGoToFAQs = () => {
    navigate(`/tutor/assignment/${assignmentId}/faqs`);
  };


  // Download file
  const handleDownloadFile = (fileObject) => {
    const filename = fileObject?.filename;
    if (!filename) { alert('Filename is not available.'); return; }
    const downloadUrl = `${api.defaults.baseURL}/assignments/download/${filename}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    const displayName = filename.split('_').slice(1).join('_') || filename;
    link.setAttribute('download', displayName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  // Get file icon
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

  // Loading state
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

  // Error state
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

  // Normal display
  return (
    <Box sx={assignmentDetailStyles.container}>
      {/* Top blue area */}
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

      {/* Content area */}
      <Box sx={assignmentDetailStyles.contentArea}>
        {/* Assignment title and action buttons */}
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

        {/* Basic assignment information */}
        <Box sx={assignmentDetailStyles.infoSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.infoLabel}>
            Due Date : <span style={{ fontWeight: 400 }}>{assignmentData.dueDate}</span>
          </Typography>
        </Box>

        {/* Assignment description */}
        <Box sx={assignmentDetailStyles.descriptionSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Assignment Description:
          </Typography>
          <Typography variant="body1" sx={assignmentDetailStyles.descriptionText}>
            {assignmentData.description}
          </Typography>
        </Box>

        {/* Rubric */}
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

        {/* Attachment list */}
        <Box sx={assignmentDetailStyles.attachmentSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Attachment(s):
          </Typography>
            <List sx={assignmentDetailStyles.attachmentList}>
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

        {/* --- MODIFIED: Button container with all three buttons --- */}
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

export default AssignmentDetail;