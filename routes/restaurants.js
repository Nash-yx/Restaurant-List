const express = require('express');
const router = express.Router();

const db = require('../models');
const Restaurant = db.Restaurant;
const { Op } = require('sequelize');

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.keyword ? req.query.keyword.trim() : '';
    const sort = req.query.sort || 'none';
    const limit = 6;
    
    if (search || sort) {
      const escapedSearch = (str) =>
        str.replace(/[%_]/g, (match) => `\\${match}`);
      const safeSearch = escapedSearch(search);
      let searchConditions = [
        { name: { [Op.like]: `%${safeSearch}%` } },
        { category: { [Op.like]: `%${safeSearch}%` } },
        { location: { [Op.like]: `%${safeSearch}%` } },
      ];

      const ratingValue = parseFloat(search);
      const isRatingValid =
        !isNaN(ratingValue) && ratingValue >= 0 && ratingValue <= 5;
      if (isRatingValid) {
        searchConditions.push({ rating: { [Op.gte]: ratingValue } });
      }
      let order = [];
      switch (sort) {
        case 'ASC':
          order = [['name', 'ASC']];
          break;
        case 'DESC':
          order = [['name', 'DESC']];
          break;
        case 'category':
          order = [['category', 'ASC']];
          break;
        case 'location':
          order = [['location', 'ASC']];
          break;
        case 'rating_DESC':
          order = [['rating', 'DESC']];
          break;
        case 'rating_ASC':
          order = [['rating', 'ASC']];
          break;
        default:
          order = []; // 不排序
      }
      const { count, rows } = await Restaurant.findAndCountAll({
        where: { userId, [Op.or]: searchConditions },
        order,
        offset: (page - 1) * limit,
        limit,
        raw: true,
      });
      const totalPages = Math.ceil(count / limit);
      const isFirstPage = page === 1;
      const isLastPage = page === totalPages;
      return res.render('index', {
        restaurants: rows,
        prev: page > 1 ? page - 1 : page,
        next: page + 1,
        currentPage: page,
        totalPages,
        isFirstPage,
        isLastPage,
        search,
        sort,
      });
    }
    const { count, rows } = await Restaurant.findAndCountAll({
      where: { userId },
      offset: (page - 1) * limit,
      limit,
      raw: true,
    });
    const totalPages = Math.ceil(count / limit);
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;
    return res.render('index', {
      restaurants: rows,
      prev: page > 1 ? page - 1 : page,
      next: page + 1,
      currentPage: page,
      totalPages,
      isFirstPage,
      isLastPage,
    });
  } catch (err) {
    err.error_msg = `資料取得失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});


router.get('/new', (req, res) => {
  res.render('create');
});

router.post('/', async (req, res, next) => {
  const info = req.body;
  const userId = req.user.id;
  info.userId = userId;
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
  const userId = req.user.id;
  try {
    const restaurant = await Restaurant.findByPk(id, {
      raw: true,
    });
    if(!restaurant){
      req.flash('error','找不到資料')
      return res.redirect('/restaurants')
    }
    if(restaurant.userId !== userId){
      req.flash('error', '權限不足')
      return res.redirect('/restaurants')
    }
    return res.render('detail', { restaurant });
  } catch (err) {
    err.error_msg = `資料取得失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

router.get('/:id/edit', async (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;

  try {
    const restaurant = await Restaurant.findByPk(id, {
      raw: true,
    });
    if (!restaurant) {
      req.flash('error', '找不到資料');
      return res.redirect('/restaurants');
    }
    if (restaurant.userId !== userId) {
      req.flash('error', '權限不足');
      return res.redirect('/restaurants');
    }
    return res.render('edit', { restaurant });
  } catch (err) {
    err.error_msg = `資料取得失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const userId = req.user.id;
  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      req.flash('error', '找不到資料');
      return res.redirect('/restaurants');
    }
    if (restaurant.userId !== userId) {
      req.flash('error', '權限不足');
      return res.redirect('/restaurants');
    }
    await restaurant.update(
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
      }
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
  const userId = req.user.id;

  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      req.flash('error', '找不到資料');
      return res.redirect('/restaurants');
    }
    if (restaurant.userId !== userId) {
      req.flash('error', '權限不足');
      return res.redirect('/restaurants');
    }
    await restaurant.destroy({ where: { id } });
    req.flash('delete', '刪除成功！');
    return res.redirect('/restaurants');
  } catch (err) {
    err.error_msg = `資料刪除失敗: ${err.message || '未知錯誤'}`;
    next(err);
  }
});

module.exports = router;
