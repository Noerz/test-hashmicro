const CharCheckerModel = require('../models/CharCheckerModel');

class CharCheckerController {
  // GET /char-checker
  index(req, res) {
    const logs = CharCheckerModel.getRecentLogs(10);
    res.render('char-checker/index', {
      title: 'Character Checker',
      user: req.session.user,
      result: null,
      logs,
      input1: '',
      input2: '',
      type: 'sensitive',
      success: req.flash('success'),
      error: req.flash('error')
    });
  }

  // POST /char-checker
  check(req, res) {
    const { input1, input2, type } = req.body;

    if (!input1 || !input2) {
      req.flash('error', 'Kedua input wajib diisi.');
      return res.redirect('/char-checker');
    }

    const result = CharCheckerModel.check(input1, input2, type || 'sensitive');
    const logs = CharCheckerModel.getRecentLogs(10);

    res.render('char-checker/index', {
      title: 'Character Checker',
      user: req.session.user,
      result,
      logs,
      input1,
      input2,
      type: type || 'sensitive',
      success: null,
      error: null
    });
  }
}

module.exports = new CharCheckerController();
