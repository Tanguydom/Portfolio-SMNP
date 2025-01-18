# Utiliser une image légère officielle de Node.js
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installer les dépendances en mode production (modification si développement)
ARG NODE_ENV=production
RUN npm install

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Exposer le port 8080 pour Node.js
EXPOSE 8080

# Définir la commande de démarrage
CMD ["node", "index.js"]
