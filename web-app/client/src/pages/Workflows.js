import React, { useState } from 'react';
import { Box, Typography, Button, Paper, FormControl, InputLabel, Select, MenuItem, Grid, TextField, List, ListItem, ListItemText, Chip, Alert } from '@mui/material';

const triggers = [
  'Daily Pharma Job Scan (09:00 IST)',
  'New Job Lead Found (>55 Match Score)',
  'New Slack Message in #pharma-jobs',
  'Resume Uploaded to ATS Analyzer',
  'File Added to Google Drive',
];

const actions = [
  'Generate Tailored HR Outreach Draft',
  'Score Resume Match Against Job Description',
  'Send WhatsApp Direct Link Notification',
  'Export Daily Analytics to Dashboard',
  'Sync to Google Drive Outreach Folder',
];

const initialWorkflows = [
  { id: 1, name: 'Vadodara OSD Job Hunter', trigger: 'Daily Pharma Job Scan (09:00 IST)', action: 'Generate Tailored HR Outreach Draft', status: 'Active' },
  { id: 2, name: 'High-Match ATS Alert', trigger: 'New Job Lead Found (>55 Match Score)', action: 'Send WhatsApp Direct Link Notification', status: 'Active' },
  { id: 3, name: 'Resume QA Optimizer', trigger: 'Resume Uploaded to ATS Analyzer', action: 'Score Resume Match Against Job Description', status: 'Active' },
];

function Workflows() {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [workflowName, setWorkflowName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = async () => {
    if (!trigger || !action) return;
    const name = workflowName.trim() || `${trigger.split(' ')[0]} -> ${action.split(' ')[0]}`;

    try {
      const res = await fetch('/api/workflow/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowName: name, steps: [trigger, action] }),
      });
      const data = await res.json();
      setWorkflows((prev) => [...prev, { id: Date.now(), name, trigger, action, status: 'Active' }]);
      setSuccessMsg(data.message || `Workflow '${name}' created successfully.`);
      setWorkflowName('');
      setTrigger('');
      setAction('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setWorkflows((prev) => [...prev, { id: Date.now(), name, trigger, action, status: 'Active' }]);
      setSuccessMsg(`Workflow '${name}' created locally.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleToggle = (id) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: w.status === 'Active' ? 'Paused' : 'Active' } : w))
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Automation Workflows
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Create, configure, and monitor multi-step automated workflows
      </Typography>

      {successMsg && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Create New Workflow
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Workflow Name (Optional)"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="e.g. Daily Sun Pharma Outreach Alert"
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
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
        <Button variant="contained" sx={{ mt: 3 }} onClick={handleCreate} disabled={!trigger || !action}>
          Create Workflow
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Active Workflows ({workflows.length})
        </Typography>
        <List>
          {workflows.map((wf) => (
            <ListItem
              key={wf.id}
              sx={{ borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <ListItemText
                primary={<strong>{wf.name}</strong>}
                secondary={`Trigger: ${wf.trigger} ➔ Action: ${wf.action}`}
              />
              <Box>
                <Chip
                  label={wf.status}
                  color={wf.status === 'Active' ? 'success' : 'default'}
                  size="small"
                  onClick={() => handleToggle(wf.id)}
                  sx={{ cursor: 'pointer', mr: 1 }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Workflows;