export const studentFaqListStyles = {
  filterContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
    mb: 2,
  },

  formControl: {
    minWidth: 240,
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
  },

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