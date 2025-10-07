import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Analytics() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics & Reports
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Track performance across all your integrations
      </Typography>
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Automation Performance
        </Typography>
        <Typography>
          Connect integrations to view analytics. Full analytics dashboard coming soon!
        </Typography>
      </Paper>
    </Box>
  );
}

export default Analytics;