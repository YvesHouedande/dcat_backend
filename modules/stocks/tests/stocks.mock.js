module.exports = {
  famille: [
    {
      id: 1,
      libelle: "Informatique"
    },
    {
      id: 2,
      libelle: "Bureautique"
    }
  ],

  categorie: [
    {
      id: 1,
      libelle: "Périphérique"
    },
    {
      id: 2,
      libelle: "Composant"
    }
  ],

  modele: [
    {
      id: 1,
      libelle: "ProBook 450"
    },
    {
      id: 2,
      libelle: "ThinkPad X1"
    }
  ],

  marque: [
    {
      id: 1,
      libelle: "HP"
    },
    {
      id: 2,
      libelle: "Lenovo"
    }
  ],

  fonction: [
    {
      id: 1,
      nom: "Développeur"
    },
    {
      id: 2,
      nom: "Chef de projet"
    }
  ],

  employes: [
    {
      id: 1,
      nom: "Dupont",
      keycloak_id: "a1b2c3d4-e5f6-7890",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      contact: "+123456789",
      adresse: "123 Rue Example, Ville",
      status: "Actif",
      fonctionId: 1
    },
    {
      id: 2,
      nom: "Martin",
      keycloak_id: "b2c3d4e5-f6g7-8901",
      prenom: "Sophie",
      email: "sophie.martin@example.com",
      contact: "+987654321",
      adresse: "456 Avenue Test, Ville",
      status: "Actif",
      fonctionId: 2
    }
  ],

  demande: [
    {
      id: 1,
      dateDebut: "2025-01-15",
      status: "En cours",
      dateFin: "2025-01-30",
      motif: "Besoin d'un nouvel ordinateur",
      type: "Matériel",
      employeId: 1
    }
  ],

  typeDoc: [
    {
      id: 1,
      libelle: "Contrat"
    },
    {
      id: 2,
      libelle: "Facture"
    }
  ],

  entite: [
    {
      id: 1,
      libelle: "Direction"
    },
    {
      id: 2,
      libelle: "Service Technique"
    }
  ],

  produit: [
    {
      id: 1,
      code: "PROD001",
      nom: "Ordinateur portable",
      description: "Ordinateur portable haute performance",
      type: "Matériel",
      image: "images/prod001.jpg",
      quantite: "10",
      modeleId: 1,
      categorieId: 1,
      familleId: 1,
      marqueId: 1
    }
  ],

  documents: [
    {
      id: 1,
      titre: "Contrat de travail",
      fichier: "docs/contrat.pdf",
      dateAjout: "2025-01-10",
      employeId: 1,
      typeDocId: 1
    }
  ],

  partenaire: [
    {
      id: 1,
      nom: "TechSolutions Inc.",
      telephone: "+1234567890",
      email: "contact@techsolutions.com",
      specialite: "Informatique",
      localisation: "123 Business Ave, City",
      type: "Fournisseur",
      entiteId: 1
    }
  ],

  contrat: [
    {
      id: 1,
      nom: "Contrat de maintenance",
      duree: "1 an",
      dateDebut: "2025-01-01",
      dateFin: "2025-12-31",
      lien: "contrats/2025/maintenance.pdf",
      partenaireId: 1
    }
  ],

  intervention: [
    {
      id: 1,
      date: "2025-02-15",
      causeDefaillance: "Panne matérielle",
      rapport: "rapports/interv001.pdf",
      typeMaintenance: "Corrective",
      typeDefaillance: "Matérielle",
      superviseur: "M. Responsable",
      duree: "2 heures",
      numero: "INT-2025-001",
      lieu: "Bureau 101",
      contratId: 1
    }
  ],

  projet: [
    {
      id: 1,
      nom: "Migration vers Windows 11",
      type: "IT",
      devis: "DEV-2025-001",
      dateDebut: "2025-03-01",
      dateFin: "2025-06-30",
      duree: "4 mois",
      description: "Migration de tous les postes vers Windows 11",
      etat: "En cours",
      partenaireId: 1,
      familleId: 1
    }
  ],

  livraison: [
    {
      id: 1,
      autresFrais: "50",
      periodeAchat: "Mars 2025",
      prixAchat: "1200",
      dedouanement: "100",
      prixTransport: "150",
      dateLivraison: "2025-03-15",
      quantite: "5",
      partenaireId: 1
    }
  ],

  mission: [
    {
      id: 1,
      nom: "Déploiement pilote",
      description: "Déploiement initial sur 10 postes tests",
      statut: "En cours",
      lieu: "Siège social",
      projetId: 1
    }
  ],

  exemplaire: [
    {
      id: 1,
      numSerie: "SN123456789",
      prix: "1250",
      etat: "Neuf",
      livraisonId: 1,
      produitId: 1,
      produitCode: "PROD001"
    }
  ],

  tache: [
    {
      id: 1,
      nom: "Installation OS",
      description: "Installation de Windows 11 sur les postes",
      statut: "En cours",
      dateDebut: "2025-03-10",
      dateFin: "2025-03-12",
      responsable: "Technicien IT",
      missionId: 1
    }
  ],

  projetExemplaireEmployes: [
    {
      exemplaireId: 1,
      projetId: 1,
      employeId: 1,
      dateUtilisation: "2025-03-16",
      dateFin: "2025-06-30",
      dateDebut: "2025-03-16"
    }
  ],

  exemplaireAcheter: [
    {
      exemplaireId: 1,
      partenaireId: 1,
      lieuLivraison: "Entrepôt principal",
      quantite: "1",
      dateAchat: "2025-03-10"
    }
  ],

  missionEmployes: [
    {
      employeId: 1,
      missionId: 1
    }
  ],

  interventionProduit: [
    {
      exemplaireId: 1,
      interventionId: 1
    }
  ],

  interventionEmploye: [
    {
      employeId: 1,
      interventionId: 1
    }
  ],

  sollicitationProduits: [
    {
      produitId: 1,
      produitCode: "PROD001",
      partenaireId: 1,
      etat: "En attente",
      description: "Besoin de pièces de rechange"
    }
  ],

  sollicitationInterventions: [
    {
      partenaireId: 1,
      interventionId: 1,
      etat: "Terminé",
      description: "Intervention urgente réalisée"
    }
  ]
};