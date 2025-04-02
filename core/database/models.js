const {
    pgTable,
    serial,
    varchar,
    integer,
    primaryKey,
    foreignKey,
    pgEnum,
  } = require("drizzle-orm/pg-core");
  
  // Enum pour l'état des exemplaires
  const etatExemplaire = pgEnum("etat_exemplaire", [
    "disponible",
    "indisponible",
  ]);
  
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
    prenom: varchar("prenom", { length: 50 }),
    email: varchar("email", { length: 100 }),
    contact: varchar("contact", { length: 20 }),
    adresse: varchar("adresse", { length: 200 }),
    status: varchar("status", { length: 50 }),
    fonctionId: integer("fonction_id")
      .notNull()
      .references(() => fonction.id),
  });
  
  // Sollicitation
  const sollicitation = pgTable("sollicitation", {
    id: serial("id").primaryKey(),
    description: varchar("description", { length: 500 }),
    etat: varchar("etat", { length: 50 }),
    type: varchar("type", { length: 50 }),
  });
  
  // Demande
  const demande = pgTable("demande", {
    id: serial("id").primaryKey(),
    dateDebut: varchar("date_debut", { length: 25 }),
    status: varchar("status", { length: 50 }),
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
  
  // PieceRechange
  const pieceRechange = pgTable("piece_rechange", {
    id: serial("id").primaryKey(),
    designation: varchar("designation", { length: 200 }),
    reference: varchar("reference", { length: 50 }),
    marque: varchar("marque", { length: 100 }),
    quantite: varchar("quantite", { length: 20 }),
  });
  
  // Produit (avec clé primaire composite corrigée)
  const produit = pgTable(
    "produit",
    {
      id: serial("id").notNull(),
      code: varchar("code", { length: 50 }).notNull(),
      nom: varchar("nom", { length: 100 }),
      description: varchar("description", { length: 500 }),
      type: varchar("type", { length: 50 }),
      image: varchar("image", { length: 255 }),
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
      sollicitationId: integer("sollicitation_id")
        .notNull()
        .references(() => sollicitation.id)
        .unique(),
    },
    (table) => ({
      pk: primaryKey({ columns: [table.id, table.code] }),
    })
  );
  
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
  });
  
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
  
  // Intervention
  const intervention = pgTable("intervention", {
    id: serial("id").primaryKey(),
    date: varchar("date", { length: 25 }),
    causeDefaillance: varchar("cause_defaillance", { length: 500 }),
    rapport: varchar("rapport_intervention", { length: 1000 }),
    typeMaintenance: varchar("type_maintenance", { length: 50 }),
    typeDefaillance: varchar("type_defaillance", { length: 50 }),
    superviseur: varchar("superviseur", { length: 100 }),
    duree: varchar("duree", { length: 50 }),
    numero: varchar("numero", { length: 50 }),
    lieu: varchar("lieu", { length: 200 }),
    sollicitationId: integer("sollicitation_id")
      .notNull()
      .references(() => sollicitation.id)
      .unique(),
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
    etat: varchar("etat", { length: 50 }),
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
    description: varchar("description", { length: 500 }),
    statut: varchar("statut", { length: 50 }),
    lieu: varchar("lieu", { length: 200 }),
    projetId: integer("projet_id")
      .notNull()
      .references(() => projet.id),
  });
  
  // Exemplaire (avec référence composite corrigée)
  const exemplaire = pgTable(
    "exemplaire",
    {
      id: serial("id").primaryKey(),
      numSerie: varchar("num_serie", { length: 100 }),
      prix: varchar("prix", { length: 50 }),
      etat: etatExemplaire("etat").notNull().default("disponible"),
      livraisonId: integer("livraison_id")
        .notNull()
        .references(() => livraison.id),
      produitId: integer("produit_id").notNull(),
      produitCode: varchar("produit_code", { length: 50 }).notNull(),
    },
    (table) => ({
      produitFk: foreignKey({
        columns: [table.produitId, table.produitCode],
        foreignColumns: [produit.id, produit.code],
      }),
    })
  );
  
  // Tache
  const tache = pgTable("tache", {
    id: serial("id").primaryKey(),
    nom: varchar("nom", { length: 100 }),
    description: varchar("description", { length: 500 }),
    statut: varchar("statut", { length: 50 }),
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
      quantite: varchar("quantite", { length: 20 }),
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
  
  const interventionPiece = pgTable(
    "intervention_piece",
    {
      interventionId: integer("intervention_id")
        .notNull()
        .references(() => intervention.id),
      pieceId: integer("piece_id")
        .notNull()
        .references(() => pieceRechange.id),
    },
    (table) => ({
      pk: primaryKey({ columns: [table.interventionId, table.pieceId] }),
    })
  );
  
  const interventionEmploye = pgTable(
    "intervention_enployer",
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
  
  const produitIntervention = pgTable(
    "produit_intervention",
    {
      produitId: integer("produit_id").notNull(),
      produitCode: varchar("produit_code", { length: 50 }).notNull(),
      interventionId: integer("intervention_id")
        .notNull()
        .references(() => intervention.id),
    },
    (table) => ({
      pk: primaryKey({
        columns: [table.produitId, table.produitCode, table.interventionId],
      }),
    })
  );
  
  const effectuer = pgTable(
    "effectuer",
    {
      partenaireId: integer("partenaire_id")
        .notNull()
        .references(() => partenaire.id),
      demandeId: integer("demande_id")
        .notNull()
        .references(() => sollicitation.id),
    },
    (table) => ({
      pk: primaryKey({ columns: [table.partenaireId, table.demandeId] }),
    })
  );
  
  module.exports = {
    famille,
    categorie,
    modele,
    marque,
    fonction,
    employes,
    sollicitation,
    demande,
    typeDoc,
    entite,
    pieceRechange,
    produit,
    documents,
    partenaire,
    intervention,
    projet,
    livraison,
    mission,
    exemplaire,
    tache,
    projetExemplaireEmployes,
    exemplaireAcheter,
    missionEmployes,
    interventionPiece,
    interventionEmploye,
    produitIntervention,
    effectuer,
  };