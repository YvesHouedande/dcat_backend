CREATE TABLE "intervention_enployer" (
	"employe_id" integer NOT NULL,
	"intervention_id" integer NOT NULL,
	CONSTRAINT "intervention_enployer_employe_id_intervention_id_pk" PRIMARY KEY("employe_id","intervention_id")
);
--> statement-breakpoint
ALTER TABLE "contrat" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "intervention_employer" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "contrat" CASCADE;--> statement-breakpoint
DROP TABLE "intervention_employer" CASCADE;--> statement-breakpoint
ALTER TABLE "intervention" DROP CONSTRAINT "intervention_contrat_id_contrat_id_fk";
--> statement-breakpoint
ALTER TABLE "intervention" DROP CONSTRAINT "intervention_demande_id_demande_id_fk";
--> statement-breakpoint
ALTER TABLE "produit_intervention" DROP CONSTRAINT "produit_intervention_produit_id_produit_code_produit_id_code_fk";
--> statement-breakpoint
ALTER TABLE "effectuer" DROP CONSTRAINT "effectuer_demande_id_demande_id_fk";
--> statement-breakpoint
ALTER TABLE "piece_rechange" ALTER COLUMN "quantite" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "produit" ALTER COLUMN "quantite" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "intervention" ALTER COLUMN "date" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "intervention" ALTER COLUMN "cause_defaillance" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "intervention" ALTER COLUMN "rapport_intervention" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "intervention" ALTER COLUMN "superviseur" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "intervention" ALTER COLUMN "lieu" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "livraison" ALTER COLUMN "quantite" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "exemplaire" ALTER COLUMN "etat" SET DATA TYPE etat_exemplaire;--> statement-breakpoint
ALTER TABLE "exemplaire" ALTER COLUMN "etat" SET DEFAULT 'disponible';--> statement-breakpoint
ALTER TABLE "exemplaire" ALTER COLUMN "etat" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exemplaire_acheter" ALTER COLUMN "quantite" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "intervention" ADD COLUMN "sollicitation_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "intervention_enployer" ADD CONSTRAINT "intervention_enployer_employe_id_employes_id_fk" FOREIGN KEY ("employe_id") REFERENCES "public"."employes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention_enployer" ADD CONSTRAINT "intervention_enployer_intervention_id_intervention_id_fk" FOREIGN KEY ("intervention_id") REFERENCES "public"."intervention"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_sollicitation_id_sollicitation_id_fk" FOREIGN KEY ("sollicitation_id") REFERENCES "public"."sollicitation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "effectuer" ADD CONSTRAINT "effectuer_demande_id_sollicitation_id_fk" FOREIGN KEY ("demande_id") REFERENCES "public"."sollicitation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intervention" DROP COLUMN "contrat_id";--> statement-breakpoint
ALTER TABLE "intervention" DROP COLUMN "demande_id";--> statement-breakpoint
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_sollicitation_id_unique" UNIQUE("sollicitation_id");