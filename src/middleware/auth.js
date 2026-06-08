const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Silakan login terlebih dahulu.');
    return res.redirect('/login');
  }
  next();
};

const guestMiddleware = (req, res, next) => {
  if (req.session.user) return res.redirect('/dashboard');
  next();
};

module.exports = { authMiddleware, guestMiddleware };
