// src/tutorworkspace/faqs/FaqUpload_styles.js
export const faqUploadStyles = {
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

  formContainer: {
    bgcolor: '#EFF8FF',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
    p: 4,
    flex: 1,
    overflowY: 'auto',
  },

  fieldContainer: { mb: 3 },
  fieldLabel: { mb: 1, fontWeight: 600 },

  selectField: {
    bgcolor: 'white',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.23)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
  },

  textField: {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'white',
      borderRadius: '8px',
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
    },
  },

  buttonContainer: { display: 'flex', gap: 2, mt: 4 },

  confirmButton: {
    bgcolor: 'primary.main',
    color: 'white',
    textTransform: 'none',
    fontWeight: 600,
    px: 3,
    py: 1.5,
    borderRadius: '25px',
    '&:hover': { bgcolor: 'primary.dark' },
  },

  cancelButton: {
    bgcolor: 'grey.500',
    color: 'white',
    textTransform: 'none',
    fontWeight: 600,
    px: 3,
    py: 1.5,
    borderRadius: '25px',
    '&:hover': { bgcolor: 'grey.600' },
  },
};
