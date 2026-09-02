import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Avatar } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const initialMessages = [
  { sender: 'ai', text: 'Hello! I\'m your AI assistant. You can give me commands in Hindi or English. Try asking about Pharma QA roles, status of connectors, or automation workflows!' },
  { sender: 'ai', text: 'नमस्ते! मैं आपका AI असिस्टेंट हूँ। आप मुझसे हिंदी या अंग्रेजी में फार्मा जॉब्स और ऑटोमेशन के बारे में पूछ सकते हैं।' },
];

function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  const handleRunJobs = async () => {
    setMessages((prev) => [...prev, { sender: 'user', text: 'Run Pharma Job Automation' }, { sender: 'ai', text: 'Running the automation script in the background...', isStreaming: true }]);
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/jobs/run', {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      const data = await res.json();
      setMessages((prev) => {
        const newMessages = [...prev];
        const last = newMessages[newMessages.length - 1];
        last.text = `**Job Automation Completed!**

\`\`\`text
${data.output || data.error}
\`\`\``;
        last.isStreaming = false;
        return newMessages;
      });
    } catch (err) {
      setMessages((prev) => {
        const newMessages = [...prev];
        const last = newMessages[newMessages.length - 1];
        last.text = `**Error**: ${err.message}`;
        last.isStreaming = false;
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userPrompt = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userPrompt }, { sender: 'ai', text: '', isStreaming: true }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ prompt: userPrompt, history: messages }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to connect');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep the incomplete line in the buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'FINAL_RESPONSE' && data.content) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const last = newMessages[newMessages.length - 1];
                  last.text += data.content;
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing SSE', e);
            }
          }
        }
      }
      
      setMessages((prev) => {
        const newMessages = [...prev];
        const last = newMessages[newMessages.length - 1];
        last.isStreaming = false;
        return newMessages;
      });

    } catch (err) {
      setMessages((prev) => {
        const newMessages = [...prev];
        const last = newMessages[newMessages.length - 1];
        last.text = `**Error**: ${err.message}`;
        last.isStreaming = false;
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        AI Assistant
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Natural language commands in Hindi and English (Markdown Supported)
      </Typography>
      <Paper sx={{ mt: 3, p: 2, height: '65vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
          {messages.map((message, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
              {message.sender === 'ai' && <Avatar sx={{ mr: 2, bgcolor: message.isStreaming ? 'secondary.main' : 'primary.main' }}>🤖</Avatar>}
              <Box
                sx={{
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                  color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                  p: 2,
                  borderRadius: 2,
                  maxWidth: '80%',
                  '& p': { m: 0, mb: 1 },
                  '& p:last-child': { mb: 0 },
                  '& pre': { bgcolor: 'grey.900', color: 'grey.100', p: 1, borderRadius: 1, overflowX: 'auto' },
                  '& code': { bgcolor: 'grey.300', color: 'error.main', p: 0.5, borderRadius: 1, fontSize: '0.85em' },
                }}
              >
                {message.sender === 'user' ? (
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message.text}</Typography>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                )}
                {message.isStreaming && <span style={{ marginLeft: 4, animation: 'blink 1s step-end infinite' }}>▌</span>}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        
        <Box sx={{ display: 'flex', mt: 2, alignItems: 'flex-end' }}>
          <Button variant="outlined" sx={{ mr: 2, height: '56px', whiteSpace: 'nowrap' }} onClick={handleRunJobs} disabled={loading}>
            Run Job Scan
          </Button>

          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            variant="outlined"
            placeholder="Type your command (Shift+Enter for new line)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button variant="contained" sx={{ ml: 2, height: '56px' }} onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? 'Thinking' : 'Send'}
          </Button>
        </Box>
      </Paper>
      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </Box>
  );
}

export default AIAssistant;
