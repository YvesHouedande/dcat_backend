require('dotenv').config();

module.exports = {
  schema: "./core/database/models.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "dcat_db",
    user: process.env.DB_USER || "dcat_user",
    password: process.env.DB_PASSWORD || "dcat_password",
    ssl: false,
  }
};