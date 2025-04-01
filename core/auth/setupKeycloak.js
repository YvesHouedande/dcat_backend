const session = require('express-session');
const { memoryStore } = require('./keycloak.config');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'your-strong-secret-here',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
});

module.exports = {
  sessionConfig
};