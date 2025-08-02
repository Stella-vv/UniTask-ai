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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { NavLink } from 'react-router-dom';

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
    { text: 'Home', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Course', icon: <SchoolIcon />, path: '/tutor/course' },
    { text: 'Assignment', icon: <AssignmentIcon />, path: '/tutor/assignment' },
    { text: 'Q&As', icon: <LiveHelpIcon />, path: '/tutor/qnas' },
    // 移除了 Forum 导航项
    { text: 'FAQs', icon: <HelpOutlineIcon />, path: '/tutor/faqs' },
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
              <ListItemButton 
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: 12,
                  margin: '10px 16px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.active': { 
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
                }}
              >
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