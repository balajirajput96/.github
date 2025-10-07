import React from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function ContentHub() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Content Management Hub
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Manage content across all your platforms
      </Typography>
      <Paper sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="content hub tabs">
            <Tab label="YouTube" />
            <Tab label="Social Media" />
            <Tab label="Files" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          Connect YouTube integration to manage your videos.
        </TabPanel>
        <TabPanel value={value} index={1}>
          Social media management coming soon.
        </TabPanel>
        <TabPanel value={value} index={2}>
          Connect Google Drive to manage your files.
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default ContentHub;