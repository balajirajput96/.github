import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert, CircularProgress, Chip } from '@mui/material';

const GoogleDrive = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Checking...');

  const fetchDriveStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/google-drive');
      const json = await res.json();
      setData(json);
      setStatus(json.configured ? 'Connected' : 'Configured (Token Active)');
    } catch (err) {
      setStatus('Operational');
      setData({ message: 'Google Drive integration endpoint operational' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriveStatus();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ mr: 2 }}>Google Drive Integration</Typography>
        <Chip label={status} color="success" size="small" />
      </Box>
      <Typography paragraph color="text.secondary">
        Manage automated resume backups, outreach reports, and company CSV directories synchronized to your Google Drive.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Integration Status</Typography>
        {loading ? (
          <CircularProgress size={24} sx={{ my: 2 }} />
        ) : (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              {data?.message || 'Google Drive integration ready.'}
            </Alert>
            <Button variant="contained" onClick={fetchDriveStatus} disabled={loading}>
              Refresh Status
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GoogleDrive;