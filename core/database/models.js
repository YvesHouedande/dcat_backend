const { pgTable, serial, varchar, integer, date, timestamp, decimal, boolean, text, primaryKey, foreignKey } = require("drizzle-orm/pg-core");



// Familles
const familles = pgTable('familles', {
  id_famille: serial('id_famille').primaryKey(),
  libelle_famille: varchar('libelle_famille', { length: 50 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Modeles
const modeles = pgTable('modeles', {
  id_modele: serial('id_modele').primaryKey(),
  libelle_modele: varchar('libelle_modele', { length: 50 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Marques
const marques = pgTable('marques', {
  id_marque: serial('id_marque').primaryKey(),
  libelle_marque: varchar('libelle_marque', { length: 50 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Fonctions
const fonctions = pgTable('fonctions', {
  id_fonction: serial('id_fonction').primaryKey(),
  nom_fonction: varchar('nom_fonction', { length: 50 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Employes (gardé au pluriel car déjà correct)
const employes = pgTable('employes', {
  id_employes: serial('id_employes').primaryKey(),
  nom_employes: varchar('nom_employes', { length: 50 }),
  prenom_employes: varchar('prenom_employes', { length: 50 }),
  email_employes: varchar('email_employes', { length: 50 }),
  contact_employes: varchar('contact_employes', { length: 50 }),
  adresse_employes: varchar('adresse_employes', { length: 50 }),
  status_employes: varchar('status_employes', { length: 50 }),
  missions_employes: varchar('missions_employes', { length: 50 }),
  date_embauche_employes: date('date_embauche_employes'),
  mot_de_passe_employes: varchar('mot_de_passe_employes', { length: 50 }),
  id_fonction: integer('id_fonction').notNull().references(() => fonctions.id_fonction),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Demandes
const demandes = pgTable('demandes', {
  id_demande: serial('id_demande').primaryKey(),
  date_debut_demande: timestamp('date_debut_demande'),
  status_demande: varchar('status_demande', { length: 50 }),
  date_fin_demande: timestamp('date_fin_demande'),
  motif_demande: varchar('motif_demande', { length: 50 }),
  type_demande: varchar('type_demande', { length: 50 }),
  duree_demande: varchar('duree_demande', { length: 50 }),
  id_employes: integer('id_employes').notNull().references(() => employes.id_employes),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Type_docs
const type_docs = pgTable('type_docs', {
  id_typedoc: serial('id_typedoc').primaryKey(),
  libelle_typedoc: varchar('libelle_typedoc', { length: 50 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Clients_en_ligne
const clients_en_ligne = pgTable('clients_en_ligne', {
  id_client: serial('id_client').primaryKey(),
  nom_client: varchar('nom_client', { length: 50 }),
  email_client: varchar('email_client', { length: 50 }),
  password_client: varchar('password_client', { length: 50 }),
  contact_client: varchar('contact_client', { length: 50 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Entites
const entites = pgTable('entites', {
  id_entite: serial('id_entite').primaryKey(),
  libelle_entite: varchar('libelle_entite', { length: 50 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Partenaires
const partenaires = pgTable('partenaires', {
  id_partenaire: serial('id_partenaire').primaryKey(),
  nom_partenaire: varchar('nom_partenaire', { length: 50 }),
  telephone_partenaire: varchar('telephone_partenaire', { length: 50 }),
  email_partenaire: varchar('email_partenaire', { length: 50 }),
  specialite_partenaire: varchar('specialite_partenaire', { length: 50 }),
  localisation_partenaire: varchar('localisation_partenaire', { length: 50 }),
  type_partenaire: varchar('type_partenaire', { length: 50 }),
  id_entite: integer('id_entite').references(() => entites.id_entite),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Commandes
const commandes = pgTable('commandes', {
  id_commande: serial('id_commande').primaryKey(),
  date_commande: date('date_commande'),
  etat_commande: varchar('etat_commande', { length: 50 }),
  date_livraison_commande: date('date_livraison_commande'),
  lieu_livraison_commande: varchar('lieu_livraison_commande', { length: 50 }),
  id_client: integer('id_client').references(() => clients_en_ligne.id_client),
  id_partenaire: integer('id_partenaire').references(() => partenaires.id_partenaire),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Type_produits
const type_produits = pgTable('type_produits', {
  id_type_produit: serial('id_type_produit').primaryKey(),
  libelle_type_produit: varchar('libelle_type_produit', { length: 50 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Prestations
const prestations = pgTable('prestations', {
  id_prestation: serial('id_prestation').primaryKey(),
  date_prestation: timestamp('date_prestation'),
  type_prestation: varchar('type_prestation', { length: 50 }),
  description_prestation: text('description_prestation'),
  responsable_prestation: varchar('responsable_prestation', { length: 50 }),
  pieces_prestation: varchar('pieces_prestation', { length: 50 }),
  cout_prestation: decimal('cout_prestation', { precision: 10, scale: 2 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Produits
const produits = pgTable('produits', {
  id_produit: serial('id_produit').primaryKey(),
  code_produit: varchar('code_produit', { length: 50 }),
  designation_produit: varchar('designation_produit', { length: 50 }),
  description_produit: text('description_produit'),
  image_produit: varchar('image_produit', { length: 50 }),
  quantite_produit: integer('quantite_produit'),
  emplacement_produit: varchar('emplacement_produit', { length: 50 }),
  id_type_produit: integer('id_type_produit').references(() => type_produits.id_type_produit),
  id_modele: integer('id_modele').references(() => modeles.id_modele),
  id_famille: integer('id_famille').references(() => familles.id_famille),
  id_marque: integer('id_marque').references(() => marques.id_marque),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Contrats
const contrats = pgTable('contrats', {
  id_contrat: serial('id_contrat').primaryKey(),
  nom_contrat: varchar('nom_contrat', { length: 50 }),
  duree_contrat: varchar('duree_contrat', { length: 50 }),
  date_debut_contrat: date('date_debut_contrat'),
  date_fin_contrat: date('date_fin_contrat'),
  reference_contrat: varchar('reference_contrat', { length: 50 }),
  type_contrat: varchar('type_contrat', { length: 50 }),
  statut_contrat: varchar('statut_contrat', { length: 50 }),
  id_partenaire: integer('id_partenaire').notNull().references(() => partenaires.id_partenaire),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Projets
const projets = pgTable('projets', {
  id_projet: serial('id_projet').primaryKey(),
  nom_projet: varchar('nom_projet', { length: 50 }),
  type_projet: varchar('type_projet', { length: 50 }),
  devis_projet: decimal('devis_projet', { precision: 10, scale: 2 }),
  date_debut_projet: date('date_debut_projet'),
  date_fin_projet: date('date_fin_projet'),
  duree_projet: varchar('duree_projet', { length: 50 }),
  description_projet: text('description_projet'),
  etat_projet: varchar('etat_projet', { length: 50 }),
  lieu_projet: varchar('lieu_projet', { length: 50 }),
  id_partenaire: integer('id_partenaire').notNull().references(() => partenaires.id_partenaire),
  id_famille: integer('id_famille').notNull().references(() => familles.id_famille),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Livraisons
const livraisons = pgTable('livraisons', {
  id_livraison: serial('id_livraison').primaryKey(),
  frais_livraison: decimal('frais_livraison', { precision: 10, scale: 2 }),
  periode_livraison: varchar('periode_livraison', { length: 50 }),
  prix_achat_livraison: decimal('prix_achat_livraison', { precision: 10, scale: 2 }),
  dedouanement_livraison: decimal('dedouanement_livraison', { precision: 10, scale: 2 }),
  transport_livraison: decimal('transport_livraison', { precision: 10, scale: 2 }),
  date_livraison: date('date_livraison'),
  quantite_livraison: integer('quantite_livraison'),
  id_partenaire: integer('id_partenaire').notNull().references(() => partenaires.id_partenaire),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Documents
const documents = pgTable('documents', {
  id_document: serial('id_document').primaryKey(),
  titre_document: varchar('titre_document', { length: 50 }),
  fichier_document: varchar('fichier_document', { length: 50 }),
  date_document: timestamp('date_document'),
  id_demande: integer('id_demande').references(() => demandes.id_demande),
  id_contrat: integer('id_contrat').references(() => contrats.id_contrat),
  id_employes: integer('id_employes').references(() => employes.id_employes),
  id_typedoc: integer('id_typedoc').notNull().references(() => type_docs.id_typedoc),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Interventions
const interventions = pgTable('interventions', {
  id_intervention: serial('id_intervention').primaryKey(),
  date_intervention: date('date_intervention'),
  cause_intervention: varchar('cause_intervention', { length: 50 }),
  rapport_intervention: varchar('rapport_intervention', { length: 50 }),
  type_intervention: varchar('type_intervention', { length: 50 }),
  defaillance_intervention: varchar('defaillance_intervention', { length: 50 }),
  superviseur_intervention: varchar('superviseur_intervention', { length: 50 }),
  duree_intervention: varchar('duree_intervention', { length: 50 }),
  numero_intervention: varchar('numero_intervention', { length: 50 }),
  lieu_intervention: varchar('lieu_intervention', { length: 50 }),
  statut_intervention: varchar('statut_intervention', { length: 50 }),
  id_contrat: integer('id_contrat').notNull().references(() => contrats.id_contrat),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});


// Taches
const taches = pgTable('taches', {
  id_tache: serial('id_tache').primaryKey(),
  nom_tache: varchar('nom_tache', { length: 50 }),
  description_tache: text('description_tache'),
  statut_tache: varchar('statut_tache', { length: 50 }),
  date_debut_tache: date('date_debut_tache'),
  date_fin_tache: date('date_fin_tache'),
  responsable_tache: varchar('responsable_tache', { length: 50 }),
  priorite_tache: varchar('priorite_tache', { length: 50 }),
  id_projet: integer('id_projet').notNull().references(() => projets.id_projet),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Exemplaires
const exemplaires = pgTable('exemplaires', {
  id_exemplaire: serial('id_exemplaire').primaryKey(),
  numero_serie: varchar('numero_serie', { length: 50 }),
  prix_exemplaire: decimal('prix_exemplaire', { precision: 10, scale: 2 }),
  etat_exemplaire: varchar('etat_exemplaire', { length: 50 }),
  id_commande: integer('id_commande').references(() => commandes.id_commande),
  id_livraison: integer('id_livraison').notNull().references(() => livraisons.id_livraison),
  id_produit: integer('id_produit').notNull().references(() => produits.id_produit),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
});

// Tables d'association

const intervention_employes = pgTable('intervention_employes', {
  id_employes: integer('id_employes').notNull().references(() => employes.id_employes),
  id_intervention: integer('id_intervention').notNull().references(() => interventions.id_intervention),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.id_employes, table.id_intervention] }),
}));

const usage_exemplaires = pgTable('usage_exemplaires', {
  id_exemplaire: integer('id_exemplaire').notNull().references(() => exemplaires.id_exemplaire),
  id_employes: integer('id_employes').notNull().references(() => employes.id_employes),
  etat_avant_usage: varchar('etat_avant_usage', { length: 50 }),
  etat_apres_usage: varchar('etat_apres_usage', { length: 50 }),
  date_sortie_usage: date('date_sortie_usage'),
  date_retour_usage: date('date_retour_usage'),
  site_usage: varchar('site_usage', { length: 50 }),
  motif_usage: varchar('motif_usage', { length: 50 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.id_exemplaire, table.id_employes] }),
}));

const prestation_employes = pgTable('prestation_employes', {
  id_employes: integer('id_employes').notNull().references(() => employes.id_employes),
  id_prestation: integer('id_prestation').notNull().references(() => prestations.id_prestation),
  created_at: timestamp('created_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 6 }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.id_employes, table.id_prestation] }),
}));

module.exports= {
  familles,
  modeles,
  marques,
  fonctions,
  employes,
  demandes,
  type_docs,
  clients_en_ligne,
  entites,
  partenaires,
  commandes,
  type_produits,
  prestations,
  produits,
  contrats,
  projets,
  livraisons,
  documents,
  interventions,
  taches,
  exemplaires,
  intervention_employes,
  usage_exemplaires,
  prestation_employes
};