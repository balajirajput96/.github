import React from 'react';
import { Box, Typography, Button, Grid, Paper, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

const integrations = [
  { name: 'Slack', connected: true },
  { name: 'Atlassian JIRA', connected: false },
  { name: 'Claude AI', connected: true },
  { name: 'YouTube', connected: false },
  { name: 'Google Drive', connected: true },
];

function Integrations() {
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
            <TextField
              fullWidth
              label="API Key / Token"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Endpoint URL (Optional)"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button variant="contained">Connect</Button>
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
                    <IconButton edge="end" aria-label="delete">
                      <Delete />
                    </IconButton>
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