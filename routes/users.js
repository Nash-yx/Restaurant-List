const express = require('express');
const router = express.Router();

const db = require('../models');
const User = db.User;

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!email || !password) {
      req.flash('error', 'email及密碼為必填');
      return res.redirect('back');
    }
    if (password !== confirmPassword) {
      req.flash('error', '驗證密碼與密碼不符');
      return res.redirect('back');
    }
    const user = await User.findOne({
      where: { email },
      raw: true,
    });
    if (user) {
      req.flash('error', 'email 已註冊');
      return res.redirect('back');
    }
    await User.create({ name, email, password });
    req.flash('success', '註冊成功');
    return res.redirect('login');
  } catch (error) {
    error.err_msg = '註冊失敗';
    next(err);
  }
});

module.exports = router;
