# CineDelices

Final project for the Web & Mobile Web Developer training (O’clock).  
Created by Josselin Dréan, Maxime Lagraa, David Bache, and Pierre Wozniak.

CineDelices is a web application that blends cooking and cinema: every recipe is inspired by a movie or a series.  
Users can browse recipes, search, comment, rate, create content, and manage their favorites.  
Admins have full control over recipes and user management.

## Main Features

### Users
- Browse all recipes
- Search by title, category, or media (movie/series)
- JWT authentication
- Add their own recipes
- User recipe submissions are automatically validated by an AI assistant to ensure clean and consistent content
- Comments and rating system
- Favorites management

### Admin
- Full catalog management
- User management
- Recipe validation

## Tech Stack

### Frontend
- Svelte 5 (Runes)
- SPA Router (hash routing)
- TailwindCSS
- Svelte stores for auth and global state
- Centralized services for API requests

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT authentication
- Validation middlewares
- MVC architecture

### Tools
- Render (deployment)
- GitHub branches workflow
- ThunderClient / Postman

## Installation and Setup

Prerequisites: Node.js and PostgreSQL installed.

1. Clone the project  
git clone https://github.com/O-clock-Florence/projet-cine-delices.git
cd projet-cine-delices


2. Install dependencies (front + back)  
From the project root:  
npm install


3. Configure environment variables  
Create the .env files based on .env.example in:  
- api/.env  
- client/.env

4. Set up the database  
npm run db:reset


This script will:  
- create the database  
- run migrations  
- insert seeds

5. Start the full project  
npm run dev


Note: Update the CORS configuration in the API index.js according to your environment.  
For local development, allow http://localhost:5173.  
For production, set your deployed frontend URL (for example: https://cinedelice-app.onrender.com).

Frontend → http://localhost:5173  
API → http://localhost:3000

## Simplified Structure
```
projet-cine-delices

├── api
│ ├── controllers
│ ├── middlewares
│ ├── models
│ ├── migrations
│ ├── routers
│ └── public
│
├── client
│ ├── src
│ └── public
│
└── README.md
```

## Planned Improvements
- SEO optimization for SPA
- Image uploads via Cloudinary
- Advanced search
- Dark mode
- Combined filters (category + media)

---

## Useful NPM Scripts

```
From the project root:

npm install
Installs all dependencies (API + client).

npm run dev
Starts both frontend (Vite) and backend concurrently.

npm run dev:front
Starts the Svelte 5 frontend only.

npm run dev:back
Starts the Node/Express API only.

npm run db:create
Creates the PostgreSQL database.

npm run db:seed
Inserts seed data into the database.

npm run db:reset
Creates the database, runs migrations, and seeds data.

npm run build
Builds the Svelte client for production.
```
