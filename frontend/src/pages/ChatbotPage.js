import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { askChatbot, getChatHistory } from '../services/api';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

function ChatbotPage() {
  const { jobId } = useParams();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await askChatbot(question, jobId);
      setMessages(prev => [...prev, { role: 'bot', content: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>Chatbot - Job #{jobId}</Typography>

      <Paper sx={{ flex: 1, overflow: 'auto', p: 2, mb: 2 }}>
        <List>
          {messages.map((msg, idx) => (
            <ListItem key={idx} sx={{ flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  {msg.role === 'user' ? 'U' : 'B'}
                </Box>
                <Paper sx={{ p: 2, bgcolor: msg.role === 'user' ? 'primary.light' : 'grey.100', maxWidth: '80%' }}>
                  <ListItemText primary={msg.content} />
                </Paper>
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          placeholder="Ask about your prediction results..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          disabled={loading}
        />
        <Button variant="contained" onClick={handleAsk} disabled={loading || !question.trim()}>
          Send
        </Button>
      </Box>

      <Box mt={2}>
        <Typography variant="caption" color="textSecondary">
          Try: "Which users should I target?" or "Why are some users high intent?"
        </Typography>
      </Box>
    </Box>
  );
}

export default ChatbotPage;
