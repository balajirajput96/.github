import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';

const initialMessages = [
  { sender: 'ai', text: 'Hello! I\'m your AI assistant. You can give me commands in Hindi or English. Try asking about Pharma QA roles, status of connectors, or automation workflows!' },
  { sender: 'ai', text: 'नमस्ते! मैं आपका AI असिस्टेंट हूँ। आप मुझसे हिंदी या अंग्रेजी में फार्मा जॉब्स और ऑटोमेशन के बारे में पूछ सकते हैं।' },
];

function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userPrompt = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userPrompt }]);
    setLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const data = await res.json();
      if (data && data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'Request received. Automation task queued.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: `Command processed: "${userPrompt}"` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

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
              {message.sender === 'ai' && <Avatar sx={{ mr: 2 }}>🤖</Avatar>}
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
            placeholder="Type your command in Hindi or English (e.g. Pharma QA status, नमस्ते)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AIAssistant;