## Gestion des erreurs de migration Drizzle ORM

Si vous rencontrez l'erreur suivante lors de l'exécution de :

```sh
npx drizzle-kit migrate
```

```sh
error: password authentication failed for user "dcat_user"
    at D:\dcat_backend\node_modules\pg-pool\index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async PgDialect.migrate (D:\dcat_backend\node_modules\src\pg-core\dialect.ts:85:3)
    at async migrate (D:\dcat_backend\node_modules\src\node-postgres\migrator.ts:10:2) {
  length: 105,
  severity: 'FATAL',
  code: '28P01',
```

### Solution :
Assurez-vous que les fichiers suivants utilisent bien le format de fin de ligne `LF` et non `CRLF` :
- `init-db/init-multiple-dbs.sh`
- `.env`

Pour convertir ces fichiers sous Linux/macOS :
```sh
dos2unix init-db/init-multiple-dbs.sh .env
```

Sous Windows, utilisez un éditeur de texte comme VS Code et modifiez le format de fin de ligne en `LF`.
