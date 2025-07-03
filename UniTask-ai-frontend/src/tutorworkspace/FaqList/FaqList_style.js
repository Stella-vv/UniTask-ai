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

  headerIcon: {
    fontSize: '32px',
    color: 'white',
  },

  headerTitle: {
    color: 'white',
    fontWeight: 600,
    fontSize: '2rem',
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

  faqContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },

  courseAccordion: {
    bgcolor: 'white',
    borderRadius: '12px !important',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #E2E8F0',
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      margin: '0 !important',
    },
  },

  courseAccordionSummary: {
    bgcolor: '#F0F9FF',
    borderRadius: '12px',
    minHeight: '60px',
    '&.Mui-expanded': {
      borderBottomLeftRadius: '0',
      borderBottomRightRadius: '0',
    },
    '& .MuiAccordionSummary-content': {
      alignItems: 'center',
    },
  },

  courseName: {
    color: '#1E40AF',
    fontWeight: 600,
    fontSize: '1.125rem',
  },

  expandIcon: {
    color: '#1E40AF',
    fontSize: '24px',
  },

  courseAccordionDetails: {
    padding: 0,
    bgcolor: 'white',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
  },

  faqList: {
    padding: 0,
    width: '100%',
  },

  faqItem: {
    padding: '16px 24px',
    alignItems: 'flex-start',
    '&:hover': {
      bgcolor: '#FAFBFC',
    },
  },

  faqContent: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 2,
  },

  questionText: {
    color: '#1E40AF',
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.4,
    mb: 1,
  },

  answerText: {
    color: '#64748B',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },

  faqActions: {
    display: 'flex',
    gap: 1,
    flexShrink: 0,
  },

  actionButton: {
    color: '#64748B',
    padding: '4px',
    '&:hover': {
      color: '#1E40AF',
      bgcolor: '#F0F9FF',
    },
  },

  faqDivider: {
    mx: 3,
    borderColor: '#E2E8F0',
  },

  uploadButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    mt: 2,
  },

  uploadButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 6,
    py: 1.5,
    borderRadius: '25px',
    fontSize: '1rem',
    textTransform: 'none',
    minWidth: '120px',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  },

  // 空状态样式
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 8,
    gap: 2,
  },

  emptyStateIcon: {
    fontSize: '48px',
    color: '#94A3B8',
  },

  emptyStateText: {
    color: '#64748B',
    fontSize: '1.125rem',
    textAlign: 'center',
  },

  // 响应式样式
  '@media (max-width: 768px)': {
    contentArea: {
      px: 2,
    },

    faqItem: {
      padding: '12px 16px',
    },

    faqContent: {
      flexDirection: 'column',
      gap: 1,
    },

    faqActions: {
      alignSelf: 'flex-end',
    },

    questionText: {
      fontSize: '0.875rem',
    },

    answerText: {
      fontSize: '0.8rem',
    },
  },
};