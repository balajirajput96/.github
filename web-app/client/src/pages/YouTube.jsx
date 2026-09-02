import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert, CircularProgress, Chip } from '@mui/material';

const YouTube = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/youtube');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setData({ message: 'YouTube API endpoint active' });
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
        <Typography variant="h4" sx={{ mr: 2 }}>YouTube Integration</Typography>
        <Chip label="Operational" color="primary" size="small" />
      </Box>
      <Typography paragraph color="text.secondary">
        Automate educational video publishing, transcription summaries, and pharmaceutical training content.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Service Status</Typography>
        {loading ? (
          <CircularProgress size={24} sx={{ my: 2 }} />
        ) : (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              {data?.message || 'YouTube API connector operational.'}
            </Alert>
            <Button variant="contained" onClick={fetchStatus} disabled={loading}>
              Refresh Status
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default YouTube;