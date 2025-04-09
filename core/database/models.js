const { text } = require("drizzle-orm/gel-core");
const {
  pgTable,
  serial,
  varchar,
  integer,
  primaryKey,
  foreignKey,
  timestamp,
} = require("drizzle-orm/pg-core");
const { sql } = require("drizzle-orm");

// Famille
const famille = pgTable("famille", {
  id: serial("id").primaryKey(),
  libelle: varchar("libelle", { length: 100 }),
});

// Categorie
const categorie = pgTable("categorie", {
  id: serial("id").primaryKey(),
  libelle: varchar("libelle", { length: 100 }),
});

// Modele
const modele = pgTable("modele", {
  id: serial("id").primaryKey(),
  libelle: varchar("libelle", { length: 100 }),
});

// Marque
const marque = pgTable("marque", {
  id: serial("id").primaryKey(),
  libelle: varchar("libelle", { length: 100 }),
});

// Fonction
const fonction = pgTable("fonction", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 50 }).unique(),
});

// Employes
const employes = pgTable("employes", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 50 }),
  keycloak_id: varchar("keycloak_id", { length: 36 }).unique().notNull(),
  prenom: varchar("prenom", { length: 50 }),
  email: varchar("email", { length: 100 }),
  contact: varchar("contact", { length: 20 }),
  adresse: varchar("adresse", { length: 200 }),
  status: varchar("status", { length: 50 }),
  fonctionId: integer("fonction_id")
    .notNull()
    .references(() => fonction.id),
});

// Demande
const demande = pgTable("demande", {
  id: serial("id").primaryKey(),
  dateDebut: varchar("date_debut", { length: 25 }),
  status: varchar("status", { length: 20 }),
  dateFin: varchar("date_fin", { length: 25 }),
  motif: varchar("motif", { length: 200 }),
  type: varchar("type", { length: 50 }),
  employeId: integer("employe_id")
    .notNull()
    .references(() => employes.id),
});

// TypeDoc
const typeDoc = pgTable("type_doc", {
  id: serial("id").primaryKey(),
  libelle: varchar("libelle", { length: 100 }),
});

// Entité
const entite = pgTable("entite", {
  id: serial("id").primaryKey(),
  libelle: varchar("libelle", { length: 100 }),
});

// Produit (avec clé primaire composée id + code)
const produit = pgTable(
  "produit",
  {
    id: serial("id").notNull(),
    code: varchar("code", { length: 50 }).notNull(),
    nom: varchar("nom", { length: 100 }),
    description: text("description"),
    type: varchar("type", { length: 50 }),
    image: varchar("image", { length: 255 }), // <- revoir la contrainte sur l'image
    quantite: varchar("quantite", { length: 20 }),
    modeleId: integer("modele_id")
      .notNull()
      .references(() => modele.id),
    categorieId: integer("categorie_id")
      .notNull()
      .references(() => categorie.id),
    familleId: integer("famille_id")
      .notNull()
      .references(() => famille.id),
    marqueId: integer("marque_id")
      .notNull()
      .references(() => marque.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id, table.code] }),
  })
);

// Partenaire
const partenaire = pgTable("partenaire", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }),
  telephone: varchar("telephone", { length: 20 }),
  email: varchar("email", { length: 100 }).unique(),
  specialite: varchar("specialite", { length: 100 }),
  localisation: varchar("localisation", { length: 200 }),
  type: varchar("type", { length: 50 }),
  entiteId: integer("entite_id")
    .notNull()
    .references(() => entite.id),
});

// Contrat
const contrat = pgTable("contrat", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }),
  duree: varchar("duree", { length: 50 }),
  dateDebut: varchar("date_debut", { length: 25 }),
  dateFin: varchar("date_fin", { length: 25 }),
  type: varchar("type", { length: 50 }),
  partenaireId: integer("partenaire_id")
    .notNull()
    .references(() => partenaire.id),
});

// Documents
const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  titre: varchar("titre", { length: 200 }),
  fichier: varchar("fichier", { length: 255 }),
  dateAjout: varchar("date_ajout", { length: 25 }),
  employeId: integer("employe_id").references(() => employes.id),
  typeDocId: integer("type_doc_id")
    .notNull()
    .references(() => typeDoc.id),
  demandeId: integer("demande_id").references(() => demande.id),
  contratId: integer("contrat_id").references(() => contrat.id),
});

// Intervention
const intervention = pgTable("intervention", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 25 }),
  causeDefaillance: varchar("cause_defaillance", { length: 100 }),
  rapport: varchar("rapport", { length: 255 }),
  typeMaintenance: varchar("type_maintenance", { length: 50 }),
  typeDefaillance: varchar("type_defaillance", { length: 50 }),
  superviseur: varchar("superviseur", { length: 100 }),
  duree: varchar("duree", { length: 20 }),
  numero: varchar("numero", { length: 50 }),
  lieu: varchar("lieu", { length: 100 }),
  contratId: integer("contrat_id")
    .notNull()
    .references(() => contrat.id),
});

// Projet
const projet = pgTable("projet", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }),
  type: varchar("type", { length: 50 }),
  devis: varchar("devis", { length: 50 }),
  dateDebut: varchar("date_debut", { length: 25 }),
  dateFin: varchar("date_fin", { length: 25 }),
  duree: varchar("duree", { length: 50 }),
  description: varchar("description", { length: 1000 }),
  etat: varchar("etat", { length: 20 }),
  partenaireId: integer("partenaire_id")
    .notNull()
    .references(() => partenaire.id),
  familleId: integer("famille_id")
    .notNull()
    .references(() => famille.id),
});

// Livraison
const livraison = pgTable("livraison", {
  id: serial("id").primaryKey(),
  autresFrais: varchar("autres_frais", { length: 50 }),
  periodeAchat: varchar("periode_achat", { length: 50 }),
  prixAchat: varchar("prix_achat", { length: 50 }),
  dedouanement: varchar("dedouanement", { length: 50 }),
  prixTransport: varchar("prix_transport", { length: 50 }),
  dateLivraison: varchar("date_livraison", { length: 25 }),
  quantite: varchar("quantite", { length: 20 }),
  partenaireId: integer("partenaire_id")
    .notNull()
    .references(() => partenaire.id),
});

// Mission
const mission = pgTable("mission", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }),
  description: text("description"),
  statut: varchar("statut", { length: 20 }),
  lieu: varchar("lieu", { length: 200 }),
  projetId: integer("projet_id")
    .notNull()
    .references(() => projet.id),
});

// Exemplaire
const exemplaire = pgTable(
  "exemplaire",
  {
    id: serial("id").primaryKey(),
    numSerie: varchar("num_serie", { length: 100 }),
    prix: varchar("prix", { length: 50 }),
    etat: varchar("etat", { length: 20 }), // "disponible", "vendu", "reserve", "en maintenance", "retire de la vente", "endommage", "en projet"
    livraisonId: integer("livraison_id")
      .notNull()
      .references(() => livraison.id),
    produitId: integer("produit_id").notNull(),
    produitCode: varchar("produit_code", { length: 50 }).notNull(),
  },
  (table) => ({
    fk: foreignKey({
      columns: [table.produitId, table.produitCode],
      foreignColumns: [produit.id, produit.code],
    }),
  })
);

// // Table d'historique des exemplaires
// const exemplaireHistory = pgTable('exemplaire_history', {
//   id: serial('id').primaryKey(),
//   exemplaireId: integer('exemplaire_id').notNull(),
//   numSerie: varchar('num_serie', { length: 100 }),
//   prix: varchar('prix', { length: 50 }),
//   etat: varchar('etat', { length: 20 }),
//   livraisonId: integer('livraison_id').notNull(),
//   produitId: integer('produit_id').notNull(),
//   produitCode: varchar('produit_code', { length: 50 }).notNull(),
//   changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow(),
//   operation: varchar('operation', { length: 10 }).notNull(),
//   changedBy: varchar('changed_by', { length: 100 }), // Optionnel
// });

// // Script SQL pour créer le trigger
// const createHistoryTriggerSQL = `
// -- Supprime la fonction existante pour éviter les conflits
// DROP FUNCTION IF EXISTS log_exemplaire_changes() CASCADE;

// -- Crée la fonction de trigger
// CREATE OR REPLACE FUNCTION log_exemplaire_changes()
// RETURNS TRIGGER AS $$
// DECLARE
//     current_user_text TEXT := NULL;
// BEGIN
//     -- Essaie de récupérer l'utilisateur courant (sans erreur si non défini)
//     BEGIN
//         current_user_text := current_setting('app.current_user', true);
//     EXCEPTION WHEN OTHERS THEN
//         current_user_text := NULL;
//     END;

//     -- Gestion des différentes opérations
//     IF (TG_OP = 'DELETE') THEN
//         INSERT INTO exemplaire_history (
//             exemplaire_id, num_serie, prix, etat,
//             livraison_id, produit_id, produit_code,
//             operation, changed_by, changed_at
//         ) VALUES (
//             OLD.id, OLD.num_serie, OLD.prix, OLD.etat,
//             OLD.livraison_id, OLD.produit_id, OLD.produit_code,
//             'DELETE', current_user_text, NOW()
//         );
//         RETURN OLD;

//     ELSIF (TG_OP = 'UPDATE') THEN
//         INSERT INTO exemplaire_history (
//             exemplaire_id, num_serie, prix, etat,
//             livraison_id, produit_id, produit_code,
//             operation, changed_by, changed_at
//         ) VALUES (
//             NEW.id, NEW.num_serie, NEW.prix, NEW.etat,
//             NEW.livraison_id, NEW.produit_id, NEW.produit_code,
//             'UPDATE', current_user_text, NOW()
//         );
//         RETURN NEW;

//     ELSIF (TG_OP = 'INSERT') THEN
//         INSERT INTO exemplaire_history (
//             exemplaire_id, num_serie, prix, etat,
//             livraison_id, produit_id, produit_code,
//             operation, changed_by, changed_at
//         ) VALUES (
//             NEW.id, NEW.num_serie, NEW.prix, NEW.etat,
//             NEW.livraison_id, NEW.produit_id, NEW.produit_code,
//             'INSERT', current_user_text, NOW()
//         );
//         RETURN NEW;
//     END IF;

//     RETURN NULL;
// END;
// $$ LANGUAGE plpgsql;

// -- Supprime le trigger existant s'il existe
// DROP TRIGGER IF EXISTS exemplaire_changes_trigger ON exemplaire;

// -- Crée le trigger
// CREATE TRIGGER exemplaire_changes_trigger
// AFTER INSERT OR UPDATE OR DELETE ON exemplaire
// FOR EACH ROW EXECUTE FUNCTION log_exemplaire_changes();

// -- Commentaire pour documentation
// COMMENT ON FUNCTION log_exemplaire_changes() IS 'Trigger pour historiser les changements dans la table exemplaire';
// COMMENT ON TRIGGER exemplaire_changes_trigger ON exemplaire IS 'Déclencheur pour enregistrer l''historique des modifications';
// `;

// // Fonction pour définir l'utilisateur courant
// function setCurrentUserSQL(userId) {
//   return sql`SET app.current_user = ${userId}`;
// }

// // Fonction pour initialiser le système d'historique
// async function initializeHistorySystem(db) {
//   await db.execute(sql.raw(createHistoryTriggerSQL));
//   console.log('Trigger d\'historique pour exemplaire créé avec succès');
// }

// Tache
const tache = pgTable("tache", {
  id: serial("id").primaryKey(),
  nom: varchar("nom", { length: 100 }),
  description: text("description"),
  statut: varchar("statut", { length: 20 }),
  dateDebut: varchar("date_debut", { length: 25 }),
  dateFin: varchar("date_fin", { length: 25 }),
  responsable: varchar("responsable", { length: 100 }),
  missionId: integer("mission_id")
    .notNull()
    .references(() => mission.id),
});

// Tables de liaison
const projetExemplaireEmployes = pgTable(
  "projet_exemplaire_employes",
  {
    exemplaireId: integer("exemplaire_id")
      .notNull()
      .references(() => exemplaire.id),
    projetId: integer("projet_id")
      .notNull()
      .references(() => projet.id),
    employeId: integer("employe_id")
      .notNull()
      .references(() => employes.id),
    dateUtilisation: varchar("date_utilisation", { length: 25 }),
    dateFin: varchar("date_fin", { length: 25 }),
    dateDebut: varchar("date_debut", { length: 25 }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.exemplaireId, table.projetId, table.employeId],
    }),
  })
);

const exemplaireAcheter = pgTable(
  "exemplaire_acheter",
  {
    exemplaireId: integer("exemplaire_id")
      .notNull()
      .references(() => exemplaire.id),
    partenaireId: integer("partenaire_id")
      .notNull()
      .references(() => partenaire.id),
    lieuLivraison: varchar("lieu_livraison", { length: 200 }),
    dateAchat: varchar("date_achat", { length: 25 }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.exemplaireId, table.partenaireId] }),
  })
);

const missionEmployes = pgTable(
  "mission_employes",
  {
    employeId: integer("employe_id")
      .notNull()
      .references(() => employes.id),
    missionId: integer("mission_id")
      .notNull()
      .references(() => mission.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.employeId, table.missionId] }),
  })
);

const interventionProduit = pgTable(
  "Intervention_Produits",
  {
    exemplaireId: integer("exemplaire_id")
      .notNull()
      .references(() => exemplaire.id),
    interventionId: integer("intervention_id")
      .notNull()
      .references(() => intervention.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.exemplaireId, table.interventionId] }),
  })
);

const interventionEmploye = pgTable(
  "Intervention_enployer",
  {
    employeId: integer("employe_id")
      .notNull()
      .references(() => employes.id),
    interventionId: integer("intervention_id")
      .notNull()
      .references(() => intervention.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.employeId, table.interventionId] }),
  })
);

const sollicitationProduits = pgTable(
  "Sollicitation_Produits",
  {
    produitId: integer("produit_id").notNull(),
    produitCode: varchar("produit_code", { length: 50 }).notNull(),
    partenaireId: integer("partenaire_id")
      .notNull()
      .references(() => partenaire.id),
    etat: varchar("etat", { length: 20 }),
    description: text("description"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.produitId, table.produitCode, table.partenaireId],
    }),
    fk: foreignKey({
      columns: [table.produitId, table.produitCode],
      foreignColumns: [produit.id, produit.code],
    }),
  })
);

const sollicitationInterventions = pgTable(
  "Sollicitation_Interventions",
  {
    partenaireId: integer("partenaire_id")
      .notNull()
      .references(() => partenaire.id),
    interventionId: integer("intervention_id")
      .notNull()
      .references(() => intervention.id),
    etat: varchar("etat", { length: 20 }),
    description: text("description"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.partenaireId, table.interventionId] }),
  })
);

module.exports = {
  famille,
  categorie,
  modele,
  marque,
  fonction,
  employes,
  demande,
  typeDoc,
  entite,
  produit,
  documents,
  partenaire,
  contrat,
  intervention,
  projet,
  livraison,
  mission,
  exemplaire,
  tache,
  projetExemplaireEmployes,
  exemplaireAcheter,
  missionEmployes,
  interventionProduit,
  interventionEmploye,
  sollicitationProduits,
  sollicitationInterventions,
};
