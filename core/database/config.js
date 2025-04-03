import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './models.js';
import 'dotenv/config'; 

// Configuration plus robuste
const pool = new Pool({
  host: process.env.DB_HOST, 
  port: Number(process.env.DB_PORT), 
  user: process.env.APP_DB_USER,
  password: process.env.APP_DB_PASSWORD,
  database: process.env.APP_DB_NAME
});

export const db = drizzle(pool, { schema });