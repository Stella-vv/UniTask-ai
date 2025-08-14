export const tutorAssignmentListStyles = {
  contentArea: {
    bgcolor: 'background.paper',
    ml: -4, mr: -4, width: 'calc(100% + 64px)', mb: -4, p: 4,
    flexGrow: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'flex-start',
    boxSizing: 'border-box',
    borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px',
  },
  
  filterContainer: {
    width: '100%',
    maxWidth: 600,
    marginBottom: '24px',
  },
  
  uploadButton: {
    mt: 3, bgcolor: 'primary.main',
    '&:hover': { bgcolor: 'primary.dark' },
    fontWeight: 600, px: 4, py: 1.5,
    borderRadius: '25px', fontSize: '1rem',
    minWidth: '140px', textTransform: 'none',
  }
};