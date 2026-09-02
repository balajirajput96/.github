import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Paper, List, ListItem, ListItemText, Divider, Chip, Alert, CircularProgress } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const GitHub = () => {
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/github', {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRepos(Array.isArray(data) ? data : data.repositories || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <GitHubIcon sx={{ mr: 1, fontSize: 32 }} /> GitHub Integration
      </Typography>
      <Typography paragraph>
        Manage your connected GitHub repositories.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleFetch} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Sync Repositories'}
      </Button>
      <Box mt={3}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper elevation={3}>
          <List>
            {repos.length > 0 ? (
              repos.map((repo, index) => (
                <React.Fragment key={repo.id || index}>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemText
                      primary={<a href={repo.html_url || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>{repo.name || repo.full_name}</a>}
                      secondary={repo.description || 'No description available'}
                    />
                    <Box>
                      {repo.language && <Chip label={repo.language} size="small" sx={{ mr: 1 }} />}
                      <Chip label={repo.private ? 'Private' : 'Public'} size="small" color={repo.private ? 'default' : 'success'} />
                    </Box>
                  </ListItem>
                  {index < repos.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <ListItem>
                <ListItemText primary={loading ? 'Loading...' : 'No repositories found. Make sure GITHUB_TOKEN is set in backend.'} />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};
export default GitHub;
