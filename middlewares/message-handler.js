module.exports = (req,res,next) => {
  res.locals.success_msg = req.flash('success')
  res.locals.delete_msg = req.flash('delete')
  next()
}