const express = require('express')
const router = express.Router()

const restaurantsRouter = require('./restaurants');

router.use('/restaurants', restaurantsRouter);

router.get('/', (req, res) => {
  return res.redirect('/restaurants');
});

module.exports = router;