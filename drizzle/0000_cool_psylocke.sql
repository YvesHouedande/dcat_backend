CREATE TABLE "famille" (
	"id" serial PRIMARY KEY NOT NULL,
	"libelle" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "categorie" (
	"id" serial PRIMARY KEY NOT NULL,
	"libelle" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "modele" (
	"id" serial PRIMARY KEY NOT NULL,
	"libelle" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "marque" (
	"id" serial PRIMARY KEY NOT NULL,
	"libelle" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "fonction" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(50),
	CONSTRAINT "fonction_nom_unique" UNIQUE("nom")
);
--> statement-breakpoint
CREATE TABLE "employes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(50),
	"prenom" varchar(50),
	"email" varchar(100),
	"contact" varchar(20),
	"adresse" varchar(200),
	"status" varchar(50),
	"fonction_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sollicitation" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar(500),
	"etat" varchar(50),
	"type" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "demande" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_debut" varchar(25),
	"status" varchar(50),
	"date_fin" varchar(25),
	"motif" varchar(200),
	"type" varchar(50),
	"employe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type_doc" (
	"id" serial PRIMARY KEY NOT NULL,
	"libelle" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "entite" (
	"id" serial PRIMARY KEY NOT NULL,
	"libelle" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "piece_rechange" (
	"id" serial PRIMARY KEY NOT NULL,
	"designation" varchar(200),
	"reference" varchar(50),
	"marque" varchar(100),
	"quantite" integer
);
--> statement-breakpoint
CREATE TABLE "produit" (
	"id" serial NOT NULL,
	"code" varchar(50) NOT NULL,
	"nom" varchar(100),
	"description" varchar(500),
	"type" varchar(50),
	"image" varchar(255),
	"quantite" integer,
	"modele_id" integer NOT NULL,
	"categorie_id" integer NOT NULL,
	"famille_id" integer NOT NULL,
	"marque_id" integer NOT NULL,
	"sollicitation_id" integer NOT NULL,
	CONSTRAINT "produit_id_code_pk" PRIMARY KEY("id","code"),
	CONSTRAINT "produit_sollicitation_id_unique" UNIQUE("sollicitation_id")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"titre" varchar(200),
	"fichier" varchar(255),
	"date_ajout" varchar(25),
	"employe_id" integer,
	"type_doc_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partenaire" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100),
	"telephone" varchar(20),
	"email" varchar(100),
	"specialite" varchar(100),
	"localisation" varchar(200),
	"type" varchar(50),
	"entite_id" integer NOT NULL,
	CONSTRAINT "partenaire_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "contrat" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(50),
	"duree" varchar(50),
	"date_debut" varchar(50),
	"date_fin" varchar(50),
	"partenaire_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intervention" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" varchar(50),
	"cause_defaillance" varchar(50),
	"rapport_intervention" varchar(50),
	"type_maintenance" varchar(50),
	"type_defaillance" varchar(50),
	"superviseur" varchar(75),
	"duree" varchar(50),
	"numero" varchar(50),
	"lieu" varchar(50),
	"contrat_id" integer NOT NULL,
	"demande_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projet" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100),
	"type" varchar(50),
	"devis" varchar(50),
	"date_debut" varchar(25),
	"date_fin" varchar(25),
	"duree" varchar(50),
	"description" varchar(1000),
	"etat" varchar(50),
	"partenaire_id" integer NOT NULL,
	"famille_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "livraison" (
	"id" serial PRIMARY KEY NOT NULL,
	"autres_frais" varchar(50),
	"periode_achat" varchar(50),
	"prix_achat" varchar(50),
	"dedouanement" varchar(50),
	"prix_transport" varchar(50),
	"date_livraison" varchar(25),
	"quantite" integer,
	"partenaire_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mission" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100),
	"description" varchar(500),
	"statut" varchar(50),
	"lieu" varchar(200),
	"projet_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exemplaire" (
	"id" serial PRIMARY KEY NOT NULL,
	"num_serie" varchar(100),
	"prix" varchar(50),
	"etat" varchar(50),
	"livraison_id" integer NOT NULL,
	"produit_id" integer NOT NULL,
	"produit_code" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tache" (
	"id" serial PRIMARY KEY NOT NULL,
	"nom" varchar(100),
	"description" varchar(500),
	"statut" varchar(50),
	"date_debut" varchar(25),
	"date_fin" varchar(25),
	"responsable" varchar(100),
	"mission_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projet_exemplaire_employes" (
	"exemplaire_id" integer NOT NULL,
	"projet_id" integer NOT NULL,
	"employe_id" integer NOT NULL,
	"date_utilisation" varchar(25),
	"date_fin" varchar(25),
	"date_debut" varchar(25),
	CONSTRAINT "projet_exemplaire_employes_exemplaire_id_projet_id_employe_id_pk" PRIMARY KEY("exemplaire_id","projet_id","employe_id")
);
--> statement-breakpoint
CREATE TABLE "exemplaire_acheter" (
	"exemplaire_id" integer NOT NULL,
	"partenaire_id" integer NOT NULL,
	"lieu_livraison" varchar(200),
	"quantite" integer,
	"date_achat" varchar(25),
	CONSTRAINT "exemplaire_acheter_exemplaire_id_partenaire_id_pk" PRIMARY KEY("exemplaire_id","partenaire_id")
);
--> statement-breakpoint
CREATE TABLE "mission_employes" (
	"employe_id" integer NOT NULL,
	"mission_id" integer NOT NULL,
	CONSTRAINT "mission_employes_employe_id_mission_id_pk" PRIMARY KEY("employe_id","mission_id")
);
--> statement-breakpoint
CREATE TABLE "intervention_piece" (
	"intervention_id" integer NOT NULL,
	"piece_id" integer NOT NULL,
	CONSTRAINT "intervention_piece_intervention_id_piece_id_pk" PRIMARY KEY("intervention_id","piece_id")
);
--> statement-breakpoint
CREATE TABLE "intervention_employer" (
	"employe_id" integer NOT NULL,
	"intervention_id" integer NOT NULL,
	CONSTRAINT "intervention_employer_employe_id_intervention_id_pk" PRIMARY KEY("employe_id","intervention_id")
);
--> statement-breakpoint
CREATE TABLE "produit_intervention" (
	"produit_id" integer NOT NULL,
	"produit_code" varchar(50) NOT NULL,
	"intervention_id" integer NOT NULL,
	CONSTRAINT "produit_intervention_produit_id_produit_code_intervention_id_pk" PRIMARY KEY("produit_id","produit_code","intervention_id")
);
--> statement-breakpoint
CREATE TABLE "effectuer" (
	"partenaire_id" integer NOT NULL,
	"demande_id" integer NOT NULL,
	CONSTRAINT "effectuer_partenaire_id_demande_id_pk" PRIMARY KEY("partenaire_id","demande_id")
);
--> statement-breakpoint
ALTER TABLE "employes" ADD CONSTRAINT "employes_fonction_id_fonction_id_fk" FOREIGN KEY ("fonction_id") REFERENCES "public"."fonction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demande" ADD CONSTRAINT "demande_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit" ADD CONSTRAINT "produit_modele_id_modele_id_fk" FOREIGN KEY ("modele_id") REFERENCES "public"."modele"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit" ADD CONSTRAINT "produit_categorie_id_categorie_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categorie"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit" ADD CONSTRAINT "produit_famille_id_famille_id_fk" FOREIGN KEY ("famille_id") REFERENCES "public"."famille"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit" ADD CONSTRAINT "produit_marque_id_marque_id_fk" FOREIGN KEY ("marque_id") REFERENCES "public"."marque"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit" ADD CONSTRAINT "produit_sollicitation_id_sollicitation_id_fk" FOREIGN KEY ("sollicitation_id") REFERENCES "public"."sollicitation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_type_doc_id_type_doc_id_fk" FOREIGN KEY ("type_doc_id") REFERENCES "public"."type_doc"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partenaire" ADD CONSTRAINT "partenaire_entite_id_entite_id_fk" FOREIGN KEY ("entite_id") REFERENCES "public"."entite"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contrat" ADD CONSTRAINT "contrat_partenaire_id_partenaire_id_fk" FOREIGN KEY ("partenaire_id") REFERENCES "public"."partenaire"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_contrat_id_contrat_id_fk" FOREIGN KEY ("contrat_id") REFERENCES "public"."contrat"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_demande_id_demande_id_fk" FOREIGN KEY ("demande_id") REFERENCES "public"."demande"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projet" ADD CONSTRAINT "projet_partenaire_id_partenaire_id_fk" FOREIGN KEY ("partenaire_id") REFERENCES "public"."partenaire"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projet" ADD CONSTRAINT "projet_famille_id_famille_id_fk" FOREIGN KEY ("famille_id") REFERENCES "public"."famille"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "livraison" ADD CONSTRAINT "livraison_partenaire_id_partenaire_id_fk" FOREIGN KEY ("partenaire_id") REFERENCES "public"."partenaire"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission" ADD CONSTRAINT "mission_projet_id_projet_id_fk" FOREIGN KEY ("projet_id") REFERENCES "public"."projet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exemplaire" ADD CONSTRAINT "exemplaire_livraison_id_livraison_id_fk" FOREIGN KEY ("livraison_id") REFERENCES "public"."livraison"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exemplaire" ADD CONSTRAINT "exemplaire_produit_id_produit_code_produit_id_code_fk" FOREIGN KEY ("produit_id","produit_code") REFERENCES "public"."produit"("id","code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tache" ADD CONSTRAINT "tache_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projet_exemplaire_employes" ADD CONSTRAINT "projet_exemplaire_employes_exemplaire_id_exemplaire_id_fk" FOREIGN KEY ("exemplaire_id") REFERENCES "public"."exemplaire"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projet_exemplaire_employes" ADD CONSTRAINT "projet_exemplaire_employes_projet_id_projet_id_fk" FOREIGN KEY ("projet_id") REFERENCES "public"."projet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projet_exemplaire_employes" ADD CONSTRAINT "projet_exemplaire_employes_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exemplaire_acheter" ADD CONSTRAINT "exemplaire_acheter_exemplaire_id_exemplaire_id_fk" FOREIGN KEY ("exemplaire_id") REFERENCES "public"."exemplaire"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exemplaire_acheter" ADD CONSTRAINT "exemplaire_acheter_partenaire_id_partenaire_id_fk" FOREIGN KEY ("partenaire_id") REFERENCES "public"."partenaire"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission_employes" ADD CONSTRAINT "mission_employes_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mission_employes" ADD CONSTRAINT "mission_employes_mission_id_mission_id_fk" FOREIGN KEY ("mission_id") REFERENCES "public"."mission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention_piece" ADD CONSTRAINT "intervention_piece_intervention_id_intervention_id_fk" FOREIGN KEY ("intervention_id") REFERENCES "public"."intervention"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention_piece" ADD CONSTRAINT "intervention_piece_piece_id_piece_rechange_id_fk" FOREIGN KEY ("piece_id") REFERENCES "public"."piece_rechange"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention_employer" ADD CONSTRAINT "intervention_employer_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention_employer" ADD CONSTRAINT "intervention_employer_intervention_id_intervention_id_fk" FOREIGN KEY ("intervention_id") REFERENCES "public"."intervention"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit_intervention" ADD CONSTRAINT "produit_intervention_intervention_id_intervention_id_fk" FOREIGN KEY ("intervention_id") REFERENCES "public"."intervention"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "produit_intervention" ADD CONSTRAINT "produit_intervention_produit_id_produit_code_produit_id_code_fk" FOREIGN KEY ("produit_id","produit_code") REFERENCES "public"."produit"("id","code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "effectuer" ADD CONSTRAINT "effectuer_partenaire_id_partenaire_id_fk" FOREIGN KEY ("partenaire_id") REFERENCES "public"."partenaire"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "effectuer" ADD CONSTRAINT "effectuer_demande_id_demande_id_fk" FOREIGN KEY ("demande_id") REFERENCES "public"."demande"("id") ON DELETE no action ON UPDATE no action;