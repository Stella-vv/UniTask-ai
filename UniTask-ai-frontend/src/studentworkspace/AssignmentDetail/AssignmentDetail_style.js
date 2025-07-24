// test/studentworkspace/AssignmentDetail/AssignmentDetail_style.js (Final Corrected Version)

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
    fontSize: '2rem',
  },

  contentArea: {
    bgcolor: '#EFF8FF',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    p: 4,
    flex: 1, // 关键：让此区域占据所有剩余空间
    display: 'flex',
    flexDirection: 'column',
  },

  // This wrapper will contain all the scrollable content
  mainContentWrapper: {
    flex: 1, // 关键：让这个内部wrapper占据空间，而不是整个contentArea
    overflowY: 'auto',
  },

  assignmentTitle: {
    color: 'text.courseText',
    fontWeight: 600,
    fontSize: '2rem',
    mb: 3, // 增加标题和下方内容的间距
  },

  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    mb: 3,
  },

  infoLabel: {
    color: 'text.courseText',
    fontWeight: 600,
    fontSize: '1.125rem',
  },

  descriptionSection: {
    mb: 3,
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
    mb: 3,
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

  fileIcon: {
    mr: 2,
    display: 'flex',
    alignItems: 'center',
  },

  forumButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    pt: 3, // 只保留顶部内边距
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
};