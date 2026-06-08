const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const bcrypt = require('bcryptjs');

const adapter = new FileSync(path.join(__dirname, '../../data/db.json'));
const db = low(adapter);

// Default structure
db.defaults({
  users: [],
  products: [],
  categories: [],
  char_checker_logs: []
}).write();

// Seed default admin if not exists
const adminExists = db.get('users').find({ username: 'admin' }).value();
if (!adminExists) {
  const hashed = bcrypt.hashSync('admin123', 10);
  db.get('users').push({
    id: 1,
    name: 'Administrator',
    username: 'admin',
    password: hashed,
    role: 'admin',
    created_at: new Date().toISOString()
  }).write();
}

// Seed default categories
const catCount = db.get('categories').value().length;
if (catCount === 0) {
  db.get('categories').push(
    { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', created_at: new Date().toISOString() },
    { id: 2, name: 'Clothing', description: 'Apparel and fashion', created_at: new Date().toISOString() },
    { id: 3, name: 'Food & Beverage', description: 'Food and drink products', created_at: new Date().toISOString() }
  ).write();
}

// Seed default products
const prodCount = db.get('products').value().length;
if (prodCount === 0) {
  db.get('products').push(
    { id: 1, name: 'Laptop Pro X', category_id: 1, price: 15000000, stock: 10, discount: 10, description: 'High performance laptop', created_at: new Date().toISOString() },
    { id: 2, name: 'Wireless Earbuds', category_id: 1, price: 500000, stock: 50, discount: 5, description: 'Noise cancelling earbuds', created_at: new Date().toISOString() },
    { id: 3, name: 'Cotton T-Shirt', category_id: 2, price: 150000, stock: 100, discount: 0, description: 'Comfortable cotton shirt', created_at: new Date().toISOString() }
  ).write();
}

module.exports = db;
