import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import MUI related modules
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { theme } from './theme/theme.js'; 

// Import our chosen font
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the App component with ThemeProvider, using the IMPORTED theme */}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);