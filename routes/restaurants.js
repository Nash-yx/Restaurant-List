const express = require('express');
const router = express.Router();

const db = require('../models');
const Restaurant = db.Restaurant;
const { Op } = require('sequelize');

router.get('/', async (req, res, next) => {
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
    err.error_msg = `資料取得失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const search = req.query.keyword ? req.query.keyword.trim() : '';
    let matchedRestaurant = [];
    
    if (search) {
      const escapedSearch = (str) => str.replace(/[%_]/g, (match) => `\\${match}`);
      const safeSearch = escapedSearch(search)
      const searchConditions = [
        { name: { [Op.like]: `%${safeSearch}%` } },
        { category: { [Op.like]: `%${safeSearch}%` } },
        { location: { [Op.like]: `%${safeSearch}%` } },
      ];

      const ratingValue = parseFloat(search);
      const isRatingValid = !isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5;
      if (isRatingValid) {
        searchConditions.push({ rating: { [Op.gte]: ratingValue } });
      }

      matchedRestaurant = await Restaurant.findAll({
        where: { [Op.or]: searchConditions },
        raw: true,
      });
    } else {
      // 如果沒有搜索關鍵字，獲取所有餐廳
      matchedRestaurant = await Restaurant.findAll({ raw: true });
    }
    return res.render('index.hbs', {
      restaurants: matchedRestaurant,
      search: search,
    });
  } catch (err) {
    err.error_msg = `搜尋過程失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

router.get('/new', (req, res) => {
  res.render('create');
});

router.post('/', async (req, res, next) => {
  const info = req.body;
  try {
    await Restaurant.create(info);
    req.flash('success', '新增成功');
    return res.redirect('/restaurants');
  } catch (err) {
    err.error_msg = `資料新增失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const restaurant = await Restaurant.findByPk(id, {
      raw: true,
    });
    return res.render('detail', { restaurant });
  } catch (err) {
    err.error_msg = `資料取得失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

router.get('/:id/edit', async (req, res, next) => {
  const id = req.params.id;
  try {
    const restaurant = await Restaurant.findByPk(id, {
      raw: true,
    });
    return res.render('edit', { restaurant });
  } catch (err) {
    err.error_msg = `資料取得失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
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
    req.flash('success', '更新成功');
    return res.redirect(`/restaurants/${id}`);
  } catch (err) {
    err.error_msg = `資料更新失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    await Restaurant.destroy({ where: { id } });
    req.flash('delete', '刪除成功！');
    return res.redirect('/restaurants');
  } catch (err) {
    err.error_msg = `資料刪除失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

module.exports = router;
