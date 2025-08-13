export const assignmentUploadStyles = {
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
    gap: 2,
    color: 'white',
    p: 3, 
    mt: -4, 
    ml: -4, 
    mr: -4,
    width: 'calc(100% + 64px)', 
  },

  uploadIcon: {
    fontSize: '32px',
    color: 'white',
  },

  headerTitle: {
    color: 'white',
    fontWeight: 600,
    fontSize: '2rem',
  },

  formContainer: {
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

  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },

  fieldLabel: {
    color: 'text.courseText',
    fontWeight: 600,
    fontSize: '1.125rem',
    mb: 1,
  },

  textField: {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'white',
      borderRadius: '8px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiInputBase-input': {
      color: 'text.courseText',
      fontSize: '1rem',
    },
  },

  selectField: {
    bgcolor: 'white',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main',
    },
    '& .MuiSelect-select': {
      color: 'text.courseText',
      fontSize: '1rem',
      padding: '16.5px 14px',
    },
    '& .MuiSelect-icon': {
      color: 'primary.main',
      fontSize: '24px',
    },
  },

  dateField: {
    maxWidth: '300px',
    '& .MuiOutlinedInput-root': {
      bgcolor: 'white',
      borderRadius: '8px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiInputBase-input': {
      color: 'text.courseText',
      fontSize: '1rem',
    },
  },

  fileUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    mt: 4,
    pt: 2,
  },

  confirmButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 4,
    py: 1.5,
    borderRadius: '25px',
    fontSize: '1rem',
    minWidth: '140px',
    textTransform: 'none',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
    '&:disabled': {
      bgcolor: 'rgba(98, 187, 245, 0.5)',
      color: 'white',
    },
  },

  cancelButton: {
    bgcolor: 'primary.main',
    color: 'white',
    fontWeight: 600,
    px: 4,
    py: 1.5,
    borderRadius: '25px',
    fontSize: '1rem',
    minWidth: '140px',
    textTransform: 'none',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
    '&:disabled': {
      bgcolor: 'rgba(98, 187, 245, 0.5)',
      color: 'white',
    },
  },

  fileDisplayContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    bgcolor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    p: 2,
    mt: 1,
  },

  fileName: {
    color: 'text.courseText',
    fontSize: '0.875rem',
    flex: 1,
  },

  errorText: {
    color: '#f44336',
    fontSize: '0.75rem',
    mt: 0.5,
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    bgcolor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
  },
};