// src/tutorworkspace/AssignmentList/AssignmentList.jsx (Modified to fetch by course_id=1)

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, List, ListItem, ListItemText, Divider, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Import your API instance

const StudentAssignmentList = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function now fetches assignments for a specific course_id.
    const fetchAssignmentsByCourse = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        // THIS IS THE KEY CHANGE:
        // The API call is now hardcoded to fetch assignments for course_id = 1.
        // Please ensure your backend has a route like GET /api/assignments/course/1
        const response = await api.get('/assignments');       
        setAssignments(response.data);

      } catch (err) {
        console.error('Failed to fetch assignments:', err);
        setError('Failed to load assignments. Please ensure the backend is running and the API endpoint is correct.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentsByCourse();
  }, []); // Empty array means this effect runs only once after the initial render

  const handleViewAssignmentDetail = (assignmentId) => {
    navigate(`/student/assignment-detail/${assignmentId}`);
    console.log(`Navigating to assignment detail: ${assignmentId}`);
  };

  // The rest of the component (rendering logic) remains the same as your file.
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
            Course Assignments
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
            Course Assignments
          </Typography>
        </Box>
        <Box sx={{
          bgcolor: '#EFF8FF', flexGrow: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          ml: -4, mr: -4, width: 'calc(100% + 64px)', mb: -4, p: 4, boxSizing: 'border-box',
          borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px',
        }}>
          <Alert severity="error">{error}</Alert>
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
          Course Assignments
        </Typography>
      </Box>

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
                  disablePadding 
                  key={assignment.id}
                >
                  <ListItemButton onClick={() => handleViewAssignmentDetail(assignment.id)}>
                    <ListItemText
                      primary={assignment.name}
                      secondary={assignment.dueDate ? `Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}` : 'No due date'}
                    />
                  </ListItemButton>
                </ListItem>
                {index < assignments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            No assignments found for this course.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StudentAssignmentList;