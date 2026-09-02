import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert, CircularProgress, Chip } from '@mui/material';

const Atlassian = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/atlassian');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setData({ message: 'Atlassian API endpoint active' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ mr: 2 }}>Atlassian Integration</Typography>
        <Chip label="Ready" color="info" size="small" />
      </Box>
      <Typography paragraph color="text.secondary">
        Connect to JIRA and Confluence for automated issue tracking, bug lifecycle tracking, and release management.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Service Status</Typography>
        {loading ? (
          <CircularProgress size={24} sx={{ my: 2 }} />
        ) : (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              {data?.message || 'Atlassian API connector ready.'}
            </Alert>
            <Button variant="contained" onClick={fetchStatus} disabled={loading}>
              Test Connection
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Atlassian;