export const courseDetailStyles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    p: 0, 
  },

  topBlueHeader: {
    bgcolor: 'primary.main',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    p: 3, 
    mt: -4, 
    ml: -4,
    mr: -4,
    width: 'calc(100% + 64px)',
    boxSizing: 'border-box',
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
    gap: 1.5, 
   
  },

  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
  },

  courseTitle: {
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
    '&:hover': {
      bgcolor: 'primary.dark',
    },
    textTransform: 'none',
  },

  deleteButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 3,
    py: 1,
    borderRadius: '25px',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
    textTransform: 'none',
  },

  courseId: {
    color: 'text.courseText', 
    fontSize: '1.25rem',
    fontWeight: 600, 
    mb: 1, 
  },

  summarySection: {
    mb: 1.5, 
  },

  sectionTitle: {
    color: 'text.courseText', 
    fontWeight: 600, 
    fontSize: '1.25rem',
    mb: 1, 
  },

  summaryText: {
    color: 'text.courseText', 
    lineHeight: 1.5, 
    fontSize: '1rem',
    fontWeight: 400, 
  },

  assessmentsSection: {
    mb: 2, 
  },

  assessmentsList: {
    p: 0,
  },

  assessmentItem: {
    px: 0,
    py: 0.5,
  },

  assessmentText: {
    color: 'text.courseText', 
    fontSize: '1rem', 
    lineHeight: 1, 
    fontWeight: 400, 
  },

  navigationButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    mt: 'auto',
    pt: 2,
  },

  navButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 4,
    py: 1.5,
    borderRadius: '25px',
    fontSize: '1rem',
    minWidth: '140px', 
    '&:hover': {
      bgcolor: 'primary.dark',
    },
    textTransform: 'none',
  },
};