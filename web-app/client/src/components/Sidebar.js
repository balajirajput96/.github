import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const navLinks = [
  { text: 'Dashboard', path: '/' },
  { text: 'Atlassian', path: '/atlassian' },
  { text: 'Slack', path: '/slack' },
  { text: 'Claude AI', path: '/claude-ai' },
  { text: 'YouTube', path: '/youtube' },
  { text: 'Google Drive', path: '/google-drive' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {navLinks.map((link) => (
          <ListItemButton
            component={Link}
            to={link.path}
            key={link.path}
            selected={location.pathname === link.path}
          >
            <ListItemText primary={link.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;