export const chatPageStyles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    p: 0,
  },

  header: {
    bgcolor: 'primary.main',
    color: 'white',
    p: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', 
    gap: 2,
    mt: -4,
    ml: -4,
    mr: -4,
    width: 'calc(100% + 64px)',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    height: '80px',
  },
  
  headerTitle: {
    fontWeight: 600,
    fontSize: '1.75rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },


  backButton: {
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.7)', 
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    borderRadius: '20px',
    padding: '6px 16px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'white',
    }
  },

  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    bgcolor: '#EFF8FF',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
  },

  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },

  messageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.5,
  },
  
  userMessageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.5,
    justifyContent: 'flex-end',
  },

  botAvatar: {
    bgcolor: 'primary.main',
    color: 'white',
    width: 40,
    height: 40,
  },

  userAvatar: {
    bgcolor: 'primary.main', 
    color: 'white',
    width: 40,
    height: 40,
  },
  
  messageBubble: {
    p: 1.5,
    borderRadius: '12px',
    maxWidth: 'calc(100% - 100px)',
    lineHeight: 1.6,
  },

  userMessage: {
    bgcolor: 'primary.main',
    color: 'white',
    borderBottomRightRadius: '2px',
  },

  assistantMessage: {
    bgcolor: 'white',
    color: 'text.primary',
    border: '1px solid #E2E8F0',
  },

  inputArea: {
    p: 2,
    borderTop: '1px solid #E0E0E0',
    bgcolor: 'background.paper',
    display: 'flex',
    gap: 2,
  },

  textField: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
    },
  },

  sendButton: {
    borderRadius: '20px',
    px: 3,
  },
};