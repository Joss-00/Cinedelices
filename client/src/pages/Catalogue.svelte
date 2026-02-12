<script>
  import { onMount, onDestroy } from "svelte";
  import { api } from "../services/api.service.js";
  import RecipeCard from "../components/RecipeCard.svelte";
  import ButtonViewMore from "../components/ButtonViewMore.svelte";
  import { recipeSearch } from "../stores/recipeSearch";

  let recipes = $state([]);
  let title = $state("recettes");
  let visibleCount = $state(9);
  const resetVisible = () => {
    visibleCount = 9;
  };
  let open = $state(false);
  const toggle = () => (open = !open);
  const close = () => (open = false);

  let dropdownRef;

  function handleClickOutside(event) {
    if (open && dropdownRef && !dropdownRef.contains(event.target)) {
      open = false;
    }
  }

  let search = $state("");

  recipeSearch.subscribe((value) => {
    search = value;
  });

  // Récupère les recettes via l'API à l'initialisation de la page
  onMount(async () => {
    document.addEventListener("click", handleClickOutside);
    if (search) {
      recipes = await api.getRecipesBySearch({ search });
    } else {
      recipes = await api.getAllRecipes();
    }
  });

  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  async function select(value) {
    if (value === "nouveautés") {
      title = "nouveautés";
      recipes = await api.getRecipesByDate();
      close();
      return;
    }

    // Convertit le nom de la catégorie en ID pour récupérer les recettes correspondantes via l'API
    const map = {
      entrées: 1,
      plats: 2,
      desserts: 3,
    };

    // Si la catégorie est valide (ID trouvé), on met à jour le titre et on charge les recettes
    const catId = map[value];
    if (catId) {
      title = `${value}`;
      recipes = await api.getRecipesByCategory(catId);
    }

    close();
  }
</script>
<form
  class="flex items-center justify-center p-6"
  onsubmit={(e) => {
    e.preventDefault();
    if (!search.trim()) {
      // si vide → on recharge tout
      api.getAllRecipes().then(r => recipes = r);
      return;
    };
    api.getRecipesBySearch({ search }).then(r => recipes = r);
  }}
>
  <!--Barre de recherche responsive -->
  <div
    class="relative w-full max-w-md transition-transform duration-300 hover:scale-105"
  >
    <button type="submit" class="absolute left-3 top-1/2 -translate-y-1/2 z-10">
      <img
        src="/img/loupe.webp"
        alt=""
        class="w-5 h-5 opacity-60 hover:opacity-100 transition mt-10"
      />
    </button>
    <input
      type="search"
      placeholder="Ingrédient, film ou série..."
      class="w-full h-9 pl-4 pr-1 rounded-xl border-2 border-transparent focus:outline-none focus:border-cine-red text-cine-text text-center mt-10"
      bind:value={search}
    />
  </div>
</form>

<div class="relative inline-block ml-2 mt-2" bind:this={dropdownRef}>
  <button class="px-6 py-2 rounded-full font-medium text-sm text-white bg-cine-red/80
  hover:bg-cine-red hover:scale-105 transition-transform duration-300 ease-out hover:shadow-xl ml-8 mb-4"
    onclick={(e) => {e.stopPropagation(); toggle();}}
    >Filtrer par :</button>
  {#if open}
    <div
      class="absolute top-full left-8 w-40 bg-white rounded shadow-lg border z-50"
    >
 
      <button 
        class="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-cine-red hover:underline"
        onclick={() => select("entrées")}>Entrées</button
      >
      <button
        class="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-cine-red hover:underline"
        onclick={() => select("plats")}>Plats</button
      >
      <button
        class="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-cine-red hover:underline"
        onclick={() => select("desserts")}>Desserts</button
      >
      <button
        class="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-cine-red hover:underline"
        onclick={() => select("nouveautés")}>Nouveautés</button
      >
      <button
        class="block w-full text-left text-sm font-bold  px-4 py-2 text-cine-red hover:underline"
        onclick={async () => {
          title = "recettes";
          recipes = await api.getAllRecipes();
          resetVisible();
        }}
        >Retirer les filtres
      </button>
    </div>
  {/if}
</div>
<div class="">
</div>

{#if search.length === 0}
  <div class="flex items-center justify-center">
    <h2 class=" text-cine-red text-2xl md:text-3xl font-bold mb-12">{`Nos ${title}`}</h2>
  </div>
  <div class=" flex justify-center items-center mb-5">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each recipes.slice(0, visibleCount) as recipe}
        <RecipeCard {recipe}></RecipeCard>
      {/each}
    </div>
  </div>
  <ButtonViewMore bind:visibleCount {recipes}></ButtonViewMore>
{:else if recipeSearch.search !== 0}
  <div class="flex items-center justify-center text-">
    <h2 class=" text-cine-red text-2xl  font-bold py-5">Votre recherche</h2>
  </div>

  <div class=" flex justify-center items-center mb-5">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {#each recipes.slice(0, visibleCount) as recipe}
        <RecipeCard {recipe}></RecipeCard>
      {/each}
    </div>
  </div>
{/if}
