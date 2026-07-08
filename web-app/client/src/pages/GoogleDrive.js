import React, { useState } from 'react';
import { Typography, Button, Paper, Box, CircularProgress, Alert } from '@mui/material';
import useFetch from '../hooks/useFetch';

/**
 * @description The GoogleDrive page component. This page displays content related to Google Drive integration.
 * @returns {JSX.Element} The rendered GoogleDrive page.
 */
const GoogleDrive = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, loading, error } = useFetch(shouldFetch ? '/api/google-drive' : null);

  const handleFetchData = () => {
    setShouldFetch(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Google Drive Integration
      </Typography>
      <Typography paragraph>
        Access and manage your files in Google Drive. Automate file uploads, downloads, and organization.
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Connect to Google Drive</Typography>
        <Typography paragraph>
          Click the button below to fetch data from the Google Drive API. This is a sample interaction to demonstrate connectivity.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleFetchData} disabled={loading || shouldFetch}>
          {loading ? <CircularProgress size={24} /> : 'Fetch Google Drive Data'}
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
            <Typography>User: {data.data.user}</Typography>
            <Typography>Files: {data.data.files}</Typography>
            <Typography>Storage Used: {data.data.storageUsed}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GoogleDrive;