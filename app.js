const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: 'hashmicro-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24h
}));

// Flash messages
app.use(flash());

// Init DB
require('./src/config/database');

// Routes
app.use('/', require('./src/routes/index'));

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <html><body style="background:#0a0e1a;color:#e2e8f0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:12px;">
      <h1 style="font-size:3rem;color:#3b82f6;">404</h1>
      <p>Halaman tidak ditemukan</p>
      <a href="/dashboard" style="color:#3b82f6;">← Dashboard</a>
    </body></html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n🚀 HashMicro Technical Test App berjalan di http://localhost:${PORT}`);
  console.log(`   Login: admin / admin123\n`);
});

module.exports = app;
