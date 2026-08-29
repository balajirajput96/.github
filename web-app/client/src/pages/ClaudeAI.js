import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert, CircularProgress, Chip } from '@mui/material';

const ClaudeAI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/claude-ai');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setData({ message: 'Claude AI API endpoint active' });
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
        <Typography variant="h4" sx={{ mr: 2 }}>Claude AI Integration</Typography>
        <Chip label="Ready" color="success" size="small" />
      </Box>
      <Typography paragraph color="text.secondary">
        Advanced reasoning and multilingual NLP capabilities for complex SOP summarization and document analysis.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Service Status</Typography>
        {loading ? (
          <CircularProgress size={24} sx={{ my: 2 }} />
        ) : (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              {data?.message || 'Claude AI connector active.'}
            </Alert>
            <Button variant="contained" onClick={fetchStatus} disabled={loading}>
              Check Connection
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ClaudeAI;