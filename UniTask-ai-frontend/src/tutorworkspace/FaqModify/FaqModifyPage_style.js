// test/tutorworkspace/FaqModify/FaqModifyPage_style.js

export const faqModifyStyles = {
  container: { 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    p: 0 
  },
  topHeader: {
    bgcolor: 'primary.main',
    height: '80px',
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
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
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
      bgcolor: 'primary.dark' 
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
      bgcolor: 'primary.dark' 
    },
  },
  deleteButton: {
    bgcolor: 'error.main',
    color: 'white',
    fontWeight: 600,
    px: 4,
    py: 1.5,
    borderRadius: '25px',
    fontSize: '1rem',
    minWidth: '140px',
    textTransform: 'none',
    '&:hover': {
      bgcolor: 'error.dark',
    },
  },
};