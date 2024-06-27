const express = require('express');
const app = express();
const portNum = 3000;

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(portNum, () => {
  console.log(`Server is running on http://localhost:${portNum}`);
});
