import 'dotenv/config';

// Fonction qui envoie la recette brute à Mistral et renvoie la version corrigée sous forme d'objet
export async function RecipeCheck(recipe) {


  // Description des étapes de besoins envoyés au LLM
  const prompt = `Tu es un assistant chargé de normaliser une recette envoyée en JSON. Tu DOIS renvoyer un JSON STRICTEMENT dans le format ci-dessous, sans rien ajouter, sans texte autour, sans commentaires :

  {
    "title": "",
    "description": "",
    "ingredients": "",
    "instructions": "",
    "anecdote": ""
  }

  RÈGLES OBLIGATOIRES À RESPECTER :

  1) Tu reçois un JSON brut contenant : title, description, ingredients, instructions, anecdote.

  2) Tu dois :
    - corriger les fautes d’orthographe
    - corriger la grammaire
    - clarifier sans changer le sens.
    - vérifier la cohérence de la recette (ingrédients utilisés dans les étapes, etc.)
    - uniformiser le style

  3) FORMATAGE DES INGREDIENTS :

    - Chaque ingrédient doit être sous la forme : "<quantité> <unité> <NomIngrédient>"
    - Le nom de l’ingrédient doit être en Capitalize (ex: "Farine", "Sucre Roux", "Pomme").
    - Les ingrédients doivent être séparés par des virgules.
    - Pas de puces, tirets ou retours à la ligne
    - Exemple final attendu : "200 g Farine, 100 g Beurre, 2 Oeufs, Sel"

    EXCEPTION IMPORTANTE : pour tous les ingrédients “petits ajouts” SANS quantité dans l'entrée
        tu NE dois PAS inventer de quantité. 
        Ils doivent rester sous la forme : "NomIngrédient".
    - Les ingrédients concernés incluent :
        "sel", "poivre", "épices", "herbes", "herbes de provence", 
        "cannelle", "gingembre", "paprika", "curcuma",
        "huile", "huile d’olive", "huile de tournesol",
        "beurre pour le moule", "sucre glace" (si juste pour saupoudrer),
        et tout ingrédient ANNEXE qui n’a pas de quantité dans l’entrée.
    - Ne JAMAIS inventer une quantité si elle n’est pas présente dans les données brutes.

  4) FORMATAGE DES INSTRUCTIONS :
    - Chaque étape doit commencer par une majuscule
    - Chaque étape doit se terminer par un point
    - Les étapes doivent être séparées par un point + espace
    - Exemple : "Mélange la farine. Ajoute le beurre. Pétris la pâte."

  5) FORMATAGE DE LA DESCRIPTION, DE L’ANECDOTE ET DU TITRE DE FILM :

  - Corriger toutes les fautes d’orthographe, grammaire et conjugaison.
  - Réécrire uniquement si nécessaire pour la clarté, sans changer le sens.
  - Chaque phrase doit commencer par une majuscule.
  - Après chaque point, la phrase suivante doit commencer par une majuscule.
  - Pas de reformulation créative, seulement du nettoyage et de la structure.
  - Aucun ajout d’informations qui ne figurent pas dans les données brutes.
  - Verifier la cohérence du titre de film

  6) IMPORTANT :
    - Ne JAMAIS inventer d’ingrédients.
    - Ne JAMAIS inventer d’étapes.
    - Ne JAMAIS inventer de quantités pour les ingrédients qui n’en avaient pas.
    - Ne pas modifier la recette, seulement la corriger et la structurer.

  7) TA RÉPONSE DOIT ÊTRE UNIQUEMENT LE JSON FINAL.
    - Aucun texte autour.
    - Aucun commentaire.
    - Seulement un JSON valide.
    - Seulement un JSON pur.
    - Ne jamais utiliser de blocs markdown.
    - NE JAMAIS UTILISER DE \`\`\`

  8) DOUBLE VÉRIFICATION :
    - Après avoir produit le JSON final, relis chaque champ (title, description, ingredients, instructions, anecdote).
    - Corrige à nouveau toutes les fautes d’orthographe potentielles.
    - Vérifie qu’aucun mot n’a été oublié, mal accordé ou mal conjugué.
    - Vérifie qu’il n’y a pas de répétition ou formulation incorrecte.
    - Ne modifie pas le sens, seulement la qualité de l’orthographe.

  Voici les données brutes :`


  // Convertit l'objet JS en string pour l'envoyer à Mistral.
  const text = JSON.stringify(recipe)


  // Appel API Mistral
  const response = await fetch(`${process.env.MISTRAL_BASE_URL}`, {
      method: "POST",
      headers: {
          "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [
          {
              role: "user",
              content: `${prompt}\n${text}`
          }]
      })
  });
  

  // On récupère la réponse complète de Mistral.
  const data = await response.json();
  
  
  const raw = data.choices[0].message.content;

  // Nettoie la reponse IA, garde uniquement ce qui est entre le premier "{" et le dernier "}"
  const cleaned = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);

  return JSON.parse(cleaned);
}