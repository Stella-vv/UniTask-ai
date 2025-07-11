// src/studentworkspace/AssignmentDetail/AssignmentDetail.jsx (Static Version for Student)

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
} from '@mui/material';
import { Forum as ForumIcon, Description as DescriptionIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
// Make sure you have created this style file or adjust the import path
import { assignmentDetailStyles } from './AssignmentDetail_style.js'; 

// Renamed for clarity to avoid confusion with the tutor's component
const StudentAssignmentDetail = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignmentData, setAssignmentData] = useState(null);

  // This mock data is the same as in your provided file.
  const mockAssignmentData = {
    id: assignmentId || 12345, // Use ID from URL if available
    name: 'Assignment 1: Build a Personal Portfolio',
    dueDate: '11/08/2025',
    description: 'Build a responsive web page using HTML, CSS, and JavaScript that displays a list of student profiles. The page must include a search bar, responsive layout for desktop and mobile, and use clean, semantic HTML. Submit your code and a brief user guide explaining your design choices.',
    rubric: {
      fileName: 'Assignment1_rubric.pdf',
      url: '/files/assignment1_rubric.pdf'
    },
    attachments: [
      { id: 1, fileName: 'Assignment1.pdf', url: '#', type: 'pdf' },
      { id: 2, fileName: 'Report_template.doc', url: '#', type: 'doc' },
    ]
  };

  // Using useEffect to set the static data when the component loads.
  useEffect(() => {
    setAssignmentData(mockAssignmentData);
  }, [assignmentId]); // Re-run if the assignmentId in the URL changes

  const handleGoToForum = () => {
    // Corrected to navigate to a potential student forum route
    navigate(`/student/assignments/${assignmentData.id}/forum`);
  };

  // This function is kept for displaying file icons
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <DescriptionIcon sx={{ color: '#f40f02' }} />;
      case 'doc': return <DescriptionIcon sx={{ color: '#2b579a' }} />;
      default: return <AttachFileIcon sx={{ color: '#666' }} />;
    }
  };

  // If data is not yet set (very briefly), show a loading message.
  if (!assignmentData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={assignmentDetailStyles.container}>
      <Box sx={assignmentDetailStyles.topHeader}>
        <Typography variant="h4" sx={assignmentDetailStyles.headerTitle}>
          Assignment Detail
        </Typography>
      </Box>

      <Box sx={assignmentDetailStyles.contentArea}>
        <Box sx={assignmentDetailStyles.titleSection}>
          <Typography variant="h4" sx={assignmentDetailStyles.assignmentTitle}>
            {assignmentData.name}
          </Typography>
          {/* "Modify" and "Delete" buttons are REMOVED for the student view */}
        </Box>

        <Box sx={assignmentDetailStyles.infoSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.infoLabel}>
            Due Date : <span style={{ fontWeight: 400 }}>{assignmentData.dueDate}</span>
          </Typography>
        </Box>

        <Box sx={assignmentDetailStyles.descriptionSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Assignment Description:
          </Typography>
          <Typography variant="body1" sx={assignmentDetailStyles.descriptionText}>
            {assignmentData.description}
          </Typography>
        </Box>

        <Box sx={assignmentDetailStyles.rubricSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Rubric:
          </Typography>
          <Chip
            label={assignmentData.rubric.fileName}
            clickable
          />
        </Box>

        <Box sx={assignmentDetailStyles.attachmentSection}>
          <Typography variant="h6" sx={assignmentDetailStyles.sectionTitle}>
            Attachment:
          </Typography>
          <List sx={assignmentDetailStyles.attachmentList}>
            {assignmentData.attachments.map((file, index) => (
              <React.Fragment key={file.id}>
                <ListItem button>
                  <Box sx={assignmentDetailStyles.fileIcon}>{getFileIcon(file.type)}</Box>
                  <ListItemText primary={file.fileName} />
                </ListItem>
                {index < assignmentData.attachments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Box sx={assignmentDetailStyles.forumButtonContainer}>
          <Button
            variant="contained"
            startIcon={<ForumIcon />}
            onClick={handleGoToForum}
            sx={assignmentDetailStyles.forumButton}
          >
            Go to Forum
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentAssignmentDetail;