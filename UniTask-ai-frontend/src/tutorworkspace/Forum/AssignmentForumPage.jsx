import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { forumPageStyles } from './AssignmentForumPage_style';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Define the forum page component for a specific assignment, likely for a tutor.
const AssignmentForumPage = () => {
  // Hooks for accessing URL parameters and for navigation.
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  // State for forum details, questions, and UI controls.
  const [forumTitle, setForumTitle] = useState('Forum');
  const [forumId, setForumId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyStates, setReplyStates] = useState({});
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // A memoized function to fetch all forum data.
  const fetchData = useCallback(async () => {
    if (!assignmentId) {
      setError("Assignment ID is missing from the URL.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      // Get user ID from local storage.
      const userString = localStorage.getItem('user');
      if (userString) {
        setUserId(JSON.parse(userString).id);
      }

      // First, fetch the forum details using the assignment ID.
      const forumRes = await api.get(`/forum/${assignmentId}`);
      const forumData = forumRes.data;
      
      setForumTitle(forumData.title || `Forum for Assignment ${assignmentId}`);
      setForumId(forumData.id);

      // If a forum exists, fetch its questions.
      if (forumData.id) {
        const questionsRes = await api.get(`/forum/${forumData.id}/questions`);
        setQuestions(questionsRes.data);
      } else {
        // If no forum is found, ensure the questions list is empty.
        setQuestions([]); 
      }

    } catch (err) {
      console.error('❌ Failed to load forum data:', err);
      setError('Could not load forum data. A forum may not have been created for this assignment yet.');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]); // Re-run if assignmentId changes.

  // Effect to call the data fetching function on component mount.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler to navigate back to the assignment detail page.
  const handleGoBack = () => {
    navigate(`/tutor/assignment/${assignmentId}`);
  };

  // Handler to submit a new question to the forum.
  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim() || !forumId || !userId) {
      alert("Cannot submit an empty question, or user/forum info is missing.");
      return;
    }
    
    try {
      // Post the new question to the API.
      await api.post(`/forum/${forumId}/questions`, {
        content: newQuestion,
        user_id: userId,
      });
      setNewQuestion(''); // Clear the input field.
      fetchData(); // Refresh the forum data.
    } catch (err) {
      console.error('Failed to submit question:', err);
      alert('An error occurred while submitting your question.');
    }
  };

  // Handler to submit a reply to a specific question.
  const handleReplySubmit = async (questionId) => {
    const replyText = replyStates[questionId]?.text;
    if (!replyText || !replyText.trim() || !userId) return;

    try {
      // Post the new reply to the API.
      await api.post(`/replies`, {
        content: replyText,
        user_id: userId,
        question_id: questionId,
      });
      // Hide and clear the reply box after submission.
      setReplyStates(prev => ({ ...prev, [questionId]: { show: false, text: '' } }));
      fetchData(); // Refresh data to show the new reply.
    } catch (err) {
      console.error('Failed to submit reply:', err);
      alert('Failed to submit your reply.');
    }
  };
  
  // Handler to toggle the visibility of a reply input box.
  const toggleReplyBox = (questionId) => {
    setReplyStates((prev) => ({ ...prev, [questionId]: { ...prev[questionId], show: !prev[questionId]?.show } }));
  };

  // Handler to update the state as the user types in a reply box.
  const handleReplyTextChange = (questionId, text) => {
    setReplyStates((prev) => ({ ...prev, [questionId]: { ...prev[questionId], text } }));
  };

  // Display a loading indicator while fetching initial data.
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  // Main component render.
  return (
    <Box sx={forumPageStyles.container}>
      {/* Header with forum title and back button. */}
      <Box sx={forumPageStyles.assignmentTitleHeader}>
        <Typography variant="h4" sx={forumPageStyles.sectionTitle}>
          {forumTitle}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={forumPageStyles.backButton}
        >
          Back
        </Button>
      </Box>

      {/* Display an error/warning message if fetching failed and there are no questions. */}
      {error && !questions.length && <Alert severity="warning" sx={{ m: 2 }}>{error}</Alert>}

      {/* Map through and display each question. */}
      {questions.map((q) => (
        <Box key={q.id} sx={forumPageStyles.postContainer}>
          {/* User info for the question post. */}
          <Box sx={forumPageStyles.userInfo}>
            <Avatar sx={forumPageStyles.avatar}>{q.user_email?.charAt(0).toUpperCase() ?? 'U'}</Avatar>
            <Typography sx={forumPageStyles.userName}>{q.user_email ?? `User ${q.user_id}`}</Typography>
            <Typography sx={forumPageStyles.timestamp}>{new Date(q.created_at).toLocaleString()}</Typography>
          </Box>
          <Typography sx={forumPageStyles.messageText}>{q.content}</Typography>

          {/* Map through and display replies for the current question. */}
          {q.replies?.map((reply) => (
            <Box key={reply.id} sx={{...forumPageStyles.postContainer, ml: 4, mt: 2, border: '1px solid #eee'}}>
              <Box sx={forumPageStyles.userInfo}>
                <Avatar sx={forumPageStyles.avatar}>{reply.user_email?.charAt(0).toUpperCase() ?? 'U'}</Avatar>
                <Typography sx={forumPageStyles.userName}>{reply.user_email ?? `User ${reply.user_id}`}</Typography>
                <Typography sx={forumPageStyles.timestamp}>{new Date(reply.created_at).toLocaleString()}</Typography>
              </Box>
              <Typography sx={forumPageStyles.messageText}>{reply.content}</Typography>
            </Box>
          ))}
          
          {/* Button to toggle the reply input box. */}
          <Button onClick={() => toggleReplyBox(q.id)} sx={{ mt: 2 }}>
            {replyStates[q.id]?.show ? 'Cancel' : 'Reply'}
          </Button>
          
          {/* Conditionally render the reply input box. */}
          {replyStates[q.id]?.show && (
            <Box sx={{ mt: 1 }}>
              <TextField fullWidth multiline rows={3} placeholder="Write your reply..." value={replyStates[q.id]?.text || ''} onChange={(e) => handleReplyTextChange(q.id, e.target.value)} />
              <Button variant="contained" onClick={() => handleReplySubmit(q.id)} sx={{ mt: 1 }}>Submit Reply</Button>
            </Box>
          )}
        </Box>
      ))}

      {/* Section for submitting a new question, only shows if a forum exists. */}
      {forumId ? (
        <Box sx={forumPageStyles.submitReplySection}>
          <Typography variant="h6" sx={forumPageStyles.submitReplyTitle}>
            Ask a New Question
          </Typography>
          <TextField fullWidth multiline rows={4} placeholder="Type your question here..." variant="outlined" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} sx={forumPageStyles.replyTextField} />
          <Box sx={forumPageStyles.actionButtons}>
            <Button variant="contained" sx={forumPageStyles.submitButton} onClick={handleSubmitQuestion}>Submit Question</Button>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

// Export the component for use in other parts of the application.
export default AssignmentForumPage;