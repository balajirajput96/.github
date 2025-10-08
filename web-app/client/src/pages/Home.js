import React from 'react';
import { Typography } from '@mui/material';

/**
 * @description The Home page component. This is the main dashboard page of the application.
 * @returns {JSX.Element} The rendered Home page.
 */
const Home = () => {
  return (
    <div>
      <Typography variant="h4">Dashboard</Typography>
      <Typography paragraph>
        Welcome to your AI Automation Hub.
      </Typography>
    </div>
  );
};

export default Home;