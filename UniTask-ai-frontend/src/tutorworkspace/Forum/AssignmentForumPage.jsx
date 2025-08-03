// test/tutorworkspace/Forum/AssignmentForumPage.jsx (Corrected)

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
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import api from '../../api'; // Use the central api instance
import { forumPageStyles } from './AssignmentForumPage_style';

const AssignmentForumPage = () => {
  const { assignmentId } = useParams(); // Get assignmentId from the URL
  const [forumTitle, setForumTitle] = useState('Forum');
  const [forumId, setForumId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyStates, setReplyStates] = useState({});
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data dynamically based on assignmentId
  const fetchData = useCallback(async () => {
    if (!assignmentId) {
      setError("Assignment ID is missing from the URL.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      // Get user ID from local storage
      const userString = localStorage.getItem('user');
      if (userString) {
        setUserId(JSON.parse(userString).id);
      }

      // 1. Fetch the forum associated with the assignmentId
      const forumRes = await api.get(`/forum/${assignmentId}`);
      const forumData = forumRes.data;
      
      setForumTitle(forumData.title || `Forum for Assignment ${assignmentId}`);
      setForumId(forumData.id);

      // 2. If a forum is found, fetch its questions
      if (forumData.id) {
        const questionsRes = await api.get(`/forum/${forumData.id}/questions`);
        setQuestions(questionsRes.data);
      } else {
        // Handle case where no forum exists for this assignment yet
        setQuestions([]); 
      }

    } catch (err) {
      console.error('❌ Failed to load forum data:', err);
      setError('Could not load forum data. A forum may not have been created for this assignment yet.');
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle submitting a new question
  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim() || !forumId || !userId) {
      alert("Cannot submit an empty question, or user/forum info is missing.");
      return;
    }
    
    try {
      await api.post(`/forum/${forumId}/questions`, {
        content: newQuestion,
        user_id: userId,
      });
      setNewQuestion('');
      fetchData(); // Refetch data to show the new question
    } catch (err) {
      console.error('❌ Failed to submit question:', err);
      alert('An error occurred while submitting your question.');
    }
  };

  // Handle submitting a reply
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
      fetchData(); // Refetch data to show the new reply
    } catch (err) {
      console.error('❌ Failed to submit reply:', err);
      alert('Failed to submit your reply.');
    }
  };
  
  const toggleReplyBox = (questionId) => {
    setReplyStates((prev) => ({ ...prev, [questionId]: { ...prev[questionId], show: !prev[questionId]?.show } }));
  };

  const handleReplyTextChange = (questionId, text) => {
    setReplyStates((prev) => ({ ...prev, [questionId]: { ...prev[questionId], text } }));
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={forumPageStyles.container}>
      <Box sx={forumPageStyles.assignmentTitleHeader}>
        <Typography variant="h4" sx={forumPageStyles.sectionTitle}>
          {forumTitle}
        </Typography>
      </Box>

      {error && !questions.length && <Alert severity="warning" sx={{ m: 2 }}>{error}</Alert>}

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

export default AssignmentForumPage;