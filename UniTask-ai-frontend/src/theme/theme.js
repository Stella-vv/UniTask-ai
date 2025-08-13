import { createTheme } from '@mui/material/styles';

const palette = {
  primary: {
    main: '#62BBF5',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#EFF8FF',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    courseText: '#325c8c',
  }
};

export const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h4: {
      fontWeight: 600,
      color: palette.text.primary
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '10px 16px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: '#EFF8FF',
            color: '#3B82F6',
            '&:hover': {
              backgroundColor: '#EFF8FF',
            },
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
              fontWeight: '600',
              color: '#3B82F6',
            },
          },
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: '56px', 
          '& .MuiSvgIcon-root': {
            fontSize: '32px', 
          }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '1.125rem',
          fontWeight: 500,
        }
      }
    }
  }
});