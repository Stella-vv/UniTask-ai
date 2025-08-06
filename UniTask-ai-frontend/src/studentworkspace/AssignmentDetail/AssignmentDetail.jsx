// test/studentworkspace/AssignmentDetail/AssignmentDetail.jsx (Final Corrected Structure)

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

const StudentAssignmentDetail = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!assignmentId) {
          setError('Assignment ID not provided');
          setLoading(false); return;
        }
        const response = await api.get(`/assignments/detail/${assignmentId}`);
        setAssignmentData(response.data);
      } catch (err) {
        console.error('Failed to fetch assignment details:', err);
        setError('Failed to fetch assignment details. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignmentDetail();
  }, [assignmentId]);

  const handleGoBack = () => {
    navigate(-1); // Navigates to the previous page in history
  };

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

  const getDisplayName = (fileObject) => {
    if (!fileObject) return 'Unnamed File';
    return fileObject.filename || 'Unnamed File';
  };

  const getFileIcon = (fileObject) => {
    const fileName = getDisplayName(fileObject);
    const extension = fileName?.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return <DescriptionIcon sx={{ color: '#f40f02' }} />;
      case 'doc': case 'docx': return <DescriptionIcon sx={{ color: '#2b579a' }} />;
      default: return <AttachFileIcon sx={{ color: '#666' }} />;
    }
  };
  
  const handleGoToForum = () => {
    navigate(`/student/assignment/${assignmentId}/forum`);
  };

  const handleGoToChat = () => {
    navigate(`/student/assignment/${assignmentId}/help`);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!assignmentData) return <Typography>No assignment data found.</Typography>;

  return (
    <Box sx={assignmentDetailStyles.container}>
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

      <Box sx={assignmentDetailStyles.contentArea}>
        {/* Key Change: A new wrapper for all the main content that needs to scroll */}
        <Box sx={assignmentDetailStyles.mainContentWrapper}>
          <Typography variant="h4" sx={assignmentDetailStyles.assignmentTitle}>{assignmentData.name}</Typography>
          <Box sx={assignmentDetailStyles.infoSection}>
            <Typography variant="h6" sx={assignmentDetailStyles.infoLabel}>Due Date : <span style={{ fontWeight: 400 }}>{new Date(assignmentData.dueDate).toLocaleDateString()}</span></Typography>
          </Box>
          <Box sx={assignmentDetailStyles.descriptionSection}>
            <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>Assignment Description:</Typography>
            <Typography variant="body1" sx={assignmentDetailStyles.descriptionText}>{assignmentData.description}</Typography>
          </Box>
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
          {assignmentData.attachments && assignmentData.attachments.length > 0 && (
            <Box sx={assignmentDetailStyles.attachmentSection}>
              <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>Attachment(s):</Typography>
              <List sx={assignmentDetailStyles.attachmentList}>
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

export default StudentAssignmentDetail;