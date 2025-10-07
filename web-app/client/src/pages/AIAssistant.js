import React from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { SmartToy } from '@mui/icons-material';

const messages = [
  { sender: 'ai', text: 'Hello! I\'m your AI assistant. You can give me commands in Hindi or English. Try asking me to create a JIRA ticket or send a Slack message!' },
  { sender: 'ai', text: 'नमस्ते! मैं आपका AI असिस्टेंट हूँ। आप मुझे हिंदी या अंग्रेजी में कमांड दे सकते हैं।' },
];

function AIAssistant() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Assistant
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Natural language commands in Hindi and English
      </Typography>
      <Paper sx={{ mt: 3, p: 2, height: '60vh', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {message.sender === 'ai' && <Avatar sx={{ mr: 2 }}><SmartToy /></Avatar>}
              <ListItemText
                primary={message.text}
                sx={{
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.300',
                  color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                  p: 1,
                  borderRadius: 2,
                  maxWidth: '70%',
                }}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your command..."
          />
          <Button variant="contained" sx={{ ml: 2 }}>
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AIAssistant;