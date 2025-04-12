const express = require('express')
const router = express.Router()

const db = require('../models');
const Restaurant = db.Restaurant;

router.get('/', async (req, res) => {
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

router.get('/new', (req, res) => {
  res.render('create');
});

router.post('/', async (req, res) => {
  const info = req.body;
  try {
    await Restaurant.create(info);
    req.flash('success','新增成功')
    return res.redirect('/restaurants');
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
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

router.get('/:id/edit', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  const id = req.params.id;
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
    req.flash('success','更新成功')
    return res.redirect(`/restaurants/${id}`);
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Restaurant.destroy({ where: { id } });
    req.flash('delete', '刪除成功！');
    return res.redirect('/restaurants');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;