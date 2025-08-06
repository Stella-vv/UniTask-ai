// src/studentworkspace/Forum/AssignmentForumPage.jsx (Corrected Submit Logic)

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

const StudentAssignmentForumPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [forumTitle, setForumTitle] = useState('Forum');
  const [forumId, setForumId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyStates, setReplyStates] = useState({});
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!assignmentId) {
      setError("Assignment ID is missing from the URL.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      const userString = localStorage.getItem('user');
      if (userString) {
        setUserId(JSON.parse(userString).id);
      }

      const forumRes = await api.get(`/forum/${assignmentId}`);
      const forumData = forumRes.data;
      
      setForumTitle(forumData.title);
      setForumId(forumData.id);

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
  }, [assignmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGoBack = () => {
    // Navigate back to the student's assignment detail page
    navigate(`/student/assignment/${assignmentId}`);
  };

  const handleSubmitQuestion = async () => {
    // Validate the data before sending
    if (!newQuestion.trim() || !forumId || !userId) {
      alert("Cannot submit an empty question or user/forum info is missing.");
      return;
    }
    
    try {
      // Send the POST request and WAIT for the response
      await api.post(`/forum/${forumId}/questions`, {
        content: newQuestion,
        user_id: userId,
      });

      // If the request was successful (no error thrown), clear the input and refetch data
      setNewQuestion('');
      fetchData(); // This re-fetches the list from the database, ensuring UI matches the database.
    
    } catch (err) {
      // If the request fails, log the error and inform the user.
      console.error('Failed to submit question:', err);
      alert('An error occurred while submitting your question. Please check the console for details.');
    }
  };

  const handleReplySubmit = async (questionId) => {
    const replyText = replyStates[questionId]?.text;
    if (!replyText || !replyText.trim() || !userId) return;

    try {
      await api.post(`/replies`, {
        content: replyText,
        user_id: userId,
        question_id: questionId,
      });
      setReplyStates(prev => ({ ...prev, [questionId]: { show: false, text: '' } }));
      fetchData();
    } catch (err) {
      console.error('Failed to submit reply:', err);
      alert('Failed to submit your reply.');
    }
  };
  
  const toggleReplyBox = (questionId) => {
    setReplyStates((prev) => ({ ...prev, [questionId]: { ...prev[questionId], show: !prev[questionId]?.show, text: prev[questionId]?.text || '' } }));
  };

  const handleReplyTextChange = (questionId, text) => {
    setReplyStates((prev) => ({ ...prev, [questionId]: { ...prev[questionId], text } }));
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={forumPageStyles.container}>
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

      {questions.map((q) => (
        <Box key={q.id} sx={forumPageStyles.postContainer}>
          <Box sx={forumPageStyles.userInfo}>
            <Avatar sx={forumPageStyles.avatar}>{q.user_email?.charAt(0).toUpperCase() ?? 'U'}</Avatar>
            <Typography sx={forumPageStyles.userName}>{q.user_email ?? `User ${q.user_id}`}</Typography>
            <Typography sx={forumPageStyles.timestamp}>{new Date(q.created_at).toLocaleString()}</Typography>
          </Box>
          <Typography sx={forumPageStyles.messageText}>{q.content}</Typography>

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
          
          <Button onClick={() => toggleReplyBox(q.id)} sx={{ mt: 2 }}>
            {replyStates[q.id]?.show ? 'Cancel' : 'Reply'}
          </Button>
          
          {replyStates[q.id]?.show && (
            <Box sx={{ mt: 1 }}>
              <TextField fullWidth multiline rows={3} placeholder="Write your reply..." value={replyStates[q.id]?.text || ''} onChange={(e) => handleReplyTextChange(q.id, e.target.value)} />
              <Button variant="contained" onClick={() => handleReplySubmit(q.id)} sx={{ mt: 1 }}>Submit Reply</Button>
            </Box>
          )}
        </Box>
      ))}

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

