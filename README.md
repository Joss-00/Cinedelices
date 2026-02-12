# CinéDélices

Projet final réalisé dans le cadre de la formation Développeur Web & Web Mobile (O’clock).  
Créé par Josselin Dréan, Maxime Lagraa, David Bache et Pierre Wozniak.

CinéDélices est une application web qui mélange cuisine et cinéma : chaque recette est inspirée d’un film ou d’une série.  
Les utilisateurs peuvent consulter des recettes, rechercher, commenter, noter, ajouter leurs propres contenus et gérer leurs favoris.  
Les administrateurs disposent d’un accès complet à la gestion du catalogue et des utilisateurs.

## Fonctionnalités principales

### Utilisateurs
- Parcourir toutes les recettes
- Recherche par titre, catégorie ou média (film/série)
- Authentification JWT
- Ajout de leurs propres recettes
- Les recettes proposées par les utilisateurs sont automatiquement analysées par une IA afin de vérifier la cohérence et la propreté du contenu
- Système de commentaires et de notes

### Administrateur
- Gestion complète du catalogue
- Gestion des utilisateurs
- Validation des recettes

## Stack technique

### Frontend
- Svelte 5 (Runes)
- SPA Router (hash routing)
- TailwindCSS
- Stores Svelte (authentification et état global)
- Services centralisés pour les appels API

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- Authentification JWT
- Middlewares de validation
- Architecture MVC

### Outils
- Render (déploiement)
- Workflow GitHub (branches)
- ThunderClient

## Installation et lancement

Prérequis : Node.js et PostgreSQL installés.

1. Cloner le projet  
```
git clone https://github.com/O-clock-Florence/projet-cine-delices.git
cd projet-cine-delices
```

2. Installer les dépendances (front + back)  
Depuis la racine du projet :  
```
npm install
```

3. Configurer les variables d’environnement  
Créer les fichiers .env à partir des .env.example dans :  
- api/.env  
- client/.env

4. Préparer la base de données  
```
npm run db:reset
```

Ce script effectue :  
- la création de la base  
- l’exécution des migrations  
- l’insertion des données de test (seeds)

5. Lancer le projet complet  
```
npm run dev
```

Remarque : adapter la configuration CORS dans api/index.js selon l’environnement.  
En local : http://localhost:5173  
En production : utiliser l’URL du frontend déployé (ex : https://cinedelice-app.onrender.com)

Frontend → http://localhost:5173  
API → http://localhost:3000

## Arborescence simplifiée

```
projet-cine-delices/
├── api/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── migrations/
│   ├── routers/
│   └── public/
│
├── client/
│   ├── src/
│   └── public/
│
└── README.md
```

## Améliorations prévues
- Optimisation SEO pour SPA
- Gestion des favoris
- Upload d’images via Cloudinary
- Recherche avancée
- Mode sombre
- Filtres combinés (catégorie + média)

---

## Scripts NPM utiles

```
Depuis la racine du projet :

npm install
Installe toutes les dépendances (API + client).

npm run dev
Lance simultanément le frontend (Vite) et le backend.


npm run dev:front
Lance uniquement le frontend Svelte 5.

npm run dev:back
Lance uniquement l’API Node/Express.

npm run db:create
Crée la base de données PostgreSQL.

npm run db:seed
Insère les données de seed.

npm run db:reset
Crée la base, exécute les migrations et insère les seeds.

npm run build
Construit le client Svelte pour la production.
```
