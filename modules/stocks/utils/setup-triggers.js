// const { sql } = require('drizzle-orm');
// const { db } = require('./db.config');

// async function setupUpdatedAtTriggers() {
//   // Étape 1 : Créer la fonction PostgreSQL
//   await db.execute(sql`
//     CREATE OR REPLACE FUNCTION update_updated_at_column()
//     RETURNS TRIGGER AS $$
//     BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//     END;
//     $$ LANGUAGE plpgsql;
//   `);

//   // Étape 2 : Liste des tables à gérer
//   const tables = [
//     'familles', 'modeles', 'marques', 'fonctions', 'employes',
//     'demandes', 'type_docs', 'clients_en_ligne', 'entites',
//     'partenaires', 'commandes', 'type_produits', 'prestations',
//     'produits', 'contrats', 'projets', 'livraisons', 'documents',
//     'interventions', 'taches', 'exemplaires',
//     'intervention_employes', 'usage_exemplaires', 'prestation_employes'
//   ];

//   // Étape 3 : Créer un trigger sur chaque table
//   for (const table of tables) {
//     await db.execute(sql`
//       DROP TRIGGER IF EXISTS trg_update_${sql.identifier(table)}_updated_at ON ${sql.identifier(table)};
//     `);

//     await db.execute(sql`
//       CREATE TRIGGER trg_update_${sql.identifier(table)}_updated_at
//       BEFORE UPDATE ON ${sql.identifier(table)}
//       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
//     `);
//   }

//   console.log('✅ Triggers "updated_at" appliqués avec succès à toutes les tables.');
// }

// module.exports = {
//   setupUpdatedAtTriggers,
// };
