import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

/**
 * @description The Sidebar component provides navigation links to the main pages of the application.
 * It is displayed as a permanent drawer on the side of the layout.
 * @returns {JSX.Element} The rendered sidebar component.
 */
const Sidebar = () => {
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
        <ListItemButton component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/atlassian">
          <ListItemText primary="Atlassian" />
        </ListItemButton>
        <ListItemButton component={Link} to="/slack">
          <ListItemText primary="Slack" />
        </ListItemButton>
        <ListItemButton component={Link} to="/claude-ai">
          <ListItemText primary="Claude AI" />
        </ListItemButton>
        <ListItemButton component={Link} to="/youtube">
          <ListItemText primary="YouTube" />
        </ListItemButton>
        <ListItemButton component={Link} to="/google-drive">
          <ListItemText primary="Google Drive" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;