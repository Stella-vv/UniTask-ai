// test/tutorworkspace/QandAUpload/QandAUploadPage_style.js

export const qandaUploadPageStyles = {
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
    // 修改点1：文字靠左对齐
    justifyContent: 'flex-start', // 从 'center' 修改为 'flex-start'
    // 修改点2：添加内边距，使文字不紧贴左侧边缘
    p: 3, // 添加内边距，与 AssignmentList 保持一致
    gap: 2,
    color: 'white',
    // 修改点3：通过负外边距和宽度调整，消除与父容器的空隙
    mt: -4, // 向上负边距
    ml: -4, // 向左负边距
    mr: -4, // 向右负边距
    width: 'calc(100% + 64px)', // 宽度增加，以抵消左右的内边距 (4px * 2 = 64px, 因为 p:4 = 32px)
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

  fileUploadArea: {
    border: '2px dashed #B0D9FF',
    borderRadius: '8px',
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'white',
    cursor: 'pointer',
    '&:hover': {
      borderColor: 'primary.main',
    },
    minHeight: '150px',
  },

  uploadPlaceholderIcon: {
    fontSize: '48px',
    color: '#B0D9FF',
    mb: 1,
  },

  uploadPlaceholderText: {
    color: 'text.secondary',
    fontSize: '1rem',
    fontWeight: 500,
  },

  uploadedFileName: {
    color: 'text.courseText',
    fontSize: '1rem',
    fontWeight: 500,
    mt: 1,
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

  errorText: {
    color: '#f44336',
    fontSize: '0.75rem',
    mt: 0.5,
  },
};