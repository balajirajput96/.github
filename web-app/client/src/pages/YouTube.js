import React, { useState } from 'react';
import { Typography, Button, Paper, Box, CircularProgress, Alert } from '@mui/material';
import useFetch from '../hooks/useFetch';

/**
 * @description The YouTube page component. This page displays content related to YouTube integration.
 * @returns {JSX.Element} The rendered YouTube page.
 */
const YouTube = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, loading, error } = useFetch(shouldFetch ? '/api/youtube' : null);

  const handleFetchData = () => {
    setShouldFetch(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        YouTube Integration
      </Typography>
      <Typography paragraph>
        Connect to your YouTube account to manage videos, view analytics, and automate content-related tasks.
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Connect to YouTube</Typography>
        <Typography paragraph>
          Click the button below to fetch data from the YouTube API. This is a sample interaction to demonstrate connectivity.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleFetchData} disabled={loading || shouldFetch}>
          {loading ? <CircularProgress size={24} /> : 'Fetch YouTube Data'}
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
            <Typography>Channel: {data.data.channel}</Typography>
            <Typography>Subscribers: {data.data.subscribers}</Typography>
            <Typography>Videos: {data.data.videos}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default YouTube;