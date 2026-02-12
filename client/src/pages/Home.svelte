<script>
  import { onMount } from "svelte";
  import { api } from "../services/api.service.js";
  import RecipeCard from "../components/RecipeCard.svelte";
  import { recipeSearch } from "../stores/recipeSearch";
  import { push } from "svelte-spa-router";

  let recipes = $state([]);
  let recipes2 = $state([]);
  let userSearch = "";

  onMount(async () => {
    const result = await api.getRecipesByDate();
    recipes = result.slice(0, 3);
    const result2 = await api.getAllRecipes();
    recipes2 = result2.slice(0, 3);
  });

  function submitSearch() {
    recipeSearch.set(userSearch);
    push("/recipes");
  }
</script>

<section 
  class="relative w-full mx-auto my-10 rounded-2xl overflow-hidden flex flex-col justify-center items-center"
  style="height: 300px; max-width: 1000px;" 
>

  <img 
    src="/img/banniere-cine-delices.webp" 
    alt="Bannière" 
    class="absolute inset-0 w-full h-full object-cover blur-lg"
    style=";"
  />

  <div class="absolute inset-0 bg-black/30"></div>

  <form
    class="relative z-10 w-full max-w-lg px-6"
    onsubmit={(e) => {
      e.preventDefault();
      submitSearch();
    }}
  >
    <div class="relative w-full h-14 group transition-transform duration-300 hover:scale-105">
      
      <button type="submit" class="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <img
          src="/img/loupe.webp"
          alt="Rechercher"
          class="w-5 h-5 opacity-60 hover:opacity-100 transition"
          style="width: 20px; height: 20px; object-fit: contain;" 
        />
      </button>

      <input
        type="search"
        placeholder="ingrédient, film ou série..."
        class="w-full h-9 pl-4 pr-1 rounded-xl border-2 border-transparent focus:outline-none focus:border-cine-red text-cine-text text-center"
        bind:value={userSearch}
      />
    </div>
  </form>
</section>

<section class="my-10">
  <div class="mx-auto"
  style="max-width: 1000px;">
    <div class="p-8 bg-cine-bg-white rounded-2xl border border-black/5 mb-10">
      <h1 class="text-cine-red text-3xl md:text-4xl font-bold text-center ">
        🍿 Ciné Délices
      </h1>

      <p class="mt-4 text-cine-text text-base md:text-lg leading-relaxed">
        Ciné Délices est un site fait pour vous, amateurs de <span class="font-bold italic text-cine-text">cuisine ET de cinéma</span>.</p>
      <p>Notre but ? Vous permettre de refaire chez vous une recette qui vous a fait saliver, issue d’un film ou d’une série.</p>
      <p>De l’écran à la table, il n’y a qu’un pas… et c’est ici que ça se passe !</p>
      <p class="mt-4 text-lg md:text-xl font-bold text-cine-text">
        Alors aux fourneaux, votre recette commence dans 3… 2… 1…
      </p>
    </div>
  </div>
</section>


<section class="mt-10">
  <div class="max-w-6xl mx-auto px-6">
    <h1 class="text-cine-red text-3xl font-bold mb-4 text-center">
      Nos dernières recettes
    </h1>

    <div class="flex justify-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each recipes as recipe}
          <RecipeCard {recipe} />
        {/each}
      </div>
    </div>
  </div>
</section>

<section class="mt-10">
  <div class="max-w-6xl mx-auto px-6">
    <h1 class="text-cine-red text-3xl font-bold mb-4 text-center">
      Les recettes les mieux notées
    </h1>

    <div class="flex justify-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each recipes2 as recipe}
          <RecipeCard {recipe} />
        {/each}
      </div>
    </div>
  </div>
</section>

