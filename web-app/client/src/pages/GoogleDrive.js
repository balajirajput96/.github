import React from 'react';
import { Typography } from '@mui/material';

/**
 * @description The GoogleDrive page component. This page displays content related to Google Drive integration.
 * @returns {JSX.Element} The rendered GoogleDrive page.
 */
const GoogleDrive = () => {
  return (
    <div>
      <Typography variant="h4">Google Drive Integration</Typography>
      <Typography paragraph>
        Connect to your Google Drive account.
      </Typography>
    </div>
  );
};

export default GoogleDrive;