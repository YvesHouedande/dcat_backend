-- PostgreSQL Backup - 2025-07-25T14:46:57.215Z

BEGIN;

CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE public.fonctions (
  id_fonction INTEGER NOT NULL DEFAULT nextval('fonctions_id_fonction_seq'::regclass),
  nom_fonction CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.employes (
  id_employes INTEGER NOT NULL DEFAULT nextval('employes_id_employes_seq'::regclass),
  keycloak_id CHARACTER VARYING,
  nom_employes CHARACTER VARYING,
  prenom_employes CHARACTER VARYING,
  email_employes CHARACTER VARYING,
  contact_employes CHARACTER VARYING,
  adresse_employes TEXT,
  status_employes CHARACTER VARYING,
  date_embauche_employes DATE,
  password_employes CHARACTER VARYING,
  date_de_naissance DATE,
  contrat CHARACTER VARYING,
  id_fonction INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.demandes (
  id_demandes INTEGER NOT NULL DEFAULT nextval('demandes_id_demandes_seq'::regclass),
  date_absence DATE,
  status CHARACTER VARYING,
  date_retour DATE,
  motif TEXT,
  type_demande CHARACTER VARYING,
  durée CHARACTER VARYING,
  heure_debut TIME WITHOUT TIME ZONE,
  heure_fin TIME WITHOUT TIME ZONE,
  id_employes INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.familles (
  id_famille INTEGER NOT NULL DEFAULT nextval('familles_id_famille_seq'::regclass),
  libelle_famille CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.projets (
  id_projet INTEGER NOT NULL DEFAULT nextval('projets_id_projet_seq'::regclass),
  nom_projet CHARACTER VARYING NOT NULL,
  type_projet CHARACTER VARYING NOT NULL,
  devis_estimatif NUMERIC,
  date_debut DATE,
  date_fin DATE,
  duree_prevu_projet CHARACTER VARYING,
  description_projet TEXT,
  etat CHARACTER VARYING,
  lieu CHARACTER VARYING,
  responsable CHARACTER VARYING,
  site CHARACTER VARYING,
  id_famille INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.categories (
  id_categorie INTEGER NOT NULL DEFAULT nextval('categories_id_categorie_seq'::regclass),
  libelle CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.type_produits (
  id_type_produit INTEGER NOT NULL DEFAULT nextval('type_produits_id_type_produit_seq'::regclass),
  libelle CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.marques (
  id_marque INTEGER NOT NULL DEFAULT nextval('marques_id_marque_seq'::regclass),
  libelle_marque CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.entites (
  id_entite INTEGER NOT NULL DEFAULT nextval('entites_id_entite_seq'::regclass),
  denomination CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.partenaires (
  id_partenaire INTEGER NOT NULL DEFAULT nextval('partenaires_id_partenaire_seq'::regclass),
  nom_partenaire CHARACTER VARYING,
  telephone_partenaire CHARACTER VARYING,
  email_partenaire CHARACTER VARYING,
  specialite CHARACTER VARYING,
  localisation CHARACTER VARYING,
  type_partenaire CHARACTER VARYING,
  statut CHARACTER VARYING,
  id_entite INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.contrats (
  id_contrat INTEGER NOT NULL DEFAULT nextval('contrats_id_contrat_seq'::regclass),
  nom_contrat CHARACTER VARYING,
  duree_contrat CHARACTER VARYING,
  date_debut DATE,
  date_fin DATE,
  reference CHARACTER VARYING,
  type_de_contrat CHARACTER VARYING,
  statut CHARACTER VARYING,
  id_partenaire INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.interlocuteurs (
  id_interlocuteur INTEGER NOT NULL DEFAULT nextval('interlocuteurs_id_interlocuteur_seq'::regclass),
  nom_interlocuteur CHARACTER VARYING,
  prenom_interlocuteur CHARACTER VARYING,
  contact_interlocuteur CHARACTER VARYING,
  email_interlocuteur CHARACTER VARYING,
  fonction_interlocuteur CHARACTER VARYING,
  id_partenaire INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.nature_documents (
  id_nature_document INTEGER NOT NULL DEFAULT nextval('nature_documents_id_nature_document_seq'::regclass),
  libelle CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.intervention_employes (
  id_employes INTEGER NOT NULL,
  id_intervention INTEGER NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.intervention_taches (
  id_employes INTEGER NOT NULL,
  id_tache INTEGER NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.maintenance_employes (
  id_employes INTEGER NOT NULL,
  id_maintenance INTEGER NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.prestations (
  id_prestation INTEGER NOT NULL DEFAULT nextval('prestations_id_prestation_seq'::regclass),
  date_de_maintenance DATE,
  type_de_maintenance CHARACTER VARYING,
  description TEXT,
  responsable CHARACTER VARYING,
  pieces_remplacees TEXT,
  cout_maintenance NUMERIC,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.maintenance_moyens_travail (
  id_moyens_de_travail INTEGER NOT NULL,
  id_maintenance INTEGER NOT NULL,
  date_maintenance DATE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.livrables (
  id_livrable INTEGER NOT NULL DEFAULT nextval('livrables_id_livrable_seq'::regclass),
  date DATE,
  realisations TEXT,
  reserves TEXT,
  approbation TEXT,
  recommandation TEXT,
  id_projet INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  libelle_livrable CHARACTER VARYING
);

CREATE TABLE public.livraisons (
  id_livraison INTEGER NOT NULL DEFAULT nextval('livraisons_id_livraison_seq'::regclass),
  frais_divers NUMERIC,
  periode_achat CHARACTER VARYING,
  prix_achat NUMERIC,
  prix_de_revient NUMERIC,
  prix_de_vente NUMERIC,
  id_partenaire INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  reference_livraison CHARACTER VARYING
);

CREATE TABLE public.interventions (
  id_intervention INTEGER NOT NULL DEFAULT nextval('interventions_id_intervention_seq'::regclass),
  cause_defaillance CHARACTER VARYING,
  rapport_intervention TEXT,
  type_intervention CHARACTER VARYING,
  type_defaillance CHARACTER VARYING,
  duree CHARACTER VARYING,
  lieu CHARACTER VARYING,
  statut_intervention CHARACTER VARYING,
  recommandation TEXT,
  probleme_signale CHARACTER VARYING,
  mode_intervention CHARACTER VARYING,
  detail_cause TEXT,
  type CHARACTER VARYING,
  id_partenaire INTEGER,
  id_contrat INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  date_intervention DATE
);

CREATE TABLE public.partenaire_projets (
  id_projet INTEGER NOT NULL,
  id_partenaire INTEGER NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.employe_entrer_exemplaires (
  id_exemplaire INTEGER NOT NULL,
  id_employes INTEGER NOT NULL,
  etat_apres CHARACTER VARYING NOT NULL,
  date_de_retour DATE NOT NULL,
  commentaire TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.employe_prestations (
  id_employes INTEGER NOT NULL,
  id_prestation INTEGER NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.employe_sortir_exemplaires (
  id_exemplaire INTEGER NOT NULL,
  id_employes INTEGER NOT NULL,
  but_usage CHARACTER VARYING NOT NULL,
  etat_avant CHARACTER VARYING NOT NULL,
  date_de_sortie DATE NOT NULL,
  site_intervention CHARACTER VARYING NOT NULL,
  commentaire TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.modeles (
  id_modele INTEGER NOT NULL DEFAULT nextval('modeles_id_modele_seq'::regclass),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  libelle_modele CHARACTER VARYING,
  id_marque INTEGER
);

CREATE TABLE public.clients_en_ligne (
  id_client INTEGER NOT NULL DEFAULT nextval('clients_en_ligne_id_client_seq'::regclass),
  email CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  nom CHARACTER VARYING,
  role CHARACTER VARYING DEFAULT 'client'::character varying,
  password CHARACTER VARYING,
  contact CHARACTER VARYING
);

CREATE TABLE public.commandes (
  id_commande INTEGER NOT NULL DEFAULT nextval('commandes_id_commande_seq'::regclass),
  date_de_commande DATE,
  etat_commande CHARACTER VARYING DEFAULT 'en_attente'::character varying,
  date_livraison DATE,
  lieu_de_livraison CHARACTER VARYING,
  mode_de_paiement CHARACTER VARYING,
  id_client INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  commande_produits_reserves BOOLEAN DEFAULT false,
  id_partenaire INTEGER
);

CREATE TABLE public.taches (
  id_tache INTEGER NOT NULL DEFAULT nextval('taches_id_tache_seq'::regclass),
  nom_tache CHARACTER VARYING,
  desc_tache TEXT,
  statut CHARACTER VARYING,
  date_debut DATE,
  date_fin DATE,
  priorite CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  id_operation INTEGER
);

CREATE TABLE public.moyens_de_travail (
  id_moyens_de_travail INTEGER NOT NULL DEFAULT nextval('moyens_de_travail_id_moyens_de_travail_seq'::regclass),
  denomination CHARACTER VARYING,
  date_acquisition DATE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  etat CHARACTER VARYING DEFAULT 'Disponible'::character varying,
  id_section INTEGER
);

CREATE TABLE public.services (
  id_service INTEGER NOT NULL DEFAULT nextval('services_id_service_seq'::regclass),
  titre_service CHARACTER VARYING,
  image CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  sous_titre_service CHARACTER VARYING,
  detail_service TEXT
);

CREATE TABLE public.affiches (
  id_affiche INTEGER NOT NULL DEFAULT nextval('affiches_id_affiche_seq'::regclass),
  image TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  titre_promotion CHARACTER VARYING,
  sous_titre_promotion CHARACTER VARYING
);

CREATE TABLE public.produits (
  id_produit INTEGER NOT NULL DEFAULT nextval('produits_id_produit_seq'::regclass),
  code_produit TEXT,
  desi_produit CHARACTER VARYING,
  desc_produit TEXT,
  qte_produit INTEGER DEFAULT 0,
  emplacement TEXT,
  id_categorie INTEGER,
  id_type_produit INTEGER,
  id_modele INTEGER,
  id_famille INTEGER,
  id_marque INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  caracteristiques TEXT,
  prix_produit NUMERIC,
  seuil_min_produit INTEGER DEFAULT 0
);

CREATE TABLE public.maintenances (
  id_maintenance INTEGER NOT NULL DEFAULT nextval('maintenances_id_maintenance_seq'::regclass),
  recurrence CHARACTER VARYING,
  operations TEXT,
  recommandations TEXT,
  type_maintenance CHARACTER VARYING DEFAULT 'preventive'::character varying,
  autre_intervenant CHARACTER VARYING,
  id_partenaire INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  date_planifiee DATE,
  statut CHARACTER VARYING DEFAULT 'en_attente'::character varying
);

CREATE TABLE public.documents (
  id_documents INTEGER NOT NULL DEFAULT nextval('documents_id_documents_seq'::regclass),
  libelle_document CHARACTER VARYING,
  classification_document CHARACTER VARYING,
  lien_document CHARACTER VARYING,
  etat_document CHARACTER VARYING DEFAULT 'Actif'::character varying,
  id_livrable INTEGER,
  id_projet INTEGER,
  id_demandes INTEGER,
  id_contrat INTEGER,
  id_employes INTEGER,
  id_nature_document INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  date_document CHARACTER VARYING,
  id_intervention INTEGER,
  id_dossier INTEGER
);

CREATE TABLE public.exemplaires (
  id_exemplaire INTEGER NOT NULL DEFAULT nextval('exemplaires_id_exemplaire_seq'::regclass),
  num_serie TEXT,
  date_entree DATE,
  id_livraison INTEGER,
  id_produit INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  etat_exemplaire CHARACTER VARYING DEFAULT 'Disponible'::character varying,
  id_commande INTEGER
);

CREATE TABLE public.sortie_exemplaires (
  id_sortie_exemplaire INTEGER NOT NULL DEFAULT nextval('sortie_exemplaires_id_sortie_exemplaire_seq'::regclass),
  type_sortie CHARACTER VARYING,
  date_sortie DATE,
  id_exemplaire INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  id_commande INTEGER
);

CREATE TABLE public.commande_produits (
  id_commande INTEGER NOT NULL,
  id_produit INTEGER NOT NULL,
  quantite INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  prix_unitaire NUMERIC
);

CREATE TABLE public.refresh_tokens (
  id INTEGER NOT NULL DEFAULT nextval('refresh_tokens_id_seq'::regclass),
  user_id INTEGER NOT NULL,
  token CHARACTER VARYING NOT NULL,
  expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.paniers (
  id_panier INTEGER NOT NULL DEFAULT nextval('paniers_id_panier_seq'::regclass),
  id_client INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.operations (
  id_operation INTEGER NOT NULL DEFAULT nextval('operations_id_operation_seq'::regclass),
  nom_operation CHARACTER VARYING,
  desc_operation TEXT,
  statut CHARACTER VARYING,
  date_debut DATE,
  date_fin DATE,
  priorite CHARACTER VARYING,
  id_projet INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.images (
  id_image INTEGER NOT NULL DEFAULT nextval('images_id_image_seq'::regclass),
  libelle_image TEXT,
  numero_image INTEGER,
  lien_image TEXT,
  id_produit INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.panier_produits (
  id_panier INTEGER NOT NULL,
  id_produit INTEGER NOT NULL,
  quantite INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.notifications (
  id INTEGER NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
  user_id INTEGER,
  title CHARACTER VARYING NOT NULL,
  message TEXT NOT NULL,
  type CHARACTER VARYING DEFAULT 'info'::character varying,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.sections (
  id_section INTEGER NOT NULL DEFAULT nextval('sections_id_section_seq'::regclass),
  libelle CHARACTER VARYING,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.dossiers (
  id_dossier INTEGER NOT NULL DEFAULT nextval('dossiers_id_dossier_seq'::regclass),
  libelle_dossier CHARACTER VARYING
);

CREATE SCHEMA IF NOT EXISTS drizzle;

CREATE TABLE drizzle.__drizzle_migrations (
  id INTEGER NOT NULL DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass),
  hash TEXT NOT NULL,
  created_at BIGINT
);

-- Data for drizzle.__drizzle_migrations
INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at) VALUES (1, '6644267f66abd90b9fe7a28d1a8fed8ff60a3abb359d48fc6886fc2259264c18', '1745405309311');
INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at) VALUES (2, 'b938b4cac7bb3e7a5edc5e6afc895150730046fa3ecd9b9cfbd677a8b9ea8f8a', '1745409313787');
INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at) VALUES (3, '4a08b817afe47c9b44b42b2a51e00d7d09c75585d3e9d0a3ea865098bd5a94a6', '1745843779955');
INSERT INTO drizzle.__drizzle_migrations (id, hash, created_at) VALUES (4, 'e02827de9b7d3949b4264804700898b78130b0f5cc4d0bcc13621b935a38dd11', '1753220257474');

COMMIT;
