import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import recipeRouter from './routers/recipe.router.js';
import authRouter from './routers/auth.router.js';
import { validateToken } from "./middlewares/auth.middleware.js";
import { xss } from 'express-xss-sanitizer';
import publicRouter from './routers/public-user.router.js'
import commentRouter from './routers/comment.router.js'

const app = express();

app.use(express.static("public"));

app.use(morgan("dev"));

// Middleware cors, accepte de partager les données avec la partie client
app.use(cors({ origin: "http://localhost:5173" })); 

app.use(express.json());

// Protection contre les failles XSS
app.use(xss());

app.use(publicRouter);

// Router inscription + authentification
app.use(authRouter);

// Après le router des authentification ajoute le validateToken
// Toutes les routes qui sont ajoutée après cette instruction sont protégée par un token, les clients doivent être connecté pour accéder aux routes déclarées après
app.use(validateToken);

app.use(recipeRouter);
app.use(commentRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Api started at http://localhost:${PORT}`);
});