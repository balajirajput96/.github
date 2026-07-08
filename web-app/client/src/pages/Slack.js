import React, { useState } from 'react';
import { Typography, Button, Paper, Box, CircularProgress, Alert } from '@mui/material';
import useFetch from '../hooks/useFetch';

/**
 * @description The Slack page component. This page displays content related to Slack integration.
 * @returns {JSX.Element} The rendered Slack page.
 */
const Slack = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, loading, error } = useFetch(shouldFetch ? '/api/slack' : null);

  const handleFetchData = () => {
    setShouldFetch(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Slack Integration
      </Typography>
      <Typography paragraph>
        Integrate with your Slack workspace to receive notifications, send messages, and automate communication tasks.
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Connect to Slack</Typography>
        <Typography paragraph>
          Click the button below to fetch data from the Slack API. This is a sample interaction to demonstrate connectivity.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleFetchData} disabled={loading || shouldFetch}>
          {loading ? <CircularProgress size={24} /> : 'Fetch Slack Data'}
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
            <Typography>Workspace: {data.data.workspace}</Typography>
            <Typography>Channels:</Typography>
            <ul>
              {data.data.channels.map(channel => (
                <li key={channel}>{channel}</li>
              ))}
            </ul>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Slack;