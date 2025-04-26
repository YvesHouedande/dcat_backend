const {
  pgTable,
  serial,
  varchar,
  integer,
  date,
  timestamp,
  decimal,
  boolean,
  text,
  time,
  primaryKey,
  foreignKey,
} = require("drizzle-orm/pg-core");

// Famille
const familles = pgTable("familles", {
  id_famille: serial("id_famille").primaryKey(),
  libelle_famille: varchar("libelle_famille", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Modele
const modeles = pgTable("modeles", {
  id_modele: serial("id_modele").primaryKey(),
  libelle_modele: varchar("libelle_modele", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Marque
const marques = pgTable("marques", {
  id_marque: serial("id_marque").primaryKey(),
  libelle_marque: varchar("libelle_marque", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Fonction
const fonctions = pgTable("fonctions", {
  id_fonction: serial("id_fonction").primaryKey(),
  nom_fonction: varchar("nom_fonction", { length: 50 }).unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Employes
const employes = pgTable("employes", {
  id_employes: serial("id_employes").primaryKey(),
  keycloak_id: varchar("keycloak_id", { length: 100 }).unique(),
  nom_employes: varchar("nom_employes", { length: 50 }),
  prenom_employes: varchar("prenom_employes", { length: 75 }),
  email_employes: varchar("email_employes", { length: 100 }),
  contact_employes: varchar("contact_employes", { length: 50 }),
  adresse_employes: text("adresse_employes"),
  status_employes: varchar("status_employes", { length: 50 }),
  date_embauche_employes: date("date_embauche_employes"),
  password_employes: varchar("password_employes", { length: 255 }),
  date_de_naissance: date("date_de_naissance"),
  contrat: varchar("contrat", { length: 100 }),
  id_fonction: integer("id_fonction").references(() => fonctions.id_fonction),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Demande
const demandes = pgTable("demandes", {
  id_demandes: serial("id_demandes").primaryKey(),
  date_absence: date("date_absence"),
  status: varchar("status", { length: 50 }),
  date_retour: date("date_retour"),
  motif: text("motif"),
  type_demande: varchar("type_demande", { length: 50 }),
  durée: varchar("durée", { length: 50 }),
  heure_debut: time("heure_debut"),
  heure_fin: time("heure_fin"),
  id_employes: integer("id_employes").references(() => employes.id_employes),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Nature_document
const nature_documents = pgTable("nature_documents", {
  id_nature_document: serial("id_nature_document").primaryKey(),
  libelle: varchar("libelle", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Entité
const entites = pgTable("entites", {
  id_entite: serial("id_entite").primaryKey(),
  denomination: varchar("denomination", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Client_en_ligne
const clients_en_ligne = pgTable("clients_en_ligne", {
  id_client: serial("id_client").primaryKey(),
  nom_complet: varchar("nom_complet", { length: 50 }),
  email: varchar("email", { length: 50 }).unique(),
  mot_de_passe: varchar("mot_de_passe", { length: 255 }),
  numero_de_telephone: varchar("numero_de_telephone", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Commande
const commandes = pgTable("commandes", {
  id_commande: serial("id_commande").primaryKey(),
  date_de_commande: date("date_de_commande"),
  etat_commande: varchar("etat_commande", { length: 50 }),
  date_livraison: date("date_livraison"),
  lieu_de_livraison: varchar("lieu_de_livraison", { length: 50 }),
  mode_de_paiement: varchar("mode_de_paiement", { length: 50 }),
  id_client: integer("id_client").references(() => clients_en_ligne.id_client),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Type_produit
const type_produits = pgTable("type_produits", {
  id_type_produit: serial("id_type_produit").primaryKey(),
  libelle: varchar("libelle", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Catégorie
const categories = pgTable("categories", {
  id_categorie: serial("id_categorie").primaryKey(),
  libelle: varchar("libelle", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Projet
const projets = pgTable("projets", {
  id_projet: serial("id_projet").primaryKey(),
  nom_projet: varchar("nom_projet", { length: 50 }).notNull(),
  type_projet: varchar("type_projet", { length: 50 }).notNull(),
  devis_estimatif: decimal("devis_estimatif", {
    precision: 10,
    scale: 2,
  }),
  date_debut: date("date_debut"),
  date_fin: date("date_fin"),
  duree_prevu_projet: varchar("duree_prevu_projet", { length: 50 }),
  description_projet: text("description_projet"),
  etat: varchar("etat", { length: 50 }),
  lieu: varchar("lieu", { length: 50 }),
  responsable: varchar("responsable", { length: 50 }),
  site: varchar("site", { length: 50 }),
  id_famille: integer("id_famille").references(() => familles.id_famille),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Tache
const taches = pgTable("taches", {
  id_tache: serial("id_tache").primaryKey(),
  nom_tache: varchar("nom_tache", { length: 50 }),
  desc_tache: text("desc_tache"),
  statut: varchar("statut", { length: 50 }),
  date_debut: timestamp("date_debut"),
  date_fin: timestamp("date_fin"),
  priorite: varchar("priorite", { length: 50 }),
  id_projet: integer("id_projet").references(() => projets.id_projet),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Prestation
const prestations = pgTable("prestations", {
  id_prestation: serial("id_prestation").primaryKey(),
  date_de_maintenance: timestamp("date_de_maintenance"),
  type_de_maintenance: varchar("type_de_maintenance", { length: 50 }),
  description: text("description"),
  responsable: varchar("responsable", { length: 50 }),
  pieces_remplacees: text("pieces_remplacees"),
  cout_maintenance: decimal("cout_maintenance", {
    precision: 10,
    scale: 2,
  }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Livrable
const livrables = pgTable("livrables", {
  id_livrable: serial("id_livrable").primaryKey(),
  date: date("date"),
  realisations: text("realisations"),
  reserves: text("reserves"),
  approbation: text("approbation"),
  recommandation: text("recommandation"),
  id_projet: integer("id_projet").references(() => projets.id_projet),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Moyens_de_travail
const moyens_de_travail = pgTable("moyens_de_travail", {
  id_moyens_de_travail: serial("id_moyens_de_travail").primaryKey(),
  denomination: varchar("denomination", { length: 50 }),
  date_acquisition: date("date_acquisition"),
  section: varchar("section", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Service
const services = pgTable("services", {
  id_service: serial("id_service").primaryKey(),
  titre_service: varchar("titre_service", { length: 50 }),
  image: varchar("image", { length: 255 }),
  description: text("description"),
  id_employes: integer("id_employes").references(() => employes.id_employes),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Affiche
const affiches = pgTable("affiches", {
  id_affiche: serial("id_affiche").primaryKey(),
  image: varchar("image", { length: 255 }),
  titre: varchar("titre", { length: 50 }),
  description: text("description"),
  id_employes: integer("id_employes").references(() => employes.id_employes),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Produit
const produits = pgTable("produits", {
  id_produit: serial("id_produit").primaryKey(), // Clé primaire simple
  code_produit: varchar("code_produit", { length: 100 }).unique(),
  desi_produit: varchar("desi_produit", { length: 50 }),
  desc_produit: text("desc_produit"),
  image_produit: varchar("image_produit", { length: 255 }),
  qte_produit: integer("qte_produit").default(0),
  emplacement: text("emplacement"),
  id_categorie: integer("id_categorie").references(
    () => categories.id_categorie
  ),
  id_type_produit: integer("id_type_produit").references(
    () => type_produits.id_type_produit
  ),
  id_modele: integer("id_modele").references(() => modeles.id_modele),
  id_famille: integer("id_famille").references(() => familles.id_famille),
  id_marque: integer("id_marque").references(() => marques.id_marque),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Partenaire
const partenaires = pgTable("partenaires", {
  id_partenaire: serial("id_partenaire").primaryKey(),
  nom_partenaire: varchar("nom_partenaire", { length: 50 }),
  telephone_partenaire: varchar("telephone_partenaire", {
    length: 50,
  }),
  email_partenaire: varchar("email_partenaire", { length: 100 }).unique(),
  specialite: varchar("specialite", { length: 50 }),
  localisation: varchar("localisation", { length: 50 }),
  type_partenaire: varchar("type_partenaire", { length: 50 }),
  statut: varchar("statut", { length: 50 }),
  id_entite: integer("id_entite").references(() => entites.id_entite),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Contrat
const contrats = pgTable("contrats", {
  id_contrat: serial("id_contrat").primaryKey(),
  nom_contrat: varchar("nom_contrat", { length: 50 }),
  duree_contrat: varchar("duree_contrat", { length: 50 }),
  date_debut: date("date_debut"),
  date_fin: date("date_fin"),
  reference: varchar("reference", { length: 50 }),
  type_de_contrat: varchar("type_de_contrat", { length: 50 }),
  statut: varchar("statut", { length: 50 }),
  id_partenaire: integer("id_partenaire").references(
    () => partenaires.id_partenaire
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Interlocuteur
const interlocuteurs = pgTable("interlocuteurs", {
  id_interlocuteur: serial("id_interlocuteur").primaryKey(),
  nom_interlocuteur: varchar("nom_interlocuteur", { length: 50 }),
  prenom_interlocuteur: varchar("prenom_interlocuteur", {
    length: 75,
  }),
  contact_interlocuteur: varchar("contact_interlocuteur", {
    length: 50,
  }),
  email_interlocuteur: varchar("email_interlocuteur", { length: 100 }).unique(),
  fonction_interlocuteur: varchar("fonction_interlocuteur", {
    length: 50,
  }),
  id_partenaire: integer("id_partenaire").references(
    () => partenaires.id_partenaire
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Maintenance
const maintenances = pgTable("maintenances", {
  id_maintenance: serial("id_maintenance").primaryKey(),
  recurrence: varchar("recurrence", { length: 50 }),
  operations: text("operations"),
  recommandations: text("recommandations"),
  type_maintenance: varchar("type_maintenance", { length: 50 }),
  autre_intervenant: varchar("autre_intervenant", { length: 50 }),
  id_partenaire: integer("id_partenaire").references(
    () => partenaires.id_partenaire
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Livraison
const livraisons = pgTable("livraisons", {
  id_livraison: serial("id_livraison").primaryKey(),
  frais_divers: decimal("frais_divers", { precision: 10, scale: 2 }),
  periode_achat: varchar("periode_achat", { length: 50 }),
  prix_achat: decimal("prix_achat", { precision: 10, scale: 2 }),
  prix_de_revient: decimal("prix_de_revient", {
    precision: 10,
    scale: 2,
  }),
  prix_de_vente: decimal("prix_de_vente", {
    precision: 10,
    scale: 2,
  }),
  id_partenaire: integer("id_partenaire").references(
    () => partenaires.id_partenaire
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Intervention
const interventions = pgTable("interventions", {
  id_intervention: serial("id_intervention").primaryKey(),
  date_intervention: timestamp("date_intervention"),
  cause_defaillance: varchar("cause_defaillance", { length: 50 }),
  rapport_intervention: text("rapport_intervention"),
  type_intervention: varchar("type_intervention", { length: 50 }),
  type_defaillance: varchar("type_defaillance", { length: 50 }),
  duree: varchar("duree", { length: 50 }),
  lieu: varchar("lieu", { length: 100 }),
  statut_intervention: varchar("statut_intervention", { length: 50 }),
  recommandation: text("recommandation"),
  probleme_signale: varchar("probleme_signale", { length: 50 }),
  mode_intervention: varchar("mode_intervention", { length: 50 }),
  detail_cause: text("detail_cause"),
  type: varchar("type", { length: 50 }),
  id_partenaire: integer("id_partenaire").references(
    () => partenaires.id_partenaire
  ),
  id_contrat: integer("id_contrat").references(() => contrats.id_contrat),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Documents
const documents = pgTable("documents", {
  id_documents: serial("id_documents").primaryKey(),
  libelle_document: varchar("libelle_document", { length: 100 }),
  date_document: varchar("date_document", { length: 50 }),
  lien_document: varchar("lien_document", { length: 255 }),
  etat_document: varchar("etat_document", { length: 50 }),
  id_livrable: integer("id_livrable").references(() => livrables.id_livrable),
  id_projet: integer("id_projet").references(() => projets.id_projet),
  id_demandes: integer("id_demandes").references(() => demandes.id_demandes),
  id_contrat: integer("id_contrat").references(() => contrats.id_contrat),
  id_employes: integer("id_employes").references(() => employes.id_employes),
  id_intervention: integer("id_intervention").references(
    () => interventions.id_intervention
  ),
  id_nature_document: integer("id_nature_document").references(
    () => nature_documents.id_nature_document
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Exemplaire_produit
const exemplaires = pgTable("exemplaires", {
  id_exemplaire: serial("id_exemplaire").primaryKey(),
  num_serie: varchar("num_serie", { length: 50 }),
  prix_exemplaire: decimal("prix_exemplaire", {
    precision: 10,
    scale: 2,
  }),
  date_entree: date("date_entree"),
  etat_exemplaire: varchar("etat_exemplaire", { length: 75 }).default(
    "Disponible"
  ), //"Vendu", "Disponible", "Utilisation", "En maintenance", "Endommage", "Reserve"
  id_commande: integer("id_commande").references(() => commandes.id_commande),
  id_livraison: integer("id_livraison").references(
    () => livraisons.id_livraison
  ),
  id_produit: integer("id_produit").references(() => produits.id_produit), // Référence simplifiée
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Sortie_exemplaire
const sortie_exemplaires = pgTable("sortie_exemplaires", {
  id_sortie_exemplaire: serial("id_sortie_exemplaire").primaryKey(),
  type_sortie: varchar("type_sortie", { length: 50 }),
  reference_id: integer("reference_id"),
  date_sortie: timestamp("date_sortie"),
  id_exemplaire: integer("id_exemplaire").references(
    () => exemplaires.id_exemplaire
  ),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Tables d'association

const partenaire_projets = pgTable(
  "partenaire_projets",
  {
    id_projet: integer("id_projet")
      .notNull()
      .references(() => projets.id_projet),
    id_partenaire: integer("id_partenaire")
      .notNull()
      .references(() => partenaires.id_partenaire),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id_projet, table.id_partenaire] }),
  })
);

const intervention_employes = pgTable(
  "intervention_employes",
  {
    id_employes: integer("id_employes")
      .notNull()
      .references(() => employes.id_employes),
    id_intervention: integer("id_intervention")
      .notNull()
      .references(() => interventions.id_intervention),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id_employes, table.id_intervention] }),
  })
);

const partenaire_commandes = pgTable(
  "partenaire_commandes",
  {
    id_partenaire: integer("id_partenaire")
      .notNull()
      .references(() => partenaires.id_partenaire),
    id_commande: integer("id_commande")
      .notNull()
      .references(() => commandes.id_commande),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id_partenaire, table.id_commande] }),
  })
);

const employe_entrer_exemplaires = pgTable(
  "employe_entrer_exemplaires",
  {
    id_exemplaire: integer("id_exemplaire")
      .notNull()
      .references(() => exemplaires.id_exemplaire),
    id_employes: integer("id_employes")
      .notNull()
      .references(() => employes.id_employes),
    etat_apres: varchar("etat_apres", { length: 50 }).notNull(),
    date_de_retour: timestamp("date_de_retour").notNull(),
    commentaire: text("commentaire"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id_exemplaire, table.id_employes] }),
  })
);

const employe_prestations = pgTable(
  "employe_prestations",
  {
    id_employes: integer("id_employes")
      .notNull()
      .references(() => employes.id_employes),
    id_prestation: integer("id_prestation")
      .notNull()
      .references(() => prestations.id_prestation),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id_employes, table.id_prestation] }),
  })
);

const intervention_taches = pgTable(
  "intervention_taches",
  {
    id_employes: integer("id_employes")
      .notNull()
      .references(() => employes.id_employes),
    id_tache: integer("id_tache")
      .notNull()
      .references(() => taches.id_tache),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id_employes, table.id_tache] }),
  })
);

const employe_sortir_exemplaires = pgTable(
  "employe_sortir_exemplaires",
  {
    id_exemplaire: integer("id_exemplaire")
      .notNull()
      .references(() => exemplaires.id_exemplaire),
    id_employes: integer("id_employes")
      .notNull()
      .references(() => employes.id_employes),
    but_usage: varchar("but_usage", { length: 50 }).notNull(),
    etat_avant: varchar("etat_avant", { length: 50 }).notNull(),
    date_de_sortie: timestamp("date_de_sortie").notNull(),
    site_intervention: varchar("site_intervention", { length: 100 }).notNull(),
    commentaire: text("commentaire"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id_exemplaire, table.id_employes] }),
  })
);

const maintenance_employes = pgTable(
  "maintenance_employes",
  {
    id_employes: integer("id_employes")
      .notNull()
      .references(() => employes.id_employes),
    id_maintenance: integer("id_maintenance")
      .notNull()
      .references(() => maintenances.id_maintenance),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id_employes, table.id_maintenance] }),
  })
);

const maintenance_moyens_travail = pgTable(
  "maintenance_moyens_travail",
  {
    id_moyens_de_travail: integer("id_moyens_de_travail")
      .notNull()
      .references(() => moyens_de_travail.id_moyens_de_travail),
    id_maintenance: integer("id_maintenance")
      .notNull()
      .references(() => maintenances.id_maintenance),
    date_maintenance: timestamp("date_maintenance").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.id_moyens_de_travail, table.id_maintenance],
    }),
  })
);

module.exports = {
  familles,
  modeles,
  marques,
  fonctions,
  employes,
  demandes,
  nature_documents,
  entites,
  clients_en_ligne,
  commandes,
  type_produits,
  categories,
  projets,
  taches,
  prestations,
  livrables,
  moyens_de_travail,
  services,
  affiches,
  produits,
  partenaires,
  contrats,
  interlocuteurs,
  maintenances,
  livraisons,
  documents,
  interventions,
  exemplaires,
  sortie_exemplaires,
  partenaire_projets,
  intervention_employes,
  partenaire_commandes,
  employe_entrer_exemplaires,
  employe_prestations,
  intervention_taches,
  employe_sortir_exemplaires,
  maintenance_employes,
  maintenance_moyens_travail,
};
