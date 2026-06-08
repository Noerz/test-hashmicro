const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const DashboardController = require('../controllers/DashboardController');
const ProductController = require('../controllers/ProductController');
const CategoryController = require('../controllers/CategoryController');
const CharCheckerController = require('../controllers/CharCheckerController');
const { authMiddleware, guestMiddleware } = require('../middleware/auth');

// Auth routes
router.get('/login', guestMiddleware, AuthController.showLogin.bind(AuthController));
router.post('/login', guestMiddleware, AuthController.login.bind(AuthController));
router.post('/logout', AuthController.logout.bind(AuthController));

// Dashboard
router.get('/', authMiddleware, (req, res) => res.redirect('/dashboard'));
router.get('/dashboard', authMiddleware, DashboardController.index.bind(DashboardController));

// Products CRUD
router.get('/products', authMiddleware, ProductController.index.bind(ProductController));
router.get('/products/create', authMiddleware, ProductController.create.bind(ProductController));
router.post('/products', authMiddleware, ProductController.store.bind(ProductController));
router.get('/products/:id', authMiddleware, ProductController.show.bind(ProductController));
router.get('/products/:id/edit', authMiddleware, ProductController.edit.bind(ProductController));
router.put('/products/:id', authMiddleware, ProductController.update.bind(ProductController));
router.delete('/products/:id', authMiddleware, ProductController.destroy.bind(ProductController));

// Categories CRUD
router.get('/categories', authMiddleware, CategoryController.index.bind(CategoryController));
router.get('/categories/create', authMiddleware, CategoryController.create.bind(CategoryController));
router.post('/categories', authMiddleware, CategoryController.store.bind(CategoryController));
router.get('/categories/:id/edit', authMiddleware, CategoryController.edit.bind(CategoryController));
router.put('/categories/:id', authMiddleware, CategoryController.update.bind(CategoryController));
router.delete('/categories/:id', authMiddleware, CategoryController.destroy.bind(CategoryController));

// Character Checker
router.get('/char-checker', authMiddleware, CharCheckerController.index.bind(CharCheckerController));
router.post('/char-checker', authMiddleware, CharCheckerController.check.bind(CharCheckerController));

module.exports = router;
