// src/tutorworkspace/FaqList/FaqList_styles.js
export const faqListStyles = {
  container: { height: '100%', display: 'flex', flexDirection: 'column', p: 0 },

  topHeader: {
    bgcolor: 'primary.main',
    height: '100px',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },

  headerTitle: { color: 'white', fontWeight: 600, fontSize: '2rem' },

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
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    mb: 2,
  },

  courseSelector: {
    minWidth: 300,
    bgcolor: 'white',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 8,
    color: 'text.secondary',
  },

  accordion: {
    mb: 1.5,
    border: '1px solid #E2E8F0',
    borderRadius: '12px !important',
    boxShadow: 'none',
    '&:before': { display: 'none' },
  },

  questionText: {
    fontWeight: 600,
    fontSize: '1rem',
    color: 'text.courseText',
  },

  accordionDetails: {
    bgcolor: 'white',
    borderTop: '1px solid #E2E8F0',
  },

  answerText: {
    whiteSpace: 'pre-wrap',
    color: '#475569',
  },
};
