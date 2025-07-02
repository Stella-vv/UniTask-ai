export const assignmentDetailStyles = {
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
    justifyContent: 'center',
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
    gap: 2,
    overflowY: 'auto',
  },

  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
  },

  assignmentTitle: {
    color: 'text.courseText',
    fontWeight: 600,
    fontSize: '2rem',
    flex: 1,
  },

  actionButtons: {
    display: 'flex',
    gap: 2,
    flexShrink: 0,
  },

  modifyButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 3,
    py: 1,
    borderRadius: '25px',
    fontSize: '0.875rem',
    textTransform: 'none',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  },

  deleteButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 3,
    py: 1,
    borderRadius: '25px',
    fontSize: '0.875rem',
    textTransform: 'none',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  },

  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    mb: 2,
  },

  infoLabel: {
    color: 'text.courseText',
    fontWeight: 600,
    fontSize: '1.125rem',
  },

  descriptionSection: {
    mb: 2,
  },

  sectionTitle: {
    color: 'text.courseText',
    fontWeight: 600,
    fontSize: '1.125rem',
    mb: 1.5,
  },

  descriptionText: {
    color: 'text.courseText',
    fontSize: '1rem',
    lineHeight: 1.6,
    fontWeight: 400,
  },

  rubricSection: {
    mb: 2,
  },

  fileChip: {
    bgcolor: '#E3F2FD',
    color: 'primary.main',
    fontWeight: 500,
    px: 2,
    py: 1,
    borderRadius: '20px',
    cursor: 'pointer',
    '&:hover': {
      bgcolor: '#BBDEFB',
    },
  },

  attachmentSection: {
    mb: 3,
  },

  attachmentList: {
    bgcolor: 'white',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    p: 0,
    overflow: 'hidden',
  },

  attachmentItem: {
    display: 'flex',
    alignItems: 'center',
    px: 3,
    py: 2,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      bgcolor: '#F8FAFC',
    },
  },

  fileIcon: {
    mr: 2,
    display: 'flex',
    alignItems: 'center',
  },

  fileName: {
    color: 'text.courseText',
    fontSize: '1rem',
    fontWeight: 500,
  },

  fileDivider: {
    mx: 3,
    borderColor: '#E2E8F0',
  },

  forumButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    mt: 'auto',
    pt: 3,
  },

  forumButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 4,
    py: 1.5,
    borderRadius: '25px',
    fontSize: '1rem',
    minWidth: '120px',
    textTransform: 'none',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  },

  // 加载和错误状态样式
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },

  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    color: 'error.main',
  },

  // 响应式样式
  '@media (max-width: 768px)': {
    titleSection: {
      flexDirection: 'column',
      gap: 2,
      alignItems: 'flex-start',
    },

    actionButtons: {
      width: '100%',
      justifyContent: 'flex-start',
    },

    assignmentTitle: {
      fontSize: '1.5rem',
    },

    contentArea: {
      px: 2,
    },
  },
};