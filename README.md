# dcat_backend

## comande d'installation
npm install drizzle-orm drizzle-kit pg dotenv
npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit push
npx drizzle-kit generate


### commandes soro

git branch -r
git branch -a
git fetch --all
git checkout -b  flutter_backend 
git pull origin dev
git push origin backend_flutter:dev

git branch --set-upstream-to=origin/flutter_backend flutter_backend


INSERT INTO "projet" (
    "nom",
    "type",
    "devis",
    "date_debut",
    "date_fin",
    "duree",
    "description",
    "etat",
    "partenaire_id",
    "famille_id"
) VALUES (
    'Construction Site Alpha',
    'Construction',
    500000,  -- Suppression des apostrophes si c'est un nombre
    '2024-04-01',
    '2024-12-31',
    '9 mois',  -- Vérifie si le type est bien `TEXT`, sinon adapte-le
    'Projet de construction d''un nouveau bâtiment commercial dans la zone industrielle',
    'En cours',
    NULL,  -- Mettre une valeur correcte ou NULL si possible
    NULL   -- Idem pour famille_id
);

# it's me 


### mes confgois locals 


DB_HOST=localhost
DB_PORT=5432
DB_NAME=dcat_erp_database
DB_USER=postgres
DB_PASSWORD=sorosamuel


## Config AxelOssoui 🔧 Problème de connexion à PostgreSQL hébergé sur WSL Linux

Lors de la connexion à la base de données **PostgreSQL** hébergée sur **WSL Linux**, un problème est survenu.  
Ce problème était dû à un mauvais format de **séquence de fin de ligne** dans certains fichiers de configuration.

### ✅ Solution appliquée :
Nous avons corrigé ce problème en changeant la **séquence de fin de ligne** des fichiers suivants :

- **`.env`** : Passé de `"CRLF"` ➝ `"LF"`
- **`init-db/init-multiple-dbs.sh`** : Passé de `"CRLF"` ➝ `"LF"`

### ⚠️ Pourquoi ?
Le format **"CRLF"** est utilisé sous **Windows**, tandis que **"LF"** est standard sous **Linux**.  
**PostgreSQL sous WSL attend des fichiers en "LF"**, et un mauvais format peut empêcher le bon fonctionnement des scripts.
