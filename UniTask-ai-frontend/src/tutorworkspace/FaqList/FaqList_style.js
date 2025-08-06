
export const faqListStyles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    p: 0,
  },
  topHeader: {
    bgcolor: 'primary.main',
    height: '80px', 
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
    p: 3,
    mt: -4,
    ml: -4,
    mr: -4,
    width: 'calc(100% + 64px)',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 600,
    fontSize: '2rem', 
  },
  backButton: {
    color: 'white',
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: '2px', // Set border width to 2px
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'white',
      borderWidth: '2px', // Ensure border width stays 2px on hover
    }
  },
  contentArea: {
    bgcolor: '#EFF8FF',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    p: 4,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    overflowY: 'auto',
  },
  controlSection: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  uploadButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 3,
    py: 1.5,
    borderRadius: '25px',
    fontSize: '1rem',
    textTransform: 'none',
    '&:hover': {
        bgcolor: 'primary.dark',
    },
  },
  accordion: {
    mb: 1,
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden', // Add this line to clip the inner content
    '&:before': {
      display: 'none',
    },
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }
  },
  accordionSummary: {
    '& .MuiAccordionSummary-content': {
      alignItems: 'center',
    }
  },
  questionText: {
    fontWeight: 500,
    flexGrow: 1,
    mr: 2,
  },
  editButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '50%',
    color: 'text.secondary',
    cursor: 'pointer',
    '&:hover': {
        color: 'primary.main',
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  },
  accordionDetails: {
    backgroundColor: '#F9FAFB',
    borderTop: '1px solid #E2E8F0',
    padding: '16px',
  },
  answerText: {
    color: 'text.secondary',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text.secondary',
  },
  emptyIcon: {
    fontSize: '64px',
    mb: 2,
    color: 'text.disabled',
  },
};