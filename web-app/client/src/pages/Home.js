import React from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';

/**
 * @description The Home page component. This is the main dashboard page of the application.
 * @returns {JSX.Element} The rendered Home page.
 */
const Home = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        AI Automation Hub Dashboard
      </Typography>
      <Typography paragraph>
        Welcome to your central hub for managing AI-powered automations and integrations.
        This dashboard provides a unified interface to connect with various services and streamline your workflows.
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Getting Started</Typography>
            <Typography>
              Navigate to the different sections using the sidebar to connect and configure your integrations.
              Each section provides tools and information for the respective service.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Key Features</Typography>
            <ul>
              <li><Typography>Centralized management of integrations.</Typography></li>
              <li><Typography>Real-time status updates and notifications.</Typography></li>
              <li><Typography>Scalable architecture for adding new services.</Typography></li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;