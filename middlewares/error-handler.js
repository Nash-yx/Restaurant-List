module.exports = (err, req, res, next) => {
  console.error('Error:', err);
  const error = typeof err === 'object' ? err : { message: err };
  req.flash('error', err.error_msg || '處理失敗:<');
  res.redirect('back');
};
