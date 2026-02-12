import { Router } from 'express';
import recipeController from '../controllers/recipe.controller.js'
import { validateRecipe } from '../middlewares/recipe.middleware.js';
import { validateId } from '../middlewares/common.middleware.js'
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Requêtes HTTP POST
router.post("/recipes", validateRecipe, recipeController.addRecipe);
router.post("/recipes/:id/rating", recipeController.addRating);
router.post("/recipes/:id/comment", recipeController.createCommentsByIdRecipe);

// Requêtes HTTP DELETE
router.delete("/recipes/:id", isAdmin, validateId, recipeController.delete);

// Requêtes HTTP PATCH
router.patch("/recipes/:id", isAdmin, validateId, recipeController.update);


export default router; 