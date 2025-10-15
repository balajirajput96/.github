import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';

const Slack = () => {
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setError(null);
    try {
      const response = await fetch('/api/slack');
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChannels(data.channels || []);
    } catch (error) {
      setError(error.message);
      setChannels([]);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Slack Integration
      </Typography>
      <Typography paragraph>
        A list of public channels in your Slack workspace.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleFetch}>
        Refresh Channels
      </Button>
      <Box mt={3}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper elevation={3}>
          <List>
            {channels.length > 0 ? (
              channels.map((channel, index) => (
                <React.Fragment key={channel.id}>
                  <ListItem>
                    <ListItemText
                      primary={`#${channel.name}`}
                      secondary={channel.purpose || 'No purpose set'}
                    />
                  </ListItem>
                  {index < channels.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No channels found or failed to fetch." />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default Slack;