import React, { useState } from 'react';
import { Typography, Button, Paper, Box, CircularProgress, Alert } from '@mui/material';
import useFetch from '../hooks/useFetch';

/**
 * @description The ClaudeAI page component. This page displays content related to Claude AI integration.
 * @returns {JSX.Element} The rendered ClaudeAI page.
 */
const ClaudeAI = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, loading, error } = useFetch(shouldFetch ? '/api/claude-ai' : null);

  const handleFetchData = () => {
    setShouldFetch(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Claude AI Integration
      </Typography>
      <Typography paragraph>
        Leverage the power of Claude AI for advanced text generation, summarization, and analysis.
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Connect to Claude AI</Typography>
        <Typography paragraph>
          Click the button below to fetch data from the Claude AI API. This is a sample interaction to demonstrate connectivity.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleFetchData} disabled={loading || shouldFetch}>
          {loading ? <CircularProgress size={24} /> : 'Fetch Claude AI Data'}
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
            <Typography>Model: {data.data.model}</Typography>
            <Typography>Status: {data.data.status}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ClaudeAI;