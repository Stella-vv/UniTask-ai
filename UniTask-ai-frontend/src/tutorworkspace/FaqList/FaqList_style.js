// test/tutorworkspace/FaqList/FaqList_style.js

export const faqListStyles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    p: 0,
  },
  topHeader: {
    bgcolor: 'primary.main',
    height: '100px',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    fontSize: '1.75rem',
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
    '&:before': {
      display: 'none',
    },
  },
  questionText: {
    fontWeight: 500,
  },
  accordionDetails: {
    backgroundColor: '#F9FAFB',
    borderTop: '1px solid #E2E8F0',
    padding: '16px',
  },
  answerText: {
    color: 'text.secondary',
  },
  // --- START: STYLES FOR EMPTY STATE (To match Q&A page) ---
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
  // --- END: STYLES FOR EMPTY STATE ---
};