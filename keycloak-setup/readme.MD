# Commande d'intitialisation 
node .\keycloak-setup\keycloak-setup.js # A partir de la racine
# Comment protéger une route
router.get("/", protect(['Gestion_administration', ]), controller.getPartenaires);

