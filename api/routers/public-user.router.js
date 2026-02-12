import { Router } from 'express';
import recipeController from '../controllers/recipe.controller.js'
import { validateId } from '../middlewares/common.middleware.js';

const router = Router();

// Requêtes HTTP GET
router.get("/recipes", recipeController.getAll);
router.get("/recipes/news", recipeController.getRecipesByDate);
router.get("/recipes/:id", validateId, recipeController.getAllInfoByIdRecipe);
router.get("/recipes/category/:id",validateId, recipeController.getRecipesByCategory);

// Requêtes HTTP POST
router.post("/recipes/search", recipeController.getRecipesBySearch);


export default router; 