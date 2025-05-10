const { db } = require('../../../core/database/config');
const { commandes, commande_produits, clients_en_ligne, produits } = require("../../../core/database/models");
const { eq, desc, and } = require("drizzle-orm");
const nodemailer = require('nodemailer');

// Configuration de Nodemailer avec les variables d'environnement
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'node180-eu.n0c.com',
  port: process.env.EMAIL_PORT || 465,
  secure: true, // true pour le port 465, false pour les autres ports comme 587
  auth: {
    user: process.env.EMAIL_USER || 'sales@dcat.ci',
    pass: process.env.EMAIL_PASSWORD || 'Dcat@2018!'
  }
});

// Adresse email d'expédition
const emailFrom = process.env.EMAIL_FROM || '"DCAT" <sales@dcat.ci>';

const commandesService = {
  // Créer une nouvelle commande
  createCommande: async (commandeData) => {
    // console.log(commandeData); // Commenté pour éviter interférence potentielle avec la réponse JSON
    // Commencer une transaction pour assurer l'intégrité des données
    return await db.transaction(async (tx) => {
      try {
        // 1. Insérer la commande
        const commandeInserted = await tx.insert(commandes).values({
          date_de_commande: new Date(),
          etat_commande: 'En cours', // Etat initial correct
          lieu_de_livraison: commandeData.lieu_de_livraison,
          mode_de_paiement: commandeData.mode_de_paiement,
          id_client: commandeData.id_client,
        }).returning();
        
        const commande = commandeInserted[0];
        
        // 2. Insérer les produits de la commande
        if (commandeData.produits && commandeData.produits.length > 0) {
          for (const produitItem of commandeData.produits) {
            // Récupérer le prix actuel du produit
            const productDetails = await tx.select({ prix_produit: produits.prix_produit })
              .from(produits)
              .where(eq(produits.id_produit, produitItem.id_produit))
              .limit(1);

            if (productDetails.length === 0) {
              throw new Error(`Produit avec ID ${produitItem.id_produit} non trouvé.`);
            }
            const prixUnitaire = productDetails[0].prix_produit;

            await tx.insert(commande_produits).values({
              id_commande: commande.id_commande,
              id_produit: produitItem.id_produit,
              quantite: produitItem.quantite,
              prix_unitaire: prixUnitaire // Utiliser le prix récupéré
            });
          }
        }
        
        // 3. Envoyer les notifications après la transaction
        const client = await tx.select().from(clients_en_ligne)
          .where(eq(clients_en_ligne.id_client, commandeData.id_client))
          .limit(1);
        
        const admins = await tx.select().from(clients_en_ligne)
          .where(eq(clients_en_ligne.role, 'admin'));
        
        // Retourner la commande pour l'envoyer dans les notifications après la transaction
        return {
          commande: commande,
          client: client[0],
          admins: admins
        };
      } catch (error) {
        throw error;
      }
    }).then(async (result) => {
      // Envoi des notifications après la transaction réussie
      await commandesService.sendNotifications(result.commande, result.client, result.admins);
      return result.commande;
    });
  },

  // Envoyer des notifications par email
  sendNotifications: async (commande, client, admins) => {
    try {
      // Email au client
      if (client && client.email) {
        await transporter.sendMail({
          from: emailFrom,
          to: client.email,
          subject: `Commande #${commande.id_commande} confirmée`,
          html: `
            <h1>Votre commande a été reçue</h1>
            <p>Cher(e) ${client.nom},</p>
            <p>Nous avons bien reçu votre commande #${commande.id_commande}.</p>
            <p>Détails de la commande:</p>
            <ul>
              <li>Date: ${new Date(commande.date_de_commande).toLocaleDateString()}</li>
              <li>Statut: ${commande.etat_commande}</li>
              <li>Lieu de livraison: ${commande.lieu_de_livraison}</li>
              <li>Mode de paiement: ${commande.mode_de_paiement}</li>
            </ul>
            <p>Un de nos agents vous contactera prochainement pour confirmer la livraison.</p>
            <p>Merci pour votre confiance!</p>
            <p>L'équipe DCAT</p>
          `
        });
      }

      // Email aux administrateurs
      if (admins && admins.length > 0) {
        const adminEmails = admins.map(admin => admin.email).filter(email => email);
        
        if (adminEmails.length > 0) {
          await transporter.sendMail({
            from: emailFrom,
            to: adminEmails.join(','),
            subject: `Nouvelle commande #${commande.id_commande}`,
            html: `
              <h1>Nouvelle commande reçue</h1>
              <p>Une nouvelle commande a été passée et nécessite votre attention.</p>
              <p>Détails de la commande:</p>
              <ul>
                <li>Commande #: ${commande.id_commande}</li>
                <li>Client: ${client ? client.nom : 'N/A'} (ID: ${commande.id_client})</li>
                <li>Date: ${new Date(commande.date_de_commande).toLocaleDateString()}</li>
                <li>Statut: ${commande.etat_commande}</li>
                <li>Lieu de livraison: ${commande.lieu_de_livraison}</li>
                <li>Mode de paiement: ${commande.mode_de_paiement}</li>
              </ul>
              <p>Veuillez contacter le client pour confirmer les détails de livraison.</p>
            `
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des notifications:', error);
      // Ne pas bloquer le processus si l'envoi d'email échoue
    }
  },

  // Récupérer une commande par son ID
  getCommandeById: async (id) => {
    const commandeResult = await db
      .select()
      .from(commandes)
      .where(eq(commandes.id_commande, id))
      .limit(1);
    
    if (commandeResult.length === 0) {
      throw new Error("Commande non trouvée");
    }
    
    const commande = commandeResult[0];
    
    // Récupérer les produits associés à la commande (utilisera le prix_unitaire)
    const produitsResult = await commandesService.getCommandeProducts(id);
    
    // Calculer le montant total en utilisant le prix_unitaire (maintenant dans item.prix)
    let montantTotal = 0;
    if (produitsResult.length > 0) {
      montantTotal = produitsResult.reduce((total, item) => {
        // item.prix contient maintenant le prix_unitaire de commande_produits
        return total + (parseFloat(item.prix) * item.quantite);
      }, 0);
    }
    
    // S'assurer de retourner un objet unique et non un tableau
    return {
      ...commande,
      produits: produitsResult,
      montant_total: montantTotal
    };
  },

  // Récupérer les produits d'une commande
  getCommandeProducts: async (commandeId) => {
    const result = await db
      .select({
        id_produit: produits.id_produit,
        designation: produits.desi_produit,
        description: produits.desc_produit,
        prix: commande_produits.prix_unitaire, // Utiliser le prix_unitaire de la table commande_produits
        quantite: commande_produits.quantite,
        image: produits.image_produit
      })
      .from(commande_produits)
      .innerJoin(produits, eq(commande_produits.id_produit, produits.id_produit))
      .where(eq(commande_produits.id_commande, commandeId));
    
    return result;
  },

  // Récupérer l'historique des commandes d'un client
  getClientCommandes: async (clientId) => {
    return await db
      .select()
      .from(commandes)
      .where(eq(commandes.id_client, clientId))
      .orderBy(desc(commandes.created_at));
  },

  // Récupérer les commandes par état
  getCommandesByStatus: async (status) => {
    return await db
      .select()
      .from(commandes)
      .where(eq(commandes.etat_commande, status))
      .orderBy(desc(commandes.created_at));
  },

  // Mettre à jour le statut d'une commande
  updateCommandeStatus: async (id, etatCommande) => {
    // Vérifier que l'état est valide
    const etatsValides = ['En cours', 'Validé', 'Livré', 'Annulé', 'Retourné'];
    
    if (!etatsValides.includes(etatCommande)) {
      throw new Error(`État de commande invalide. Les états valides sont: ${etatsValides.join(', ')}`);
    }
    
    // Vérifier si la commande existe
    const commandeExistante = await db
      .select()
      .from(commandes)
      .where(eq(commandes.id_commande, id))
      .limit(1);
    
    if (commandeExistante.length === 0) {
      throw new Error("Commande non trouvée");
    }
    
    // Mettre à jour l'état de la commande
    const result = await db
      .update(commandes)
      .set({
        etat_commande: etatCommande,
        updated_at: new Date()
      })
      .where(eq(commandes.id_commande, id))
      .returning();
    
    return result[0];
  },

  // Mettre à jour la date de livraison
  updateLivraisonDate: async (id, dateLivraison) => {
    // Vérifier si la commande existe
    const commandeExistante = await db
      .select()
      .from(commandes)
      .where(eq(commandes.id_commande, id))
      .limit(1);
    
    if (commandeExistante.length === 0) {
      throw new Error("Commande non trouvée");
    }
    
    // Valider la date de livraison
    const dateObj = new Date(dateLivraison);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Date de livraison invalide");
    }
    
    // Mettre à jour la date de livraison
    const result = await db
      .update(commandes)
      .set({
        date_livraison: dateObj,
        updated_at: new Date()
      })
      .where(eq(commandes.id_commande, id))
      .returning();
    
    return result[0];
  },

  // Mettre à jour à la fois le statut et la date de livraison
  updateCommandeStatusAndDate: async (id, etatCommande, dateLivraison) => {
    // Vérifier que l'état est valide
    const etatsValides = ['En cours', 'Validé', 'Livré', 'Annulé', 'Retourné'];
    
    if (!etatsValides.includes(etatCommande)) {
      throw new Error(`État de commande invalide. Les états valides sont: ${etatsValides.join(', ')}`);
    }
    
    // Vérifier si la commande existe
    const commandeExistante = await db
      .select()
      .from(commandes)
      .where(eq(commandes.id_commande, id))
      .limit(1);
    
    if (commandeExistante.length === 0) {
      throw new Error("Commande non trouvée");
    }
    
    // Valider la date de livraison si elle est fournie
    let updateData = {
      etat_commande: etatCommande,
      updated_at: new Date()
    };
    
    if (dateLivraison) {
      const dateObj = new Date(dateLivraison);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Date de livraison invalide");
      }
      updateData.date_livraison = dateObj;
    }
    
    // Mettre à jour la commande
    const result = await db
      .update(commandes)
      .set(updateData)
      .where(eq(commandes.id_commande, id))
      .returning();
    
    return result[0];
  }
};

module.exports = commandesService;