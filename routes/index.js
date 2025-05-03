const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const db = require('../models');
const User = db.User;

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try {
        const user = await User.findOne({
          attributes: ['id', 'name', 'email', 'password'],
          where: { email: username },
          raw: true,
        });
        console.log(user)
        if (!user) {
          return done(null, false, { message: 'email或密碼錯誤' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'email或密碼錯誤' });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

const restaurantsRouter = require('./restaurants');
const usersRouter = require('./users');
const authHandler = require('../middlewares/auth-handler');

router.use('/restaurants', authHandler, restaurantsRouter);
router.use('/users', usersRouter);

router.get('/', (req, res) => {
  return res.redirect('/restaurants');
});

router.get('/register', (req, res) => {
  return res.render('register');
});

router.get('/login', (req, res) => {
  return res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/restaurants',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error);
    }
    return res.redirect('/login');
  });
});

module.exports = router;
