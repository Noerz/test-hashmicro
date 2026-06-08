module.exports = {
  apps: [
    {
      name: "hashmicro-app",
      script: "./app.js",
      watch: true, // Set false jika Anda tidak ingin PM2 restart otomatis saat ada perubahan file
      ignore_watch: [
        "node_modules", 
        "data", // Penting: Abaikan folder data agar PM2 tidak restart setiap kali database (lowdb) berubah
        "public"
      ],
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 80 // Sesuaikan port untuk production
      }
    }
  ]
};
