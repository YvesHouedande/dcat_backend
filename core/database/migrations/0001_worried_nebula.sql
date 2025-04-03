ALTER TABLE "employes" ADD COLUMN "keycloak_id" varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE "employes" ADD CONSTRAINT "employes_keycloak_id_unique" UNIQUE("keycloak_id");