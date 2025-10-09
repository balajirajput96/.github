import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const initialIntegrations = [
  { name: 'Slack', connected: false },
  { name: 'Atlassian JIRA', connected: false },
  { name: 'Claude AI', connected: false },
  { name: 'YouTube', connected: false },
  { name: 'Google Drive', connected: false },
];

function Integrations() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (code) {
      fetch('/api/slack/oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setIntegrations((prevIntegrations) =>
              prevIntegrations.map((int) =>
                int.name === 'Slack' ? { ...int, connected: true } : int
              )
            );
          }
        });
    }
  }, [location]);

  const handleConnectSlack = () => {
    const clientId = '12345.67890'; // Placeholder Client ID
    const redirectUri = 'http://localhost:3000/integrations';
    const scope = 'chat:write,commands,users:read';
    const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = slackAuthUrl;
  };

  const handleSendTestMessage = () => {
    fetch('/api/slack/test-message', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          alert('Test message sent successfully!');
        } else {
          alert(`Failed to send test message: ${data.error}`);
        }
      });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Platform Integrations
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Connect your favorite platforms and services
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Add New Integration
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Button variant="contained" onClick={handleConnectSlack}>
              Connect to Slack
            </Button>
          </Paper>
        </Grid>
        <Grid xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Connected Integrations
          </Typography>
          <Paper>
            <List>
              {integrations.map((integration, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={integration.name}
                    secondary={integration.connected ? 'Connected' : 'Not Connected'}
                  />
                  <ListItemSecondaryAction>
                    {integration.name === 'Slack' && integration.connected && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleSendTestMessage}
                        sx={{ mr: 1 }}
                      >
                        Send Test
                      </Button>
                    )}
                    {integration.connected && (
                      <IconButton edge="end" aria-label="delete">
                        <Delete />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Integrations;