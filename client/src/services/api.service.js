import { httpRequester } from "./httpRequester.js";

// Export d’un objet regroupant toutes les fonctions API
export const api = {
  getAllRecipes,
  getRecipeById,
  getRecipesByCategory,
  getRecipesByDate,
  getRecipesBySearch,

  createRecipe,
  createMedia,
  createComment,
  createRating,

  deleteRecipe,
  deleteComment,
  updateRecipe,

  register,
  login,
  profile,
};

// Récupère toutes les recettes par catégorie
async function getRecipesByCategory(categoryId) {
  return await httpRequester.get(`recipes/category/${categoryId}`);
};

// Récupère toutes les recettes par date d'ajout
async function getRecipesByDate() {
  return await httpRequester.get("recipes/news");
};

async function getRecipesBySearch(search) {
  return await httpRequester.post("recipes/search", search);
};

// Récupère toutes les recettes
async function getAllRecipes() {
  return await httpRequester.get("recipes");
};
// Récupère toutes les informations d'une recette
async function getAllInfoByIdRecipe(){
  return await httpRequester.get(`recipe/${recipeId}`)
}
// Récupère une recette par son id
async function getRecipeById(recipeId) {
  return await httpRequester.get(`recipes/${recipeId}`);
};

// Récupère tout les médias
async function getAllMedia() {
  return await httpRequester.get("add-recipe");
};

// Crée une nouvelle recette (user)
async function createRecipe(recipe) {
  return await httpRequester.post(`recipes/`, recipe);
};

// Crée une nouveau média (user)
async function createMedia(media) {
  return await httpRequester.post(`add-media/`, media);
};

// Ajouter un commentaire (user)
async function createComment(recipeId, comment) {
  return await httpRequester.post(`recipes/${recipeId}/comment`, {content: comment});
};

// Ajouter une note (user)
async function createRating(recipeId, rating) {
  return await httpRequester.post(`recipes/${recipeId}/rating`, {value: rating});
};

// Supprimer une recette (admin uniquement)
async function deleteRecipe(recipeId) {
  return await httpRequester.delete(`recipes/${recipeId}`);
};

// Supprimer un commentaire (admin uniquement)
async function deleteComment(commentId) {
  return await httpRequester.delete(`comment/${commentId}`);
};

// Modifier une recette (admin uniquement)
async function updateRecipe(recipeId, recipeData) {
  return await httpRequester.patch(`recipes/${recipeId}`, recipeData);
};

// Inscription utilisateur
async function register(signupData) {
  return await httpRequester.post(`auth/register`, signupData);
};

// Connexion utilisateur
async function login(loginData) {
  return await httpRequester.post(`auth/login`, loginData);
};

// Récupère le profil de l’utilisateur connecté
async function profile() {
  return await httpRequester.get(`auth/me`);
};



