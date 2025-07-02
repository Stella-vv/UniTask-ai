// src/tutorworkspace/AssignmentList/AssignmentList.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AssignmentList = () => {
  const navigate = useNavigate();

  const handleUploadAssignment = () => {
    navigate('/assignment-upload');
  };

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    }}>
      {/* Top Header Section - Dark Blue */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        mt: -4,
        ml: -4,
        mr: -4,
        width: 'calc(100% + 64px)',
        p: 3,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
      }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'white',
            fontSize: '1.75rem'
          }}
        >
          Assignment
        </Typography>
      </Box>

      {/* Content Area - Light Blue */}
      <Box sx={{
        bgcolor: '#EFF8FF',
        ml: -4,
        mr: -4,
        width: 'calc(100% + 64px)',
        mb: -4,
        p: 4,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
      }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Assignment list content will go here.
        </Typography>
        <Button
          variant="contained"
          onClick={handleUploadAssignment}
          sx={{ mt: 3, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Upload Assignment
        </Button>
      </Box>
    </Box>
  );
};

export default AssignmentList;