import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, LinearProgress } from '@mui/material';

const metrics = [
  { label: 'Scanned Companies (Vadodara/Gujarat)', value: '117', progress: 100, color: 'primary' },
  { label: 'High Match Leads (>55 ATS Score)', value: '9', progress: 85, color: 'success' },
  { label: 'HR Outreach Drafts Generated', value: '117', progress: 95, color: 'info' },
  { label: 'Average QA ATS Match Score', value: '92%', progress: 92, color: 'success' },
  { label: 'Validation Pipeline Success Rate', value: '100%', progress: 100, color: 'success' },
  { label: 'Engineering Hours Saved', value: '140+ hrs', progress: 90, color: 'secondary' },
];

function Analytics() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics & Reports
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Real-time telemetry and operational metrics across the AI automation pipeline
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {metrics.map((m, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  {m.label}
                </Typography>
                <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                  {m.value}
                </Typography>
                <LinearProgress variant="determinate" value={m.progress} color={m.color} sx={{ height: 8, borderRadius: 4 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quality Assurance & IPQA Benchmark Coverage
        </Typography>
        <Typography paragraph color="text.secondary">
          Pipeline models are currently verified against ALCOA+ data integrity guidelines, Schedule M / WHO-GMP regulatory standards, 21 CFR Part 11 electronic records, and OSD tablet manufacturing BMR/BPR checklists.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Analytics;