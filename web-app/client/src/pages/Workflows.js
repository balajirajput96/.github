import React from 'react';
import { Box, Typography, Button, Paper, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

const triggers = [
  'New Slack message',
  'New JIRA ticket created',
  'File uploaded to Google Drive',
  'New YouTube video uploaded',
];

const actions = [
  'Create JIRA ticket',
  'Send Slack message',
  'Translate text with Claude AI',
  'Upload file to Google Drive',
];

function Workflows() {
  const [trigger, setTrigger] = React.useState('');
  const [action, setAction] = React.useState('');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Automation Workflows
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Create and manage your automation workflows
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Workflow
        </Typography>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="trigger-select-label">1. Choose Trigger</InputLabel>
              <Select
                labelId="trigger-select-label"
                id="trigger-select"
                value={trigger}
                label="1. Choose Trigger"
                onChange={(e) => setTrigger(e.target.value)}
              >
                {triggers.map((t, index) => (
                  <MenuItem key={index} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="action-select-label">2. Choose Action</InputLabel>
              <Select
                labelId="action-select-label"
                id="action-select"
                value={action}
                label="2. Choose Action"
                onChange={(e) => setAction(e.target.value)}
              >
                {actions.map((a, index) => (
                  <MenuItem key={index} value={a}>{a}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 3 }}>
          Create Workflow
        </Button>
      </Paper>
    </Box>
  );
}

export default Workflows;