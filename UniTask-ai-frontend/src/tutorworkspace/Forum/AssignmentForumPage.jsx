import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import { forumPageStyles } from './AssignmentForumPage_style';

const forumId = 1;

const AssignmentForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyStates, setReplyStates] = useState({});
  const [userId, setUserId] = useState(1);
  const BASE = 'http://localhost:8008/api';

  const fetchQuestions = () => {
    fetch(`${BASE}/forum/${forumId}/questions`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => {
        console.error('❌ 获取论坛问题失败:', err);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;
    const res = await fetch(`${BASE}/forum/${forumId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newQuestion,
        user_id: userId,
      }),
    });

    if (res.ok) {
      setNewQuestion('');
      fetchQuestions();
    } else {
      const err = await res.text();
      console.error('❌ 提交失败:', err);
    }
  };

  const toggleReplyBox = (questionId) => {
    setReplyStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        show: !prev[questionId]?.show,
        text: prev[questionId]?.text || '',
      },
    }));
  };

  const handleReplyTextChange = (questionId, text) => {
    setReplyStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        text,
      },
    }));
  };

  const handleReplySubmit = async (questionId) => {
    const replyText = replyStates[questionId]?.text;
    if (!replyText || !replyText.trim()) return;

    const res = await fetch(`${BASE}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: replyText,
        user_id: userId,
        question_id: questionId,
      }),
    });

    if (res.ok) {
      setReplyStates((prev) => ({
        ...prev,
        [questionId]: { show: false, text: '' },
      }));
      fetchQuestions();
    } else {
      const err = await res.text();
      console.error('❌ 回复失败:', err);
    }
  };

  return (
    <Box sx={forumPageStyles.container}>
      {/* 标题 */}
      <Box sx={forumPageStyles.assignmentTitleHeader}>
        <Typography variant="h4" sx={forumPageStyles.sectionTitle}>
          Assignment 1 Forum
        </Typography>
      </Box>

      {/* 问题列表 */}
      {questions.map((q) => (
        <Box key={q.id} sx={forumPageStyles.postContainer}>
          <Box sx={forumPageStyles.userInfo}>
            <Avatar sx={forumPageStyles.avatar}>{q.user_id ?? 'U'}</Avatar>
            <Typography sx={forumPageStyles.userName}>User {q.user_id}</Typography>
            <Typography sx={forumPageStyles.timestamp}>
              {new Date(q.created_at).toLocaleString()}
            </Typography>
          </Box>
          <Typography sx={forumPageStyles.messageText}>{q.content}</Typography>

          {/* 回复列表 */}
          {q.replies && q.replies.length > 0 && (
            <>
              <Box sx={forumPageStyles.replyCount}>
                {q.replies.length} {q.replies.length === 1 ? 'reply' : 'replies'}
              </Box>
              {q.replies.map((reply) => (
                <Box key={reply.id} sx={forumPageStyles.postContainer}>
                  <Box sx={forumPageStyles.userInfo}>
                    <Avatar sx={forumPageStyles.avatar}>{reply.user_id ?? 'U'}</Avatar>
                    <Typography sx={forumPageStyles.userName}>User {reply.user_id}</Typography>
                    <Typography sx={forumPageStyles.timestamp}>
                      {new Date(reply.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography sx={forumPageStyles.messageText}>{reply.content}</Typography>
                </Box>
              ))}
            </>
          )}

          {/* 回复按钮与输入框 */}
          <Button
            onClick={() => toggleReplyBox(q.id)}
            sx={{ mt: 1 }}
          >
            {replyStates[q.id]?.show ? 'Cancel' : 'Reply'}
          </Button>

          {replyStates[q.id]?.show && (
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                maxRows={8}
                placeholder="Write your reply..."
                value={replyStates[q.id]?.text || ''}
                onChange={(e) => handleReplyTextChange(q.id, e.target.value)}
                sx={{ mt: 1 }}
              />
              <Button
                variant="contained"
                onClick={() => handleReplySubmit(q.id)}
                sx={{ mt: 1 }}
              >
                Submit Reply
              </Button>
            </Box>
          )}
        </Box>
      ))}

      {/* 提问输入区 */}
      <Box sx={forumPageStyles.submitReplySection}>
        <Typography variant="h6" sx={forumPageStyles.submitReplyTitle}>
          Ask a Question
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={10}
          placeholder="Type your question here..."
          variant="outlined"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          sx={forumPageStyles.replyTextField}
        />
        <Box sx={forumPageStyles.actionButtons}>
          <Button
            variant="contained"
            sx={forumPageStyles.clearButton}
            onClick={() => setNewQuestion('')}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            sx={forumPageStyles.submitButton}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentForumPage;