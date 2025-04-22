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

# États des Exemplaires de Produit

Les exemplaires de produits peuvent se trouver dans différents états en fonction de leur disponibilité, utilisation, ou condition. Voici une description de chaque état possible :

## 1. **Vendu**

- **Description** : L'exemplaire a été acheté par un client et n'est plus disponible à la vente.
- **Utilisation** : Ce statut est attribué après qu'un client a finalisé l'achat d'un exemplaire.

## 2. **Disponible**

- **Description** : L'exemplaire est en stock et prêt à être vendu ou expédié. Il peut être acheté immédiatement par un client.
- **Utilisation** : Quand un exemplaire est prêt à la vente, il est marqué comme "disponible".

## 3. **Utilisation**

- **Description** : L'exemplaire est en cours d'utilisation pour un projet par un employé.

## 4. **En maintenance**

- **Description** : L'exemplaire est temporairement hors service pour des réparations ou un entretien.
- **Utilisation** : Ce statut est utilisé lorsqu'un produit nécessite une intervention technique ou un entretien pour fonctionner correctement.

## 5. **Endommage**

- **Description** : L'exemplaire a subi des dommages physiques et ne peut plus être vendu dans son état actuel.
- **Utilisation** : Ce statut est utilisé lorsque le produit est cassé ou endommagé de manière irréparable ou non vendable.

## 6. **Reserve**

- **Description** : L'exemplaire est réservé pour un client ou une commande, mais l'achat n'a pas encore été finalisé.
- **Utilisation** : Un exemplaire est marqué comme "réservé" lorsqu'il est mis de côté pour une commande en attente de validation.

---

Chaque état permet de gérer l'exemplaire en fonction de son statut actuel dans le cycle de vie du produit, afin de garantir une gestion efficace et une communication claire sur la disponibilité des produits.

# Gestion des Produits : Équipements vs Outils

Dans ce module, les produits sont classés en deux grandes catégories grâce à la table `type_produit` :

- **Équipements** : produits destinés à être **vendus**.
- **Outils** : produits destinés à être **utilisés** par les employés sur le terrain.

---

## 🛠️ Outils

Les outils sont utilisés dans les chantiers ou les projets internes. Leur gestion inclut :

- **Sortie d’outil** : l’outil est attribué à un employé.
- **Suivi d’état** : on note l’état de l’outil avant et après utilisation.
- **Retour d’outil** : lorsqu’un outil revient, on met à jour sa fiche d’usage.

Ces données sont stockées dans la table `usage_exemplaires`.

---

## 📦 Équipements

Les équipements, quant à eux, suivent une logique de **stock** et de **vente**. Ils sont considérés comme des biens destinés à être cédés aux partenaires ou clients. La logique de gestion de stock inclut :

- Suivi des exemplaires disponibles.
- Passage de commande.
- Réduction du stock après vente.

---

## 🔍 Résumé

| Type de produit | Usage principal     | Logique associée       |
| --------------- | ------------------- | ---------------------- |
| Équipement      | Vente               | Stock / Commande       |
| Outil           | Utilisation terrain | Sortie / Retour / État |

Cette distinction permet d’adapter les traitements métier à la nature réelle du produit.
