const UserModel = require('../models/UserModel');

class AuthController {
  // GET /login
  showLogin(req, res) {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('auth/login', {
      title: 'Login',
      error: req.flash('error'),
      success: req.flash('success')
    });
  }

  // POST /login
  login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      req.flash('error', 'Username dan password wajib diisi.');
      return res.redirect('/login');
    }

    const user = UserModel.authenticate(username, password);
    if (!user) {
      req.flash('error', 'Username atau password salah.');
      return res.redirect('/login');
    }

    req.session.user = { id: user.id, name: user.name, username: user.username, role: user.role };
    req.flash('success', `Selamat datang, ${user.name}!`);
    res.redirect('/dashboard');
  }

  // POST /logout
  logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }
}

module.exports = new AuthController();
