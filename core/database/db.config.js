module.exports = {
  HOST: process.env.DB_HOST || "postgres", 
  USER: process.env.DB_USER || "dcat_user",
  PASSWORD: process.env.DB_PASSWORD || "dcat_password",
  DB: process.env.DB_NAME || "dcat_db",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};