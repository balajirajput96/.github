import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Paper, List, ListItem, ListItemText, Divider, Alert, CircularProgress, Chip } from '@mui/material';

const Atlassian = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/jira/projects');
      if (!response.ok) throw new Error('Failed to fetch from Jira');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handleFetch(); }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Atlassian / Jira Integration</Typography>
      <Typography paragraph>Manage agile tasks, job tracking, and workflows.</Typography>
      <Button variant="contained" onClick={handleFetch} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Sync Projects'}
      </Button>
      <Box mt={3}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper elevation={3}>
          <List>
            {projects.length > 0 ? (
              projects.map((proj, i) => (
                <React.Fragment key={i}>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemText primary={proj.name} secondary={`Key: ${proj.key}`} />
                    <Chip label="Active" size="small" color="primary" />
                  </ListItem>
                  {i < projects.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <ListItem><ListItemText primary={loading ? 'Loading...' : 'No projects found or Jira not configured.'} /></ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};
export default Atlassian;
