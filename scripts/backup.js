const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.APP_DB_USER,
  password: process.env.APP_DB_PASSWORD,
  database: process.env.APP_DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

const backupDir = path.resolve(__dirname, '../backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `backup_${dateStr}.sql`);

async function getTableDefinition(client, schema, table) {
  const res = await client.query(`
    SELECT 
      column_name, 
      data_type,
      is_nullable,
      column_default
    FROM 
      information_schema.columns
    WHERE 
      table_schema = $1 AND 
      table_name = $2
    ORDER BY 
      ordinal_position
  `, [schema, table]);

  return res.rows.map(col => {
    let def = `${col.column_name} ${col.data_type.toUpperCase()}`;
    if (col.is_nullable === 'NO') def += ' NOT NULL';
    if (col.column_default) def += ` DEFAULT ${col.column_default}`;
    return def;
  }).join(',\n  ');
}

async function createBackup() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');

    const writeStream = fs.createWriteStream(backupFile);
    writeStream.write(`-- PostgreSQL Backup - ${new Date().toISOString()}\n\n`);
    writeStream.write('BEGIN;\n\n');

    // 1. Sauvegarde des schémas
    const schemas = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
    `);

    for (const schema of schemas.rows) {
      const schemaName = schema.schema_name;
      writeStream.write(`CREATE SCHEMA IF NOT EXISTS ${schemaName};\n\n`);

      // 2. Sauvegarde des tables
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = $1 AND table_type = 'BASE TABLE'
      `, [schemaName]);

      for (const table of tables.rows) {
        const tableName = table.table_name;
        const fullTableName = `${schemaName}.${tableName}`;
        console.log(`🔍 Saving table: ${fullTableName}`);

        // Structure de la table
        const columnsDef = await getTableDefinition(client, schemaName, tableName);
        writeStream.write(`CREATE TABLE ${fullTableName} (\n  ${columnsDef}\n);\n\n`);

        // Données de la table
        const dataQuery = await client.query(`SELECT * FROM ${fullTableName}`);
        if (dataQuery.rows.length > 0) {
          writeStream.write(`-- Data for ${fullTableName}\n`);
          
          for (const row of dataQuery.rows) {
            const columns = Object.keys(row);
            const values = columns.map(col => {
              const val = row[col];
              if (val === null) return 'NULL';
              if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
              return val;
            });
            
            writeStream.write(
              `INSERT INTO ${fullTableName} (${columns.join(', ')}) ` +
              `VALUES (${values.join(', ')});\n`
            );
          }
          writeStream.write('\n');
        }
      }
    }

    writeStream.write('COMMIT;\n');
    writeStream.end();
    console.log(`✅ Backup saved to: ${backupFile}`);

  } catch (error) {
    console.error('❌ Backup failed:', error);
    if (fs.existsSync(backupFile)) fs.unlinkSync(backupFile);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

createBackup();