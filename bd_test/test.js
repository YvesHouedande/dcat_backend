import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const app = express();



app.use(cors());
app.use(express.json());

// Database configurations
const pool = new Pool({
  user: "dcat_user",
  host: "localhost", // Changez de "postgres" à "localhost"sss
  database: "dcat_db",
  password: "dcat_password",
  port: 5432,
});

// Log de la configuration de la connexion
console.log("Attempting to connect to PostgreSQL with configuration:", {
  user: "dcat_user",
  host: "postgres",
  database: "dcat_db",
  port: 5432,
});

// Test database connection
app.get("/test-db", async (req, res) => {
  console.log("Received request to test database connection");
  
  let client;
  try {
    console.log("Attempting to acquire client from pool...");
    client = await pool.connect();
    console.log("Client acquired, executing query...");
    
    const result = await client.query("SELECT NOW()");
    console.log("Query successful, result:", result.rows[0]);
    
    client.release();
    console.log("Client released back to pool");
    
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    console.error("Database connection error:", err);
    
    if (client) {
      try {
        client.release();
      } catch (releaseErr) {
        console.error("Error releasing client:", releaseErr);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      error: err instanceof Error ? err.message : "An unknown error occurred",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Vérification initiale au démarrage
async function testInitialConnection() {
  try {
    console.log("Testing initial database connection...");
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    console.log("Initial database connection successful. Current time in DB:", result.rows[0].now);
  } catch (err) {
    console.error("Initial database connection failed:", err);
    process.exit(1); // Quitte l'application si la connexion échoue
  }
}

app.listen(3000, async () => {
  console.log("Server running on http://localhost:3000");
  await testInitialConnection();
});