// src/tutorworkspace/faqs/FaqUpload_styles.js (Corrected)

export const faqUploadStyles = {
  container: { 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    p: 0 
  },

  // --- START: CORRECTED HEADER STYLE ---
  topHeader: {
    bgcolor: 'primary.main',
    height: '100px',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // FIX: Align text to the left
    color: 'white',
    p: 3, // FIX: Add padding for the text
    mt: -4, // FIX: Negative margin to pull header up into parent's padding
    ml: -4, // FIX: Negative margin to pull header left
    mr: -4, // FIX: Negative margin to pull header right
    width: 'calc(100% + 64px)', // FIX: Increase width to span the full container
  },

  headerTitle: { 
    color: 'white', 
    fontWeight: 600, 
    fontSize: '1.75rem', // Adjusted font size for consistency
  },
  // --- END: CORRECTED HEADER STYLE ---

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
};