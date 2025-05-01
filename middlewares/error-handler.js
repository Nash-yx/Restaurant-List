module.exports = (err, req, res, next) => {
  console.error('Error:', err);
  req.flash('error', err.error_msg || '處理失敗:<');
  res.redirect('back');
};
