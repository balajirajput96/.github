import React, { useState } from 'react';
import { Typography, Button, Box, Paper } from '@mui/material';

const GitHub = () => {
  const [apiResponse, setApiResponse] = useState('');

  const handleFetch = async () => {
    try {
      const response = await fetch('/api/github');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setApiResponse(`Error fetching data: ${error.message}`);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        GitHub Integration
      </Typography>
      <Typography paragraph>
        Connect to your GitHub account to view your repositories.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleFetch}>
        Fetch Repositories
      </Button>
      <Box mt={3}>
        <Typography variant="h6">API Response:</Typography>
        <Paper elevation={3} sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5' }}>
          <pre>{apiResponse}</pre>
        </Paper>
      </Box>
    </div>
  );
};

export default GitHub;