const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const config = {
  user: process.env.APP_DB_USER,
  password: process.env.APP_DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.APP_DB_NAME
};

// Dossier de sauvegarde (relatif au projet)
const backupDir = path.join(__dirname, '../backup'); // Nom du dossier en minuscules

// Création du dossier s'il n'existe pas
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Nom du fichier avec date ISO (YYYY-MM-DD)
const dateStr = new Date().toISOString().split('T')[0];
const backupFile = path.join(backupDir, `backup_${dateStr}.sql`);

// Construction de la commande
const connectionString = `postgresql://${config.user}:${encodeURIComponent(config.password)}@${config.host}:${config.port}/${config.database}`;
const cmd = `npx pg-dump "${connectionString}" > "${backupFile}"`;

console.log(`Sauvegarde en cours vers: ${backupFile}`);

// Exécution
exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erreur:', error.message);
    if (fs.existsSync(backupFile)) {
      fs.unlinkSync(backupFile); // Supprime le fichier partiel en cas d'erreur
    }
    process.exit(1);
  }

  // Vérification que le fichier a bien été créé
  if (fs.existsSync(backupFile)) {
    const stats = fs.statSync(backupFile);
    if (stats.size > 0) {
      console.log(`✅ Sauvegarde réussie (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      console.log(`📁 Emplacement: ${backupFile}`);
    } else {
      console.error('⚠ Le fichier de sauvegarde est vide');
      fs.unlinkSync(backupFile);
    }
  } else {
    console.error('⚠ Le fichier de sauvegarde n\'a pas été créé');
  }
});