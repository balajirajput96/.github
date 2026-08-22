import React, { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import useFetch from '../hooks/useFetch';

/**
 * @description The Slack page component. This page displays content related to Slack integration.
 * @returns {JSX.Element} The rendered Slack page.
 */
const Slack = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, loading, error } = useFetch(shouldFetch ? '/api/slack' : null);

  const handleFetchData = () => {
    setShouldFetch(true);
  };

  const rawChannels = data?.channels ?? data?.data?.channels ?? [];
  const channels = rawChannels.map((channel, index) => (
    typeof channel === 'string'
      ? { id: `${channel}-${index}`, name: channel, purpose: '' }
      : channel
  ));
  const errorMessage = error?.message ?? error;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Slack Integration
      </Typography>
      <Typography paragraph>
        Integrate with your Slack workspace to receive notifications, send messages, and automate communication tasks.
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6">Connect to Slack</Typography>
        <Typography paragraph>
          Click the button below to fetch data from the Slack API. This is a sample interaction to demonstrate connectivity.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchData}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Slack Data'}
        </Button>

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error: {errorMessage}
          </Alert>
        )}

        {data && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">API Response:</Typography>
            {data.message && <Typography>Message: {data.message}</Typography>}
            {data.data?.workspace && <Typography>Workspace: {data.data.workspace}</Typography>}
            <Typography>Channels:</Typography>
            <List>
              {channels.length > 0 ? channels.map((channel, index) => (
                <React.Fragment key={channel.id ?? `${channel.name}-${index}`}>
                  <ListItem>
                    <ListItemText
                      primary={channel.name ? `#${channel.name}` : `Channel ${index + 1}`}
                      secondary={channel.purpose || 'No purpose set'}
                    />
                  </ListItem>
                  {index < channels.length - 1 && <Divider />}
                </React.Fragment>
              )) : (
                <ListItem>
                  <ListItemText primary="No channels found." />
                </ListItem>
              )}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Slack;
