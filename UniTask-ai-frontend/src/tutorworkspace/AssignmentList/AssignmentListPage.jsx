// src/tutorworkspace/AssignmentList/AssignmentList.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Import your API instance

const AssignmentList = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        // Call the backend API to get all assignments
        const response = await api.get('/assignments');
        setAssignments(response.data);
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
        // Provide a more specific error message if the API call fails
        setError('Failed to load assignments. Please ensure the backend is running and the endpoint is correct.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []); // Empty array means this effect runs once after the initial render

  const handleUploadAssignment = () => {
    navigate('/tutor/assignment-upload');
  };

  const handleViewAssignmentDetail = (assignmentId) => {
    navigate(`/tutor/assignment-detail/${assignmentId}`); // Navigate to assignment detail page
  };

  if (loading) {
    return (
      <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
      }}>
        <Box sx={{
          bgcolor: 'primary.main',
          color: 'white',
          mt: -4, ml: -4, mr: -4, width: 'calc(100% + 64px)', p: 3,
          display: 'flex', alignItems: 'center', boxSizing: 'border-box',
          borderTopLeftRadius: '16px', borderTopRightRadius: '16px',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: '1.75rem' }}>
            Assignment List
          </Typography>
        </Box>
        <Box sx={{
          bgcolor: '#EFF8FF', flexGrow: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          ml: -4, mr: -4, width: 'calc(100% + 64px)', mb: -4, p: 4, boxSizing: 'border-box',
          borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px',
        }}>
          <CircularProgress />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Loading assignments...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
      }}>
        <Box sx={{
          bgcolor: 'primary.main',
          color: 'white',
          mt: -4, ml: -4, mr: -4, width: 'calc(100% + 64px)', p: 3,
          display: 'flex', alignItems: 'center', boxSizing: 'border-box',
          borderTopLeftRadius: '16px', borderTopRightRadius: '16px',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: '1.75rem' }}>
            Assignment List
          </Typography>
        </Box>
        <Box sx={{
          bgcolor: '#EFF8FF', flexGrow: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          ml: -4, mr: -4, width: 'calc(100% + 64px)', mb: -4, p: 4, boxSizing: 'border-box',
          borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px',
        }}>
          <Alert severity="error">{error}</Alert>
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
  }

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
          Assignment List
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
        {assignments.length > 0 ? (
          <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 1 }}>
            {assignments.map((assignment, index) => (
              <React.Fragment key={assignment.id}>
                <ListItem
                  button
                  onClick={() => handleViewAssignmentDetail(assignment.id)}
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <ListItemText
                    primary={assignment.name}
                    secondary={assignment.dueDate ? `Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}` : 'No due date'}
                  />
                </ListItem>
                {index < assignments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            No assignments found.
          </Typography>
        )}
        
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