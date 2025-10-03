const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// API routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello gamer!' });
});

// Serve static files from the React app build
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuildPath));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
