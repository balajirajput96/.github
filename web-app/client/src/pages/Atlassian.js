import React from 'react';
import { Typography } from '@mui/material';

/**
 * @description The Atlassian page component. This page displays content related to Atlassian integration.
 * @returns {JSX.Element} The rendered Atlassian page.
 */
const Atlassian = () => {
  return (
    <div>
      <Typography variant="h4">Atlassian Integration</Typography>
      <Typography paragraph>
        Connect to your Atlassian products.
      </Typography>
    </div>
  );
};

export default Atlassian;