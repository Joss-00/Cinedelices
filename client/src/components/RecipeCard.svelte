<script>
  let { recipe } = $props();

  function cat(id) {
    const categories = { 1: "Entrée", 2: "Plat", 3: "Dessert" };
    return categories[id] ?? "";
  }
</script>
<a href={"/#/recipes/" + recipe.id} class="block group">
  <div class="relative group w-80 h-48 overflow-hidden rounded transition-transform duration-300 hover:scale-105 mt-10">
    <img
      src={recipe.image_url ? import.meta.env.VITE_API_BASE_URL + recipe.image_url : "img/noImage.png"}
      alt={recipe.title}
      class="w-full h-full object-cover"
      onerror={(e) => e.target.src = "img/noImage.png"}
    />

    <!-- TITRE -->
    <span
      class="recipe-title absolute bottom-3 left-3 z-10 text-cine-bg-white text-xl font-bold px-3 py-1 rounded"
      style="text-shadow: 0 0 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5), 1px 1px 3px rgba(0,0,0,0.8);"
    >
      {recipe.title}
    </span>

    <!-- CATEGORIE -->
    <div class="absolute top-2 right-2 z-10 flex items-center gap-1 bg-cine-red text-white text-sm px-2 py-1 rounded-full backdrop-blur">
      {cat(recipe.category_id)}
    </div>

    <!-- OVERLAY -->
    <div
      class="absolute inset-0 z-30 bg-black/40 -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col justify-center items-center text-center p-4"
    >
      <p class="text-white text-sm line-clamp-3">{recipe.description}</p>
      <span class="mt-3 text-white font-semibold">Voir la recette</span>
    </div>
  </div>
</a>

<style>
  /* même durée + même easing que l'overlay => synchro parfaite */
  .recipe-title {
    transform: translateY(0);
    opacity: 1;
    transition: transform 500ms ease-out, opacity 500ms ease-out;
  }

  /* au hover du group : le titre sort par le bas + disparaît */
  .group:hover .recipe-title {
    transform: translateY(220px);
    opacity: 0;
  }
</style>
