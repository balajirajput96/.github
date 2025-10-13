import React, { useState } from 'react';
import { Typography, Button, Paper, Box, CircularProgress, Alert } from '@mui/material';
import useFetch from '../hooks/useFetch';

/**
 * @description The Atlassian page component. This page displays content related to Atlassian integration.
 * @returns {JSX.Element} The rendered Atlassian page.
 */
const Atlassian = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, loading, error } = useFetch(shouldFetch ? '/api/atlassian' : null);

  const handleFetchData = () => {
    setShouldFetch(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Atlassian Integration
      </Typography>
      <Typography paragraph>
        Connect to your Atlassian products like Jira and Confluence to automate tasks, sync data, and enhance your project management workflows.
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Connect to Atlassian</Typography>
        <Typography paragraph>
          Click the button below to fetch data from the Atlassian API. This is a sample interaction to demonstrate connectivity.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleFetchData} disabled={loading || shouldFetch}>
          {loading ? <CircularProgress size={24} /> : 'Fetch Atlassian Data'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error: {error.message}
          </Alert>
        )}

        {data && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">API Response:</Typography>
            <Typography>Message: {data.message}</Typography>
            <Typography>Projects:</Typography>
            <ul>
              {data.data.projects.map(project => (
                <li key={project.id}>{project.name}</li>
              ))}
            </ul>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Atlassian;