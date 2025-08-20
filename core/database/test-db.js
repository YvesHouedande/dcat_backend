// test-db.js
const { db } = require('./config');
const { intervention } = require('./models');

(async () => {
  try {
    console.log("Testing database connection...");
    const result = await db.select().from(intervention).limit(1);
    console.log("Success! Found", result.length, "interventions");
  } catch (err) {
    console.error("Database test failed:", err);
  } finally {
    process.exit();
  }
})();