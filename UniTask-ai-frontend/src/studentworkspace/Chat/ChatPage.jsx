import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { chatPageStyles } from './ChatPage_style';
import api from '../../api';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! How can I help you with your course today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userInitial, setUserInitial] = useState(''); // MODIFICATION: State to hold user's initial
  const messagesEndRef = useRef(null);
  
  // MODIFICATION: useEffect to get user initial from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserInitial(user.email ? user.email.charAt(0).toUpperCase() : 'U');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = input;
    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/mock-ai/ask', { query: userMessage });
      const assistantResponse = response.data.answer || 'Sorry, I could not get a response.';
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: assistantResponse }
      ]);
    } catch (err) {
      console.error('Failed to get response from AI:', err);
      const errorMsg = err.response?.data?.error || 'Failed to connect to the assistant. Please try again later.';
      setError(errorMsg);
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: `Error: ${errorMsg}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box sx={chatPageStyles.container}>
      <Box sx={chatPageStyles.header}>
        <Typography variant="h5" sx={chatPageStyles.headerTitle}>
          Help Assistant
        </Typography>
      </Box>

      <Box sx={chatPageStyles.contentWrapper}>
        <Box sx={chatPageStyles.messagesArea}>
          {messages.map((msg, index) => {
            if (msg.sender === 'user') {
              // MODIFICATION: Render user messages inside a right-aligned container with an avatar
              return (
                <Box key={index} sx={chatPageStyles.userMessageContainer}>
                  <Box
                    sx={{
                      ...chatPageStyles.messageBubble,
                      ...chatPageStyles.userMessage
                    }}
                  >
                    {msg.text}
                  </Box>
                  <Avatar sx={chatPageStyles.userAvatar}>{userInitial}</Avatar>
                </Box>
              );
            } else {
              return (
                <Box key={index} sx={chatPageStyles.messageContainer}>
                  <Avatar sx={chatPageStyles.botAvatar}>
                    <SmartToyOutlinedIcon />
                  </Avatar>
                  <Box
                    sx={{
                      ...chatPageStyles.messageBubble,
                      ...chatPageStyles.assistantMessage,
                      ...(msg.text.startsWith('Error:') && { bgcolor: '#ffebee', color: 'error.main' })
                    }}
                  >
                    {msg.text}
                  </Box>
                </Box>
              );
            }
          })}
          {isLoading && (
             <Box sx={chatPageStyles.messageContainer}>
                <Avatar sx={chatPageStyles.botAvatar}>
                  <SmartToyOutlinedIcon />
                </Avatar>
                <Box sx={{ ...chatPageStyles.messageBubble, ...chatPageStyles.assistantMessage }}>
                    Thinking...
                </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        
        {error && <Alert severity="error" sx={{ m: 2, mt: 0 }}>{error}</Alert>}

        <Box sx={chatPageStyles.inputArea}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={chatPageStyles.textField}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            sx={chatPageStyles.sendButton}
            disabled={isLoading}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;