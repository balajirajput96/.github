const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello gamer!' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
