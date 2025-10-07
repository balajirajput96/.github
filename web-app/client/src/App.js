import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Integrations from './pages/Integrations';
import Workflows from './pages/Workflows';
import AIAssistant from './pages/AIAssistant';
import ContentHub from './pages/ContentHub';
import Analytics from './pages/Analytics';

const drawerWidth = 240;

const pages = [
  { text: 'Dashboard', path: '/' },
  { text: 'Integrations', path: '/integrations' },
  { text: 'Workflows', path: '/workflows' },
  { text: 'AI Assistant', path: '/ai-assistant' },
  { text: 'Content Hub', path: '/content-hub' },
  { text: 'Analytics', path: '/analytics' },
];

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          {pages.map((page) => (
            <ListItem key={page.text} disablePadding>
              <ListItemButton component={Link} to={page.path}>
                <ListItemText primary={page.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/content-hub" element={<ContentHub />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;