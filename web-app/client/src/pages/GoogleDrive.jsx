import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Paper, List, ListItem, ListItemText, Divider, Alert, CircularProgress, Chip } from '@mui/material';

const GoogleDrive = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/google-drive');
      if (!response.ok) throw new Error('Failed to fetch from Google Drive');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handleFetch(); }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Google Drive Integration</Typography>
      <Typography paragraph>Access and sync your Pharma QA/IPQA reports and resumes to Drive.</Typography>
      <Button variant="contained" onClick={handleFetch} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Sync Files'}
      </Button>
      <Box mt={3}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper elevation={3}>
          <List>
            {files.length > 0 ? (
              files.map((file, i) => (
                <React.Fragment key={i}>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemText primary={file.name} secondary={file.mimeType} />
                    <Chip label="Synced" size="small" color="success" />
                  </ListItem>
                  {i < files.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <ListItem><ListItemText primary={loading ? 'Loading...' : 'No files found or integration not configured.'} /></ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};
export default GoogleDrive;
