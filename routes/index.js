const express = require('express')
const router = express.Router()

const restaurantsRouter = require('./restaurants');

router.use('/restaurants', restaurantsRouter);

router.get('/', (req, res) => {
  return res.redirect('/restaurants');
});

router.get('/login',(req,res)=>{
  return res.render('login')
})

router.get('/register', (req, res) => {
  return res.render('register');
});

module.exports = router;