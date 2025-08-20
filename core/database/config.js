const pg = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const schema = require('./models.js');
require('dotenv').config();

// Configuration du pool PostgreSQL
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.APP_DB_USER,
  password: process.env.APP_DB_PASSWORD,
  database: process.env.APP_DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Test de connexion
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

// Export en CommonJS
module.exports = {
  db: drizzle(pool, { schema }),
  pool
};