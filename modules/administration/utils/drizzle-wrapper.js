const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const schema = require("../../../core/database/models");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASSWORD,
    database: process.env.APP_DB_NAME,
});

// Tester la connexion
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erreur de connexion:', err.stack);
    } else {
        console.log('Connexion à la base de données réussie!');
        release();
    }
});

module.exports = drizzle(pool, { schema }); 




