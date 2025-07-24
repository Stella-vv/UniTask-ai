// test/tutorworkspace/AssignmentModify/AssignmentModifyPage_style.js

export const assignmentModifyStyles = {
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
  headerIcon: {
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
};