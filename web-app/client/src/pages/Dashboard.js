import React from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';

const summaryData = [
  { title: 'Total Automations', value: '12' },
  { title: 'Active Workflows', value: '5' },
  { title: 'Messages Sent', value: '1,234' },
  { title: 'Time Saved', value: '42 hours' },
];

const recentActivity = [
  { event: 'New workflow "Social Media Poster" created', timestamp: '2 hours ago' },
  { event: 'Slack integration connected successfully', timestamp: '1 day ago' },
  { event: 'JIRA ticket created: "PROJ-123"', timestamp: '2 days ago' },
];

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Monitor your automation hub and quick actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {item.value}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Button variant="contained" sx={{ mr: 2 }}>Create Workflow</Button>
        <Button variant="contained" sx={{ mr: 2 }}>Add Integration</Button>
        <Button variant="contained">Ask AI</Button>
      </Box>
      <Box>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Paper>
          <List>
            {recentActivity.map((activity, index) => (
              <ListItem key={index}>
                <ListItemText primary={activity.event} secondary={activity.timestamp} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;