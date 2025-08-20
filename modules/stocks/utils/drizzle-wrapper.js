/**
 * ⚠️ [ARCHITECTURE - SOLUTION DE CONTOURNEMENT] ⚠️
 *
 * Problème initial :
 * - Le fichier central config.js utilise des ES Modules (import/export)
 * - Le reste du projet utilise CommonJS (require/module.exports)
 * - Résultat : db.insert() non reconnu dans famille.service.js
 *
 * Pourquoi ce fichier existe :
 * 1. Évite de modifier config.js (fichier partagé avec d'autres modules)
 * 2. Contourne l'incompatibilité des systèmes de modules
 * 3. Garantit une instance Drizzle fonctionnelle avec :
 *    - Les mêmes paramètres de connexion
 *    - Le même schéma de base de données
 *
 * Solution technique :
 * - Crée une nouvelle instance Drizzle locale
 * - Réutilise les variables d'environnement existantes
 * - Maintient l'isolation du module
 *
 * Risques à connaître :
 * - Double instance de Pool PostgreSQL (augmente légèrement les connexions)
 * - Nécessite de synchroniser les changements de schéma manuellement
 *
 * Alternatives envisagées et rejetées :
 * - Convertir tout le projet en ES Modules (trop intrusif)
 * - Modifier config.js (risque pour les autres modules)
 */

// [Mon module stocks] → [drizzle-wrapper local] → PostgreSQL
//             ↑
//             └─ [N'utilise PAS config.js]

// modules/stocks/utils/drizzle-wrapper.js
const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const schema = require("../../../core/database/models");

// Config locale (utilise les mêmes variables d'environnement de .env)
const pool = new Pool({
  // host: process.env.DB_HOST,
  host: "172.31.3.7",
  port: process.env.DB_PORT,
  user: process.env.APP_DB_USER,
  password: process.env.APP_DB_PASSWORD,
  database: process.env.APP_DB_NAME,
});

module.exports = drizzle(pool, { schema });
