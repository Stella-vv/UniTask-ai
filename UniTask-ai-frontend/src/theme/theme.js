import { createTheme } from '@mui/material/styles';

const palette = {
  primary: {
    main: '#62BBF5', // left navigation bar background
    contrastText: '#FFFFFF', // left navigation bar text
  },
  background: {
    default: '#FFFFFF', // right content area background color
    paper: '#EFF8FF', // background color for cards/paper elements
  },
  text: {
    primary: '#1E293B', // A dark color for primary text for readability
    secondary: '#64748B',
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
    borderRadius: 16, // Matching the border radius from the image
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
          minWidth: '56px', // Increased spacing for the larger icon
          // Targeting the icon itself inside the container
          '& .MuiSvgIcon-root': {
            fontSize: '32px', 
          }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '1.125rem', // Making the font slightly larger (default is 1rem)
          fontWeight: 500,
        }
      }
    }
  }
});