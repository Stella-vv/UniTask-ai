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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { forumPageStyles } from './AssignmentForumPage_style';

// Define the forum page component for a specific assignment.
const StudentAssignmentForumPage = () => {
  // Get the assignment ID from the URL parameters.
  const { assignmentId } = useParams();
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // State for the forum's title.
  const [forumTitle, setForumTitle] = useState('Forum');
  // State for the forum's ID.
  const [forumId, setForumId] = useState(null);
  // State to hold all questions and their replies.
  const [questions, setQuestions] = useState([]);
  // State for the text of a new question being composed.
  const [newQuestion, setNewQuestion] = useState('');
  // State to manage the visibility and content of reply boxes for each question.
  const [replyStates, setReplyStates] = useState({});
  // State for the current logged-in user's ID.
  const [userId, setUserId] = useState(null);
  // State to manage the loading status of API calls.
  const [loading, setLoading] = useState(true);
  // State to store any errors.
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
      
      setForumTitle(forumData.title);
      setForumId(forumData.id);

      // If a forum exists, fetch its questions.
      if (forumData.id) {
        const questionsRes = await api.get(`/forum/${forumData.id}/questions`);
        setQuestions(questionsRes.data);
      } else {
        setError("Could not find a forum for this assignment.");
      }

    } catch (err) {
      console.error('Failed to load forum data:', err);
      setError('Could not load forum data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]); // Dependency on assignmentId.

  // Effect to call the data fetching function on mount.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler to navigate back to the assignment detail page.
  const handleGoBack = () => {
    navigate(`/student/assignment/${assignmentId}`);
  };

  // Handler to submit a new question to the forum.
  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim() || !forumId || !userId) {
      alert("Cannot submit an empty question or user/forum info is missing.");
      return;
    }
    
    try {
      // Post the new question to the API.
      await api.post(`/forum/${forumId}/questions`, {
        content: newQuestion,
        user_id: userId,
      });
      setNewQuestion(''); // Clear the input field.
      fetchData(); // Refresh the forum data to show the new question.
    } catch (err) {
      console.error('Failed to submit question:', err);
      alert('An error occurred while submitting your question. Please check the console for details.');
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
    setReplyStates((prev) => ({ ...prev, [questionId]: { ...prev[questionId], show: !prev[questionId]?.show, text: prev[questionId]?.text || '' } }));
  };

  // Handler to update the state as the user types in a reply box.
  const handleReplyTextChange = (questionId, text) => {
    setReplyStates((prev) => ({ ...prev, [questionId]: { ...prev[questionId], text } }));
  };

  // Conditional rendering for the loading state.
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  // Conditional rendering for the error state.
  if (error) {
    return <Alert severity="error">{error}</Alert>;
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

      {/* Section for submitting a new question. */}
      <Box sx={forumPageStyles.submitReplySection}>
        <Typography variant="h6" sx={forumPageStyles.submitReplyTitle}>
          Ask a New Question
        </Typography>
        <TextField fullWidth multiline rows={4} placeholder="Type your question here..." variant="outlined" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} sx={forumPageStyles.replyTextField} />
        <Box sx={forumPageStyles.actionButtons}>
          <Button variant="contained" sx={forumPageStyles.submitButton} onClick={handleSubmitQuestion}>Submit Question</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentAssignmentForumPage;

