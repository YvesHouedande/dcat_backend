const pg = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const schema = require('../../../core/database/models.js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

// Vérification des variables d'environnement
console.log('Configuration DB:');
console.log('HOST:', process.env.DB_HOST);
console.log('PORT:', process.env.DB_PORT);
console.log('USER:', process.env.APP_DB_USER);
console.log('DB_NAME:', process.env.APP_DB_NAME);
// Ne loguez pas le mot de passe en production!

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.APP_DB_USER,
  password: process.env.APP_DB_PASSWORD || '', // Assure que c'est une string
  database: process.env.APP_DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

const db = drizzle(pool, { schema });

async function testDbConnection() {
  let client;
  try {
    // Test de connexion basique sans Drizzle
    client = await pool.connect();
    const res = await client.query('SELECT 1 + 1 AS result');
    console.log('Test de connexion basique réussi:', res.rows[0]);
    
    // Test avec Drizzle
    const result = await db.select().from(schema.famille).limit(1);
    console.log('Première famille:', result);
    
  } catch (error) {
    console.error('Erreur de connexion:', error);
    // Détails supplémentaires pour le débogage
    if (error.code) console.error('Code erreur PostgreSQL:', error.code);
  } finally {
    if (client) client.release();
    // Ne fermez pas le pool ici si vous voulez le réutiliser
  }
}

testDbConnection()
  .then(() => console.log('Test terminé'))
  .catch(err => console.error('Erreur globale:', err));