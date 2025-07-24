export const assignmentDetailStyles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    p: 0,
  },

  topHeader: {
    bgcolor: 'primary.main',
    height: '80px', // Set to 80px to match other pages
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
    flex: 1, // Key: allow this area to fill remaining space
    display: 'flex',
    flexDirection: 'column',
  },

  // This wrapper will contain all the scrollable content
  mainContentWrapper: {
    flex: 1, // Key: make this inner wrapper take up space so it can scroll
    overflowY: 'auto',
  },

  assignmentTitle: {
    color: 'text.courseText',
    fontWeight: 600,
    fontSize: '2rem',
    mb: 3, // Add spacing between title and content below
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

  // MODIFICATION: Renamed container and added gap for multiple buttons
  bottomButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 4, // Adds space between the buttons
    pt: 3,
  },

  // MODIFICATION: Made a reusable style for the action buttons
  actionButton: {
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