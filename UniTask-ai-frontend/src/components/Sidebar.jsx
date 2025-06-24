import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

//Import your logo file from the assets folder
import customLogo from '../assets/logo.png'; 

// Import icons from MUI
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

const drawerWidth = 280;

// Logo component
const Logo = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, mb: 0.5 }}>
    <Box
      component="img"
      src={customLogo}
      alt="UniTask Logo"
      sx={{ 
        width: 200,
        height: 100,
        objectFit: 'contain', 
      }}
    />
  </Box>
);

const Sidebar = () => {
  const navItems = [
    { text: 'Home', icon: <HomeIcon /> },
    { text: 'Course', icon: <SchoolIcon /> },
    { text: 'Assignment', icon: <AssignmentIcon /> },
    { text: 'Q&As', icon: <LiveHelpIcon /> },
    { text: 'Forum', icon: <ForumIcon /> },
    { text: 'FAQs', icon: <HelpOutlineIcon /> },
  ];

  return (
    <Box
      component="nav"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%', 
      }}
    >
      <Box sx={{ pt: 2 }}>
        <Logo />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton selected={item.text === 'Home'}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;