import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { chatPageStyles } from './ChatPage_style';
import api from '../../api';

// Define the ChatPage functional component.
const ChatPage = () => {
  // Get 'assignmentId' from URL parameters.
  const { assignmentId } = useParams();
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // State to hold the name of the current assignment.
  const [assignmentName, setAssignmentName] = useState('');
  // State to hold all chat messages, initialized with a greeting.
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! How can I help you with this assignment?' }
  ]);
  // State for the user's text input.
  const [input, setInput] = useState('');
  // State to track if the AI is processing a response.
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any error messages.
  const [error, setError] = useState('');
  // State to store the user's initial for the avatar.
  const [userInitial, setUserInitial] = useState('');
  // Ref to the end of the messages list for auto-scrolling.
  const messagesEndRef = useRef(null);
  
  // Effect to run on component mount to fetch user data and assignment name.
  useEffect(() => {
    // Retrieve user data from local storage to get the initial.
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserInitial(user.email ? user.email.charAt(0).toUpperCase() : 'U');
    }

    // Async function to fetch the assignment's name using its ID.
    const fetchAssignmentName = async () => {
      if (assignmentId) {
        try {
          const response = await api.get(`/assignments/detail/${assignmentId}`);
          setAssignmentName(response.data.name);
        } catch (err) {
          console.error("Failed to fetch assignment name:", err);
          setAssignmentName("Assignment"); // Fallback name on error.
        }
      }
    };

    fetchAssignmentName();
  }, [assignmentId]); // Dependency on assignmentId to re-fetch if it changes.

  // Function to scroll the message area to the bottom.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to scroll to the bottom whenever new messages are added.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handler to navigate to the previous page.
  const handleBackToDetail = () => {
    navigate(-1);
  };

  // Handler to send a message to the AI backend.
  const handleSendMessage = async () => {
    // Prevent sending empty or multiple messages while loading.
    if (input.trim() === '' || isLoading) return;
    const userMessage = input;
    // Add user's message to the chat optimistically.
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // Post the user's query and assignment ID to the AI endpoint.
      const response = await api.post('/ai/ask', { query: userMessage, assignment_id: assignmentId });
      const assistantResponse = response.data.answer || 'Sorry, I could not get a response.';
      // Add the AI's response to the chat.
      setMessages(prev => [...prev, { sender: 'assistant', text: assistantResponse }]);
    } catch (err) {
      // Handle API errors.
      console.error('Failed to get response from AI:', err);
      const errorMsg = err.response?.data?.error || 'Failed to connect to the assistant.';
      setError(errorMsg);
      // Display an error message in the chat.
      setMessages(prev => [...prev, { sender: 'assistant', text: `Error: ${errorMsg}` }]);
    } finally {
      setIsLoading(false); // Stop loading.
    }
  };

  // Handler to send message on 'Enter' key press.
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  // Main component render.
  return (
    <Box sx={chatPageStyles.container}>
      {/* Header section with dynamic title and back button. */}
      <Box sx={chatPageStyles.header}>
        <Typography variant="h5" sx={chatPageStyles.headerTitle}>
          {assignmentName ? `Help for ${assignmentName}` : 'Help Assistant'}
        </Typography>
        {assignmentId && (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToDetail}
            sx={chatPageStyles.backButton}
          >
            Back
          </Button>
        )}
      </Box>

      {/* Main content wrapper for messages and input. */}
      <Box sx={chatPageStyles.contentWrapper}>
        {/* Area where chat messages are displayed. */}
        <Box sx={chatPageStyles.messagesArea}>
          {/* Map through messages and render them based on the sender. */}
          {messages.map((msg, index) => {
            if (msg.sender === 'user') {
              return (
                <Box key={index} sx={chatPageStyles.userMessageContainer}>
                  <Box sx={{ ...chatPageStyles.messageBubble, ...chatPageStyles.userMessage }}>
                    {msg.text}
                  </Box>
                  <Avatar sx={chatPageStyles.userAvatar}>{userInitial}</Avatar>
                </Box>
              );
            } else {
              return (
                <Box key={index} sx={chatPageStyles.messageContainer}>
                  <Avatar sx={chatPageStyles.botAvatar}><SmartToyOutlinedIcon /></Avatar>
                  {/* Assistant's message bubble, with special styling for errors. */}
                  <Box sx={{ ...chatPageStyles.messageBubble, ...chatPageStyles.assistantMessage, ...(msg.text.startsWith('Error:') && { bgcolor: '#ffebee', color: 'error.main' }) }}>
                    {msg.text}
                  </Box>
                </Box>
              );
            }
          })}
          {/* "Thinking..." indicator shown while waiting for AI response. */}
          {isLoading && (
             <Box sx={chatPageStyles.messageContainer}>
                <Avatar sx={chatPageStyles.botAvatar}><SmartToyOutlinedIcon /></Avatar>
                <Box sx={{ ...chatPageStyles.messageBubble, ...chatPageStyles.assistantMessage }}>
                  Thinking...
                </Box>
            </Box>
          )}
          {/* Empty div used as a reference for auto-scrolling. */}
          <div ref={messagesEndRef} />
        </Box>
        
        {/* Display a global error alert if an error exists. */}
        {error && <Alert severity="error" sx={{ m: 2, mt: 0 }}>{error}</Alert>}

        {/* Input area with text field and send button. */}
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

// Export the component for use in other parts of the application.
export default ChatPage;