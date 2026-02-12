<svelte:options runes />

<script>
  import { api } from "../services/api.service.js";
  import { isAdmin, isAuthed } from "../stores/auth.store.js";
  import { toast } from "svelte-sonner";

  // Récupération des params
  let { params } = $props();

  let recipe = $state([]);
  let loading = $state(true);
  let error = $state(null);

  let myScore = $state(0);
  let postComment = $state("");

  let editing = $state(false);

  const echelle = [1, 2, 3, 4, 5];

  // Récupère une recette par son ID et gère l'état de chargement ainsi que les erreurs potentielles
  async function loadRecipe(id) {
    try {
      loading = true;
      error = null;
      recipe = await api.getRecipeById(id);
    } catch (e) {
      console.error(e);
      window.location.hash = "/*";
      recipe = null;
    } finally {
      loading = false;
    }
  }

  // Surveille l'ID dans l'URL et recharge la recette automatiquement s'il change
  $effect(() => {
    if (params?.id) loadRecipe(params.id);
  });

  async function submitComment(e) {
    e.preventDefault();
    if (!params?.id) return;

    try {
      error = null;

      // On vérifie que la note et le message sont corrects avant d'appeler l'API
      if (myScore < 1 || myScore > 5) {
        error = "Choisis une note entre 1 et 5.";
        return;
      }
      // Vérifie que l'utilisateur a bien écrit un commentaire pour pouvoir l'envoyer
      if (!postComment.trim()) {
        error = "Écris un commentaire avant de valider.";
        return;
      }

      await api.createRating(params.id, myScore);
      await api.createComment(params.id, postComment);

      // Reset de la page et refresh des données
      myScore = 0;
      postComment = "";
      await loadRecipe(params.id);
    } catch (e) {
      console.error(e);
      error = "Impossible d'envoyer votre avis car vous n'êtes pas connecté";
    }
  }

  async function patchRecipe(e) {
    e.preventDefault();
    try {
      await api.updateRecipe(recipe.id, recipe);
      editing = false;
      loadRecipe(recipe.id);
      toast.success("Recette modifiée", {
        unstyled: true,
        class: "flex gap-2 bg-white text-cine-red px-4 py-4 rounded shadow",
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteComment(commentId) {
    await api.deleteComment(commentId);
    toast.success("Commentaire supprimé", {
      unstyled: true,
      class: "flex gap-2 bg-white text-cine-red px-4 py-4 rounded shadow",
    });
    await loadRecipe(params.id);
  }

  async function deleteRecipe(recipeId) {
    await api.deleteRecipe(recipeId);
    toast.success("Recette supprimé", {
      unstyled: true,
      class: "flex gap-2 bg-white text-cine-red px-4 py-4 rounded shadow",
    });
    window.location.hash = "/";
  }
</script>

{#if !editing}
  {#if loading}
    <p class="p-6 text-center">Chargement...</p>
  {:else if error}
    <p class="p-6 text-center text-red-600">{error}</p>
  {:else if recipe}
    <div class="flex justify-center p-4">
      <div
        class="bg-cine-bg-white w-full md:max-w-3xl mt-10 rounded-lg p-6 shadow-lg mb-12"
      >
        <div class="flex items-center justify-between relative mb-4">
          <h2
            class="mx-auto text-2xl md:text-3xl font-bold text-cine-red justify-self-center text-center flex-1"
          >
            {recipe.title}
          </h2>
          {#if $isAdmin}
            <button
              onclick={() => (editing = true)}
              class="absolute -right-2"
            >
              <img
                src="img/lead-pencil.svg"
                class="w-10 h-9 fill-cine-red"
                alt="modifier recette"
              />
            </button>
            <button onclick={() => deleteRecipe(recipe.id)} class="absolute">
              <img
                src="img/trash_icone.png"
                class="w-8 h-8 fill-cine-red"
                alt="supprimer la recette"
              />
            </button>
          {/if}
        </div>
        <h3
          class="mx-auto text-xl mb-4 text-cine-red justify-self-center text-center flex-1"
        >
          ( {recipe.media} )
        </h3>
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="flex">
            {#each echelle as star}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5 {star <= Math.round(recipe.average)
                  ? 'text-cine-stars'
                  : 'text-gray-300'}"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd"
                />
              </svg>
            {/each}
          </div>

          <span class="text-sm text-gray-500 font-medium">
            {recipe.average}/5 ({recipe.numberRating} notes)
          </span>
        </div>

        <div class="relative">
          <img
            src={recipe.image_url
              ? import.meta.env.VITE_API_BASE_URL + recipe.image_url
              : "img/noImageText.png"}
            alt={recipe.title}
            class="w-full max-w-md h-auto mx-auto rounded-lg shadow-md my-6 object-cover"
            onerror={(e) => (e.target.src = "img/noImageText.png")}
          />
          <p class="text-sm md:text-base text-cine-text max-w-xl mb-6">
            {recipe.description ? recipe.description : "..."}
          </p>
        </div>

        <div class="border-t mb-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-cine-red mt-6">
            Ingrédients
          </h2>

          <ul class="space-y-1 list-disc pl-5 marker:text-cine-stars">
            {#each (recipe.ingredients ?? "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean) as ingredient}
              <li class="text-base md:text-lg text-gray-700">{ingredient}</li>
            {/each}
          </ul>
        </div>

        <div class="border-t border-b mb-6">
          <h2 class="text-xl md:text-2xl font-bold mb-4 text-cine-red mt-6">
            Étapes
          </h2>

          <ul
            class="space-y-2 list-decimal pl-5 marker:text-cine-red marker:font-bold mb-6"
          >
            {#each (recipe.instructions ?? "")
              .split(".")
              .map((s) => s.trim())
              .filter(Boolean) as instruction}
              <li class="text-base md:text-lg text-gray-700 pl-2">
                {instruction}.
              </li>
            {/each}
          </ul>
        </div>

        <div
          class="my-6 bg-cine-bg-white p-4 rounded-r-lg border-l-4 border-cine-red"
        >
          <h3
            class="flex items-center gap-2 font-bold text-cine-red text-base md:text-lg mb-2"
          >
            <span>🎬</span> Le saviez-vous?
          </h3>
          <p class="text-sm md:text-base text-cine-text italic leading-relaxed">
            {recipe.anecdote ? recipe.anecdote : "..."}
          </p>
        </div>
        <section class="mt-10">
          <h2 class="text-cine-red text-xl font-bold">Commentaires</h2>

          {#if !recipe.comment || recipe.comment.length === 0}
            <p class="mt-2 opacity-70">Aucun commentaire pour le moment.</p>
          {:else}
            <ul class="mt-4 space-y-4">
              {#each recipe.comment as comment (comment.id)}
                <li class="p-4 bg-white rounded-xl border">
                  {#if $isAdmin}
                    <button
                      onclick={() => deleteComment(comment.id)}
                      class="relative"
                    >
                      <img
                        src="img/trash_icone.png"
                        class="w-5 h-5 fill-cine-red"
                        alt="supprimer la recette"
                      />
                    </button>
                  {/if}
                  <div class="flex items-center justify-between">
                    <p class="text-cine-red font-semibold">
                      {comment.user?.username ?? "Anonyme"}
                    </p>
                    <p class="text-sm italic">
                      {new Date(comment.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <p class="mt-2 italic">" {comment.content} "</p>
                </li>
              {/each}
            </ul>
          {/if}
        </section>
        {#if $isAuthed}
          <form onsubmit={submitComment}>
            <div
              class="mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-lg mx-auto"
            >
              <h3 class="text-lg font-bold text-cine-text mb-6 text-center">
                Laissez votre avis
              </h3>

              <div class="flex justify-center gap-2 mb-6">
                {#each echelle as star}
                  <button
                    type="button"
                    aria-label="Noter {star} sur 5"
                    onclick={() => (myScore = star)}
                    class="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-8 h-8 transition-colors {star <= myScore
                        ? 'text-cine-stars'
                        : 'text-gray-300'}"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                {/each}
              </div>
              <div class="space-y-4">
                <div class="text-cine-text">
                  <textarea
                    bind:value={postComment}
                    rows="3"
                    placeholder="Votre commentaire sur la recette..."
                    class="w-full px-3 py-3 pl-2 border border-gray-300 rounded-md focus:outline-none focus:border-cine-red focus:ring-1 focus:ring-cine-red text-sm"
                  >
                  </textarea>
                </div>

                <div class="flex justify-center items-center">
                  <button
                    class="w-full bg-cine-red text-white py-2 rounded font-bold transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl mb-4"
                  >
                    Valider
                  </button>
                </div>
              </div>
            </div>
          </form>
        {:else}
          <p class="mt-6 text-center text-sm opacity-70">
            <a href="/#/auth/register" class="text-cine-red font-bold underline">Connecte-toi</a> pour laisser un avis.</p>
        {/if}
      </div>
    </div>
  {/if}
{:else}
  <div class="bg-cine-bg py-12 px-4 sm:px-6 lg:px-8">
    <div
      class="max-w-3xl mx-auto bg-cine-bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 text-cine-text flex flex-col items-center justify-center text-center"
    >
      <div
        class="w-[10rem] bg-cine-red text-white text-2xl py-2 px-2 md:text-xl font-bold mb-2 rounded-xl"
      >
        <h2>MODIFIER LA RECETTE</h2>
      </div>

      <form
        class="mt-4 p-4 border rounded-xl bg-white text-left w-[25rem]"
        onsubmit={patchRecipe}
      >
        <!-- NOM DE LA RECETTE -->
        <input
          type="text"
          placeholder="Nom de la recette"
          bind:value={recipe.title}
          class="w-full border p-2 rounded focus:outline-none focus:border-cine-red"
          required
        />

        <!-- DESCRIPTION -->
        <textarea
          placeholder="Description de la recette"
          bind:value={recipe.description}
          class="mt-3 w-full border p-2 rounded h-24 focus:outline-none focus:border-cine-red"
        >
        </textarea>

        <!-- INGREDIENTS -->
        <textarea
          placeholder="Ingrédients de la recette"
          bind:value={recipe.ingredients}
          class="w-full border p-2 rounded mt-2 h-24 focus:outline-none focus:border-cine-red"
          required
        >
        </textarea>

        <!-- INSTRUCTIONS -->
        <textarea
          placeholder="Étapes de préparation"
          bind:value={recipe.instructions}
          class="w-full border p-2 rounded mt-2 h-24 focus:outline-none focus:border-cine-red"
          required
        >
        </textarea>

        <!-- CATEGORIE -->
        <select
          id="category"
          bind:value={recipe.category}
          class="w-full mt-2 border p-2 rounded focus:outline-none focus:border-cine-red bg-white {recipe.category ===
          ''
            ? 'text-gray-400'
            : 'text-cine-text'}"
          required
        >
          <option value="" disabled hidden>Choisir un type de plat</option>
          <option value="Entrées">Entrée</option>
          <option value="Plats">Plat</option>
          <option value="Desserts">Dessert</option>
        </select>

        <!-- TYPE MEDIA -->
        <select
          id="media"
          bind:value={recipe.mediaType}
          class="w-full border mt-2 p-2 rounded focus:outline-none focus:border-cine-red bg-white {recipe.mediaType ===
          ''
            ? 'text-gray-400'
            : 'text-cine-text'}"
          required
        >
          <option value="" disabled hidden>Choisir un type de media</option>
          <option value="Film">Film</option>
          <option value="Série">Série</option>
        </select>

        <!-- FILM/SERIE -->
        <input
          type="text"
          placeholder="Nom du film / série associé(e)"
          bind:value={recipe.media}
          class="w-full border p-2 rounded mt-3 focus:outline-none focus:border-cine-red"
          required
        />

        <!-- ANECDOTE -->
        <textarea
          placeholder="Anecdote liée à la recette ou au film"
          bind:value={recipe.anecdote}
          class="w-full border p-2 rounded mt-3 h-24 focus:outline-none focus:border-cine-red"
        >
        </textarea>

        <!-- IMAGE -->
        <label for="image" class="pl-1 font-semibold">Image de la recette</label
        >
        <input
          type="text"
          placeholder="URL de l'image"
          id="image"
          accept="image/*"
          bind:value={recipe.image_url}
          class="w-full border p-2 rounded mt-1 mb-4 focus:outline-none focus:border-cine-red"
        />

        <button
          class="w-full bg-cine-red text-white py-2 rounded font-bold hover:opacity-90"
        >
          Modifier la recette
        </button>
      </form>
    </div>
  </div>
{/if}
