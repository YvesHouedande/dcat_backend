# dcat_backend

## comande d'installation
npm install drizzle-orm drizzle-kit pg dotenv
npx drizzle-kit generate
npx drizzle-kit push
npx drizzle-kit generate


### commandes soro
git fetch --all
git branch -r
git branch -a
git branch checkout nom_branch
git push origin backend_flutter:dev
npx drizzle-kit push --rollback

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
