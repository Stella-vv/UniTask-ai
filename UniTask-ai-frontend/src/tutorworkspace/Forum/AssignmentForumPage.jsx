import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
} from '@mui/material';
import { forumPageStyles } from './AssignmentForumPage_style';

const forumId = 1; // 🔁 这里写死了 forumId，可用 useParams 后续动态传入

const AssignmentForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [userId, setUserId] = useState(1); // 💡 临时写死 user_id，你也可以用 JWT 解析出真实的
  const BASE = 'http://localhost:8008/api';

  // 获取问题列表
  const fetchQuestions = () => {
    fetch(`${BASE}/forum/${forumId}/questions`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((err) => {
        console.error('❌ 获取论坛问题失败:', err);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // 提交新问题
  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;
    const res = await fetch(`${BASE}/forum/${forumId}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
          <Typography sx={forumPageStyles.messageText}>
            {q.content}
          </Typography>

          {q.answer && (
            <>
              <Box sx={forumPageStyles.replyCount}>1 reply</Box>
              <Box sx={forumPageStyles.postContainer}>
                <Box sx={forumPageStyles.userInfo}>
                  <Avatar sx={forumPageStyles.avatar}>A</Avatar>
                  <Typography sx={forumPageStyles.userName}>Auto Answer</Typography>
                  <Typography sx={forumPageStyles.timestamp}>
                    {new Date(q.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Typography sx={forumPageStyles.messageText}>{q.answer}</Typography>
              </Box>
            </>
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