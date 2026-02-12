<script>
  import { onMount } from "svelte";
  import { api } from "../services/api.service.js";

  let userInfo = $state({
    comment: []
  });

  onMount(async () => {
    userInfo = await api.profile();
    console.log(userInfo.recipe);
    
  });

</script>

<div class="bg-cine-bg py-12 px-4 sm:px-6 lg:px-8">
  
  <div class="max-w-3xl mx-auto bg-cine-bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 text-cine-text flex flex-col justify-center gap-3">

    <h2 class="flex items-center gap-2 font-bold text-cine-red text-base md:text-lg">
      Nom de profil: <span class="text-black">{userInfo.username}</span>
    </h2>
    <h2 class="flex items-center gap-2 font-bold text-cine-red text-base md:text-lg mb-2">
      Email de contact: <span class="text-black">{userInfo.email}</span>
    </h2>

    <section>
      <h2 class="text-cine-red text-xl font-bold mb-5">Vos recettes</h2>
      {#if userInfo.recipe?.length}
        <div class="flex flex-wrap gap-3">
          {#each userInfo.recipe as recipe}
            <a href={"/#/recipes/" + recipe.id} class="bg-cine-red text-white px-4 py-2 rounded-xl text-sm hover:opacity-90 transition"> {recipe.title}</a>
          {/each}
        </div>
      {:else}
      <p>Pas de recette postée</p>
      {/if}
    </section>

    <section>
      <h2 class="text-cine-red text-xl font-bold mt-3">Vos commentaires</h2>
      {#if userInfo.comment?.length}
        <ul class="mt-4 space-y-4">
          {#each userInfo.comment as comment}
            <li class="p-4 bg-white rounded-xl border">
              <div class="flex items-center justify-between">
                <p class="text-cine-red font-semibold">{comment.recipe.title}</p>
                <p class="text-sm italic flex gap-1 items-center">{comment.recipe.rating[0].value} <img src="img/etoile.png" class="w-4 h-4" alt="logo etoile"></p>
              </div>
              <p class="mt-2 italic">" {comment.content} "</p>
            </li>
            {/each}
        </ul>
      {:else}
      <p class="mt-4">Pas de commentaire posté</p>
      {/if}
    </section>
  </div>
</div>

