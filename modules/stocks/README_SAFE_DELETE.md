# Suppression Sécurisée des Commandes

## Vue d'ensemble

Ce module fournit des fonctions sécurisées pour la suppression des commandes avec gestion intelligente des contraintes et validation préalable.

## Fonctions Disponibles

### 1. `safeDeleteCommande(idCommande, type)`

**Description** : Supprime une commande de manière sécurisée en respectant les contraintes métier.

**Paramètres** :
- `idCommande` (number) : ID de la commande à supprimer
- `type` (string) : Type de sortie ("vente_directe" ou "vente en ligne")

**Restrictions** :
- ❌ Impossible de supprimer une commande **livrée**
- ❌ Impossible de supprimer une commande **facturée**
- ❌ Impossible de supprimer une commande sans exemplaires associés

**Processus** :
1. Vérification des restrictions
2. Libération des exemplaires (état → "Disponible")
3. Mise à jour des stocks des produits
4. Suppression des liaisons (`sortie_exemplaires`, `commande_produits`)
5. Suppression de la commande

**Retour** :
```json
{
  "success": true,
  "removed_exemplaires": [1, 2, 3],
  "message": "Commande supprimée avec succès. 3 exemplaires remis en stock.",
  "details": {
    "commande_id": 123,
    "exemplaires_liberes": 3,
    "produits_affectes": 2
  }
}
```

### 2. `validateSafeDeleteCommande(idCommande)`

**Description** : Valide si une commande peut être supprimée sans exécuter la suppression.

**Paramètres** :
- `idCommande` (number) : ID de la commande à valider

**Vérifications** :
- ✅ Existence de la commande
- ✅ État de la commande (non livrée/facturée)
- ✅ Présence d'exemplaires associés
- ✅ Capacité de stock disponible

**Retour** :
```json
{
  "canDelete": true,
  "details": {
    "commande_id": 123,
    "exemplaires_associes": 3,
    "produits_affectes": 2,
    "message": "La commande peut être supprimée en toute sécurité"
  }
}
```

## Routes API

### Validation préalable
```
GET /stocks/commandes/:id/validate-delete
```

**Exemple de réponse positive** :
```json
{
  "success": true,
  "message": "La commande peut être supprimée en toute sécurité",
  "commande_id": 123,
  "exemplaires_associes": 3,
  "produits_affectes": 2
}
```

**Exemple de réponse négative** :
```json
{
  "success": false,
  "error": "Impossible de supprimer une commande avec l'état \"livree\"",
  "code": "COMMANDE_LIVREE_OR_FACTUREE",
  "etat_actuel": "livree",
  "etats_interdits": ["livree"],
  "message": "Seules les commandes non livrées peuvent être supprimées"
}
```

### Suppression sécurisée
```
DELETE /stocks/commandes/:id/:type_sortie
```

## Codes d'Erreur

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `COMMANDE_NOT_FOUND` | Commande introuvable | 404 |
| `COMMANDE_LIVREE_OR_FACTUREE` | Commande livrée ou facturée | 403 |
| `NO_EXEMPLAIRES_ASSOCIATED` | Aucun exemplaire associé | 400 |
| `STOCK_CAPACITY_EXCEEDED` | Capacité de stock dépassée | 400 |
| `VALIDATION_ERROR` | Erreur de validation | 500 |
| `INTERNAL_ERROR` | Erreur interne du serveur | 500 |

## Cas d'Usage Recommandés

### 1. Validation préalable
```javascript
// Vérifier si la suppression est possible
const validation = await fetch('/stocks/commandes/123/validate-delete');
const result = await validation.json();

if (result.success) {
  // Procéder à la suppression
  await deleteCommande(123);
} else {
  // Afficher l'erreur à l'utilisateur
  console.error(result.error);
}
```

### 2. Suppression directe
```javascript
// Suppression immédiate (avec gestion d'erreur)
try {
  const result = await deleteCommande(123, 'vente_directe');
  console.log('Commande supprimée:', result.message);
} catch (error) {
  if (error.code === 'COMMANDE_LIVREE_OR_FACTUREE') {
    console.error('Impossible de supprimer une commande livrée');
  }
}
```

## Gestion des Erreurs

### Erreurs de Contrainte Métier
- **Commande livrée** : Utiliser `forceDeleteCommande` si nécessaire
- **Stock insuffisant** : Vérifier la capacité avant suppression
- **Exemplaires manquants** : Vérifier l'intégrité des données

### Erreurs Techniques
- **Base de données** : Vérifier la connectivité et les permissions
- **Validation** : Vérifier les paramètres d'entrée
- **Transaction** : Vérifier l'intégrité des données

## Bonnes Pratiques

1. **Toujours valider** avant de supprimer
2. **Gérer les erreurs** avec des codes spécifiques
3. **Logger les opérations** pour audit
4. **Tester les cas limites** (stock maximum, exemplaires multiples)
5. **Utiliser les transactions** pour garantir la cohérence

## Migration depuis l'Ancien Code

### Avant
```javascript
// Ancienne approche sans validation
const result = await safeDeleteCommande(id);
```

### Après
```javascript
// Nouvelle approche avec validation
const validation = await validateSafeDeleteCommande(id);
if (validation.canDelete) {
  const result = await safeDeleteCommande(id);
} else {
  // Gérer l'erreur selon le code
  handleValidationError(validation);
}
``` 