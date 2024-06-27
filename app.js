const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');
const portNum = 3000;

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'view'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/restaurant');
});

app.get('/restaurant', (req, res) => {
  res.render('index.hbs');
});

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id;
  res.send(`read restaurant: ${id}`);
});

app.listen(portNum, () => {
  console.log(`Server is running on http://localhost:${portNum}`);
});
