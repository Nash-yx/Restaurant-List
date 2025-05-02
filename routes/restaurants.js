const express = require('express');
const router = express.Router();

const db = require('../models');
const Restaurant = db.Restaurant;
const { Op } = require('sequelize');

router.get('/', async (req, res, next) => {
  try {
    console.log('sessoin: ',req.session)
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const { count, rows } = await Restaurant.findAndCountAll({
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

router.get('/search', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const search = req.query.keyword ? req.query.keyword.trim() : '';
    const sort = req.query.sort || 'none';

    if (search) {
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
        where: { [Op.or]: searchConditions },
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
        sort
      });
    } else {
      // 如果沒有搜索關鍵字，獲取所有餐廳
      return res.redirect('/restaurants');
    }
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
