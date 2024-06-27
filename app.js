const express = require('express');
const app = express();
const path = require('path');
const portNum = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/restaurant');
});

app.get('/restaurant', (req, res) => {
  res.send('listing menu');
});

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id;
  res.send(`read restaurant: ${id}`);
});

app.listen(portNum, () => {
  console.log(`Server is running on http://localhost:${portNum}`);
});
