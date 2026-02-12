import Home from "../pages/Home.svelte"
import Catalogue from "../pages/Catalogue.svelte";
import Recipe from "../pages/Recipe.svelte";
import Auth from "../pages/Auth.svelte";
import AddRecipe from "../pages/AddRecipe.svelte";
import Legal from "../pages/Legal-notice.svelte";
import Error404 from "../components/Error404.svelte";
import Profile from "../pages/Profile.svelte";

// Définition des routes du mini-router (SPA)
export default {
  "/": Home,                  // Page d’accueil
  "/recipes" : Catalogue,     // Catalogue des recettes
  "/recipes/:id": Recipe,     // Page d’une recette (dynamique)
  "/add-recipe" : AddRecipe,  // Formulaire d’ajout d’une recette
  "/legal-notice" : Legal,    // Page mentions légales
  "/auth/register": Auth,     // Page inscription / connexion
  "/profile": Profile,        // Page Profile
  '*': Error404               // Page erreur 404
}
