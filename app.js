const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const portNum = 3000;

const db = require('./models');
const Restaurant = db.Restaurant;

const restaurants = require('./public/jsons/restaurant.json').results;

// 設定模板引擎
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
    },
  })
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// 設定靜態檔
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  return res.redirect('/restaurants');
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

app.get('/restaurant/new', (req, res) => {
  res.render('create');
});

app.post('/restaurants', async (req, res) => {
  const info = req.body;
  try {
    await Restaurant.create(info);
    return res.redirect('/restaurants');
  } catch (err) {
    console.log(err);
  }
});

app.get('/restaurant/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const restaurant = await Restaurant.findByPk(id, {
      raw: true,
    });
    return res.render('detail', { restaurant });
  } catch (err) {
    console.log(err);
  }
});

app.get('/restaurant/:id/edit', async (req, res) => {
  const id = req.params.id;
  try {
    const restaurant = await Restaurant.findByPk(id, {
      raw: true,
    });
    return res.render('edit', { restaurant });
  } catch (err) {
    console.log(err);
  }
});

app.put('/restaurant/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body;
  try {
    await Restaurant.update(
      {
        name: body.name,
        name_en: body.name_en,
        category: body.category,
        image: body.image,
        location: body.location,
        phone: body.phone,
        google_map: body.google_map,
        rating: body.rating,
        description: body.description,
      },
      { where: { id } }
    );
    return res.redirect(`/restaurant/${id}`);
  } catch (err) {
    console.log(err);
  }
});

app.delete('/restaurant/:id', async(req,res) =>{
  const id = req.params.id
  try{
    await Restaurant.destroy({ where : { id }})
    return res.redirect('/restaurants')
  } catch(err){
    console.log(err);
  }
})

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
