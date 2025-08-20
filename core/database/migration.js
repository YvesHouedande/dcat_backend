require("dotenv").config();
const { migrate } = require("drizzle-orm/node-postgres/migrator");
const { db } = require("./db.config");

(async () => {
  console.log("⏳ Migration en cours...");
  await migrate(db, { migrationsFolder: "backend/migrations" });
  console.log("✅ Migration terminée !");
  process.exit(0);
})();
