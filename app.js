const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const router = require('./routes');
const session = require('express-session')
const flash = require('connect-flash');
const messageHandler = require('./middlewares/message-handler');
const portNum = 3000;

// const restaurants = require('./public/jsons/restaurant.json').results;

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
app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(messageHandler);
app.use(router)

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
