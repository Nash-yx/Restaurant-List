const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');
const portNum = 3000;

const restaurants = require('./public/jsons/restaurant.json').results;

// 設定模板引擎
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// 設定靜態檔
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.redirect('/restaurant');
});

app.get('/restaurant', (req, res) => {
  res.render('index.hbs', { restaurants });
});

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  const restaurant = restaurants.find((item) => item.id.toString() === id);
  // const restaurant = restaurants.filter((item) => item.id.toString() === id)[0];
  res.render('detail.hbs', { restaurant });
});

app.listen(portNum, () => {
  console.log(`Server is running on http://localhost:${portNum}`);
});
