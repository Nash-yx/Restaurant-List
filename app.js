const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');
const portNum = 3000;

const db = require('./models');
const Restaurant = db.Restaurant;

const restaurants = require('./public/jsons/restaurant.json').results;

// 設定模板引擎
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// 設定靜態檔
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  return Restaurant.findAll().then((info) => res.send({ info }));
});

app.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      attributes: [
        'id',
        'name',
        'name_en',
        'category',
        'image',
        'location',
        'phone',
        'google_map',
        'rating',
        'description',
      ],
      raw: true,
    });
    return res.render('index', { restaurants });
  } catch (err) {
    console.log(err);
  }
});

app.get('/restaurant/:id/edit', (req, res) => {
  const id = req.params.id;
  res.send(`restaurant ${id} edited`);
});

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id;
  const restaurant = restaurants.find((item) => item.id.toString() === id);
  // const restaurant = restaurants.filter((item) => item.id.toString() === id)[0];
  res.render('detail.hbs', { restaurant: restaurant });
});

app.get('/search', (req, res) => {
  const search = req.query.keyword.trim();
  const matchedRestaurant = search
    ? restaurants.filter((item) =>
        Object.values(item).some((value) => {
          if (value) {
            return value
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase());
          }
          return false;
        })
      )
    : restaurants;
  console.log(matchedRestaurant);
  res.render('index.hbs', { restaurants: matchedRestaurant, search: search });
});

app.listen(portNum, () => {
  console.log(`Server is running on http://localhost:${portNum}`);
});
