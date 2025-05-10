const express = require('express');
const router = express.Router();

const restaurantsRouter = require('./restaurants');
const usersRouter = require('./users');
const authHandler = require('../middlewares/auth-handler');
const passport = require('passport')

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

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
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
