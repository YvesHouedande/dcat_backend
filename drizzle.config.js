require('dotenv').config();

module.exports = {
  schema: "./core/database/models.js",
  out: "./core/database/migrations",
  dialect: "postgresql",
  url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
};
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