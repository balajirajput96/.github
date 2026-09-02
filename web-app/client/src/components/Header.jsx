import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

/**
 * @description The Header component displays the main application header.
 * It contains the title of the application.
 * @returns {JSX.Element} The rendered header component.
 */
const Header = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap>
          AI Automation Hub
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;