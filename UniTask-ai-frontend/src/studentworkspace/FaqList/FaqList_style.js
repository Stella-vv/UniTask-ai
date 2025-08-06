// test/studentworkspace/FaqList/FaqList_style.js

// --- FIX: Ensure this line is exactly 'export const studentFaqListStyles' ---
export const studentFaqListStyles = {
  // Container for the filter dropdowns
  filterContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
    mb: 2,
  },
  
  // Base style for both dropdown containers
  formControl: {
    minWidth: 240,
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
  },

  // Specific style for the assignment dropdown's container
  assignmentFormControl: {
    minWidth: 240,
    '& .MuiInputLabel-root.Mui-disabled': {
      color: 'rgba(0, 0, 0, 0.38)',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
    },
  },
};