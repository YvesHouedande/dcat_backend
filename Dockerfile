# Étape 1 : Builder les dépendances
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev  # Installe uniquement les dépendances de production

# Étape 2 : Image finale
FROM node:18-alpine

WORKDIR /app

# Copie des dépendances et du code
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Sécurité
RUN chown -R node:node /app \
    && apk add --no-cache tini  # Pour gérer correctement les signaux
USER node

# Port exposé (doit correspondre à votre .env)
EXPOSE 2000

# Point d'entrée avec Tini pour éviter les zombies
ENTRYPOINT ["/sbin/tini", "--"]

# Commande de démarrage (utilise la variable PORT depuis .env)
CMD node server.js