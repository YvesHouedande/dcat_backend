require('dotenv').config();

module.exports = {
  schema: "./core/database/models.js",
  out: "./core/database/migrations",
  dialect: "postgresql",
  url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
};
