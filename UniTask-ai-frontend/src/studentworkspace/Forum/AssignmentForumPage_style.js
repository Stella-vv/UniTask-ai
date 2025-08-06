// test/tutorworkspace/Forum/AssignmentForumPage_style.js
export const forumPageStyles = {
  container: {
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    pb: 0.5,
  },
  assignmentTitleHeader: {
    bgcolor: 'primary.main', 
    color: 'white',          
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    p: 3, 
    mt: -4, 
    ml: -4,
    mr: -4, 
    width: 'calc(100% + 64px)', 
    boxSizing: 'border-box', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },
  backButton: {
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: '2px',
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'white',
      borderWidth: '2px',
    }
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: '1.75rem', // "Assignment 1" title size
    color: 'white',
  },
  postContainer: {
    bgcolor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    p: 3,
    border: '1px solid #E0E0E0',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mb: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    bgcolor: 'primary.main', // Example avatar color
  },
  userName: {
    fontWeight: 600,
    color: 'text.primary',
    fontSize: '1rem',
  },
  timestamp: {
    color: 'text.secondary',
    fontSize: '0.875rem',
  },
  messageText: {
    color: 'text.primary',
    lineHeight: 1.6,
  },
  codeBlock: {
    bgcolor: '#2D2D2D', // Dark background for code
    color: '#F8F8F2', // Light text for code
    fontFamily: 'monospace',
    p: 2,
    borderRadius: '6px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap', // Preserve whitespace and wrap
    wordBreak: 'break-all',
  },
  replyCount: {
    color: 'text.secondary',
    fontWeight: 500,
    mt: 2,
  },
  // Style for the "Submit Reply" section
  submitReplySection: {
    mt: 'auto', // Push to the bottom
    pt: 2,
    borderTop: '1px solid #E0E0E0',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  submitReplyTitle: {
    fontWeight: 600,
    fontSize: '1.25rem',
    color: 'text.primary',
  },
  replyTextField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiInputBase-input': {
      color: 'text.primary',
    },
    bgcolor: '#FBFBFB', // Slightly different background for text field
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
  },
  clearButton: {
    bgcolor: '#E0E0E0',
    color: 'text.primary',
    fontWeight: 600,
    px: 3,
    py: 1,
    borderRadius: '25px',
    textTransform: 'none',
    '&:hover': {
      bgcolor: '#D0D0D0',
    },
  },
  submitButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 3,
    py: 1,
    borderRadius: '25px',
    textTransform: 'none',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  },
};