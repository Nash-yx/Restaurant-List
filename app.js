const express = require('express');
const app = express();
const portNum = 3000;

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const router = require('./routes');
const session = require('express-session')
const flash = require('connect-flash');
const messageHandler = require('./middlewares/message-handler');
const errorHandler = require('./middlewares/error-handler');
const passport = require('./config/passport')



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
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler);
app.use(router)
app.use(errorHandler)


app.listen(portNum, () => {
  console.log(`Server is running on http://localhost:${portNum}`);
});
