const CategoryModel = require('../models/CategoryModel');

class CategoryController {
  index(req, res) {
    const categories = CategoryModel.getAllWithProductCount();
    res.render('categories/index', {
      title: 'Manajemen Kategori',
      user: req.session.user,
      categories,
      success: req.flash('success'),
      error: req.flash('error')
    });
  }

  create(req, res) {
    res.render('categories/create', {
      title: 'Tambah Kategori',
      user: req.session.user,
      error: req.flash('error')
    });
  }

  store(req, res) {
    const { name, description } = req.body;
    if (!name || name.trim() === '') {
      req.flash('error', 'Nama kategori wajib diisi.');
      return res.redirect('/categories/create');
    }
    CategoryModel.create({ name: name.trim(), description: description || '' });
    req.flash('success', 'Kategori berhasil ditambahkan.');
    res.redirect('/categories');
  }

  edit(req, res) {
    const category = CategoryModel.findById(req.params.id);
    if (!category) {
      req.flash('error', 'Kategori tidak ditemukan.');
      return res.redirect('/categories');
    }
    res.render('categories/edit', {
      title: 'Edit Kategori',
      user: req.session.user,
      category,
      error: req.flash('error')
    });
  }

  update(req, res) {
    const { name, description } = req.body;
    CategoryModel.update(req.params.id, { name: name.trim(), description: description || '' });
    req.flash('success', 'Kategori berhasil diperbarui.');
    res.redirect('/categories');
  }

  destroy(req, res) {
    if (CategoryModel.hasProducts(req.params.id)) {
      req.flash('error', 'Tidak bisa menghapus kategori yang masih memiliki produk.');
      return res.redirect('/categories');
    }
    CategoryModel.delete(req.params.id);
    req.flash('success', 'Kategori berhasil dihapus.');
    res.redirect('/categories');
  }
}

module.exports = new CategoryController();
