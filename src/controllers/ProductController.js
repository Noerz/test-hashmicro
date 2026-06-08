const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');

class ProductController {
  // GET /products
  index(req, res) {
    const search = req.query.search || '';
    let products;
    if (search) {
      products = ProductModel.search(search);
      // Apply calculations to search results with nested loop
      const categorized = [];
      const categories = CategoryModel.findAll();
      for (let i = 0; i < products.length; i++) {
        const p = ProductModel.getWithCalculations(products[i].id);
        for (let j = 0; j < categories.length; j++) {
          if (categories[j].id === p.category_id) {
            p.category_name = categories[j].name;
            break;
          }
        }
        if (!p.category_name) p.category_name = 'Uncategorized';
        categorized.push(p);
      }
      products = categorized;
    } else {
      products = ProductModel.getAllWithDetails();
    }

    res.render('products/index', {
      title: 'Manajemen Produk',
      user: req.session.user,
      products,
      search,
      success: req.flash('success'),
      error: req.flash('error')
    });
  }

  // GET /products/create
  create(req, res) {
    const categories = CategoryModel.findAll();
    res.render('products/create', {
      title: 'Tambah Produk',
      user: req.session.user,
      categories,
      error: req.flash('error')
    });
  }

  // POST /products
  store(req, res) {
    const { name, category_id, price, stock, discount, description } = req.body;

    // Nested if validation
    if (!name || name.trim() === '') {
      req.flash('error', 'Nama produk wajib diisi.');
      return res.redirect('/products/create');
    } else if (!price || isNaN(parseFloat(price))) {
      req.flash('error', 'Harga tidak valid.');
      return res.redirect('/products/create');
    } else if (!stock || isNaN(parseInt(stock))) {
      req.flash('error', 'Stok tidak valid.');
      return res.redirect('/products/create');
    }

    ProductModel.create({
      name: name.trim(),
      category_id: parseInt(category_id) || null,
      price: parseFloat(price),
      stock: parseInt(stock),
      discount: parseFloat(discount) || 0,
      description: description || ''
    });

    req.flash('success', 'Produk berhasil ditambahkan.');
    res.redirect('/products');
  }

  // GET /products/:id
  show(req, res) {
    const product = ProductModel.getWithCalculations(req.params.id);
    if (!product) {
      req.flash('error', 'Produk tidak ditemukan.');
      return res.redirect('/products');
    }

    const categories = CategoryModel.findAll();
    let categoryName = 'Uncategorized';
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === product.category_id) {
        categoryName = categories[i].name;
        break;
      }
    }
    product.category_name = categoryName;

    res.render('products/show', {
      title: product.name,
      user: req.session.user,
      product
    });
  }

  // GET /products/:id/edit
  edit(req, res) {
    const product = ProductModel.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Produk tidak ditemukan.');
      return res.redirect('/products');
    }
    const categories = CategoryModel.findAll();
    res.render('products/edit', {
      title: 'Edit Produk',
      user: req.session.user,
      product,
      categories,
      error: req.flash('error')
    });
  }

  // PUT /products/:id
  update(req, res) {
    const { name, category_id, price, stock, discount, description } = req.body;
    const product = ProductModel.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Produk tidak ditemukan.');
      return res.redirect('/products');
    }

    ProductModel.update(req.params.id, {
      name: name.trim(),
      category_id: parseInt(category_id) || null,
      price: parseFloat(price),
      stock: parseInt(stock),
      discount: parseFloat(discount) || 0,
      description: description || ''
    });

    req.flash('success', 'Produk berhasil diperbarui.');
    res.redirect('/products');
  }

  // DELETE /products/:id
  destroy(req, res) {
    const deleted = ProductModel.delete(req.params.id);
    if (deleted) {
      req.flash('success', 'Produk berhasil dihapus.');
    } else {
      req.flash('error', 'Produk tidak ditemukan.');
    }
    res.redirect('/products');
  }
}

module.exports = new ProductController();
