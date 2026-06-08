const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');
const UserModel = require('../models/UserModel');
const CharCheckerModel = require('../models/CharCheckerModel');

class DashboardController {
  index(req, res) {
    const productStats = ProductModel.getStats();
    const categories = CategoryModel.findAll();
    const users = UserModel.getAllSafe();
    const recentLogs = CharCheckerModel.getRecentLogs(5);
    const products = ProductModel.getAllWithDetails();

    // Math: compute category distribution (nested loop + math)
    const categoryDistribution = [];
    for (let i = 0; i < categories.length; i++) {
      let count = 0;
      for (let j = 0; j < products.length; j++) {
        if (products[j].category_id === categories[i].id) count++;
      }
      categoryDistribution.push({
        name: categories[i].name,
        count,
        percent: products.length > 0 ? Math.round((count / products.length) * 100) : 0
      });
    }

    res.render('dashboard/index', {
      title: 'Dashboard',
      user: req.session.user,
      productStats,
      categoryDistribution,
      userCount: users.length,
      recentLogs,
      success: req.flash('success'),
      error: req.flash('error')
    });
  }
}

module.exports = new DashboardController();
