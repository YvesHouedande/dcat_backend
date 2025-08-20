require('dotenv').config();

module.exports = {
  schema: "./core/database/models.js",
  out: "./core/database/migrations",
  dialect: "postgresql", 
  dbCredentials: {
  url: `postgresql://${process.env.APP_DB_USER}:${process.env.APP_DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.APP_DB_NAME}`
  },
  verbose: true,
  strict: true,
  ...(process.env.NODE_ENV === 'development' && {
    debug: true,
    migrationsTable: 'migrations_dev'
  })
};


