# Utilise une image Node.js officielle
FROM node:18-alpine

# Crée le dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste du projet
COPY . .

# Déclare la variable d’environnement pour le port
ENV PORT=3001

# Expose le port utilisé par l’application
EXPOSE 3001

# Commande de démarrage
CMD ["npm", "start"]