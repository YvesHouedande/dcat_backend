// const { db } = require('../../../core/database/config');
// const { employes, fonctions } = require('../../../core/database/models');
// const { eq } = require('drizzle-orm');
// const logger = require('../../../core/utils/logger');

// module.exports = {
//   syncUser: async (req, res) => {
//     const token = req.kauth.grant.access_token;
//     // const { email, firstName, lastName } = req.body;
//     // const { email } = req.body;


//     logger.warn("token content############", token?.content)
//     logger.warn("token content############", token?.content.email)

//     // if(token)


//     // Validation email/token
//     // if (!token?.content?.email || !email) {
//     //   logger.warn('Token ou email manquant', { token, email });
//     //   return res.status(400).json({ error: "Token ou email invalide" });
//     // }

//     // if (token.content.email !== email) {
//     //   logger.warn('Incohérence email/token', {
//     //     tokenEmail: token.content.email,
//     //     providedEmail: email,
//     //     userId: token.content.sub
//     //   });
//     //   return res.status(400).json({ error: "Email ne correspond pas au token" });
//     // }


//     try {
//       // Récupération de l'ID de la fonction Technicien
//       const technicien = await db.select()
//         .from(fonctions)
//         .where(eq(fonctions.nom_fonction, 'Technicien'))
//         .limit(1);
//       console.log("Résultat recherche Technicien:", technicien);

//       if (!technicien || technicien.length === 0) {
//         throw new Error('La fonction Technicien n\'existe pas en base');
//       }

//       const fonctionId = technicien[0].id;

//       // Données utilisateur
//       const userData = {
//         keycloak_id: token.content.sub,
//         email_employes: token.content.email,
//         nom_employes: token.content.family_name,
//         prenom_employes: token.content.given_name,
//         status: 'actif',
//         fonctionId: fonctionId,
//         created_at: new Date(),
//         updated_at: new Date()
//       };

//       // Upsert
//       await db.insert(employes)
//         .values(userData)
//         .onConflictDoUpdate({
//           target: employes.keycloak_id,
//           set: {
//             email: userData.email,
//             nom: userData.nom,
//             prenom: userData.prenom,
//             fonctionId: fonctionId,
//             updated_at: userData.updated_at
//           }
//         });

//       res.status(204).end();
//     } catch (error) {
//       logger.error('Erreur de synchronisation', {
//         error: error.message,
//         userId: token.content.sub,
//         email: token.content.email
//       });

//       if (error.message.includes('Technicien')) {
//         res.status(400).json({ 
//           error: "Configuration manquante",
//           details: "La fonction Technicien doit être créée en base de données"
//         });
//       } else {
//         res.status(500).json({ 
//           error: "Échec de la synchronisation",
//           details: error.message
//         });
//       }
//     }
//   }
// };



const { db } = require('../../../core/database/config');
const { employes, fonctions } = require('../../../core/database/models');
const { eq } = require('drizzle-orm');
const logger = require('../../../core/utils/logger');

module.exports = {
  // syncUser: async (req, res) => {
  //   try {
  //     // Récupération propre du token
  //     const token = req.kauth?.grant?.access_token;

  //     if (!token?.content) {
  //       logger.warn('Pas de contenu dans le token', { token });
  //       return res.status(400).json({ error: "Token invalide" });
  //     }

  //     const { email, family_name, given_name, sub } = token.content;

  //     logger.warn("Contenu du token récupéré :", { email, family_name, given_name, sub });

  //     // Vérification des données essentielles
  //     if (!email || !family_name || !given_name || !sub) {
  //       logger.warn('Données incomplètes dans le token', { tokenContent: token.content });
  //       return res.status(400).json({ error: "Données utilisateur incomplètes dans le token" });
  //     }

  //     // Récupération de l'ID de la fonction Technicien
  //     const technicien = await db.select()
  //       .from(fonctions)
  //       .where(eq(fonctions.nom_fonction, 'Technicien'))
  //       .limit(1);

  //     console.log("Résultat recherche Technicien:", technicien);

  //     if (!technicien || technicien.length === 0) {
  //       throw new Error('La fonction Technicien n\'existe pas en base');
  //     }

  //     const fonctionId = technicien[0].id_fonction;

  //     logger.warn("//////////////////////////////",technicien[0])
  //     logger.warn("//////////////////////////////",technicien[0].id_fonction)



  //     // Préparation des données utilisateur
  //     const userData = {
  //       keycloak_id: sub,
  //       email_employes: email,
  //       nom_employes: family_name,
  //       prenom_employes: given_name,
  //       status: 'actif',
  //       id_fonction: fonctionId,
  //       created_at: new Date(),
  //       updated_at: new Date()
  //     };

  //     // Upsert employé
  //     await db.insert(employes)
  //       .values(userData)
  //       .onConflictDoUpdate({
  //         target: employes.keycloak_id,
  //         set: {
  //           email_employes: userData.email_employes,
  //           nom_employes: userData.nom_employes,
  //           prenom_employes: userData.prenom_employes,
  //           fonctionId: fonctionId,
  //           updated_at: userData.updated_at
  //         }
  //       });

  //     res.status(204).end();

  //   } catch (error) {
  //     logger.error('Erreur de synchronisation', {
  //       message: error.message,
  //       stack: error.stack
  //     });

  //     if (error.message.includes('Technicien')) {
  //       res.status(400).json({
  //         error: "Configuration manquante",
  //         details: "La fonction Technicien doit être créée en base de données"
  //       });
  //     } else {
  //       res.status(500).json({
  //         error: "Échec de la synchronisation",
  //         details: error.message
  //       });
  //     }
  //   }
  // }

  syncUser: async (req, res) => {
    const event = req.body;
    console.log("Event received from Keycloak:", event);
  
    // Synchroniser avec ta base de données ici
    // Par exemple : si event.type === 'REGISTER' => créer l'utilisateur
  
    res.sendStatus(204); // OK
  },

}