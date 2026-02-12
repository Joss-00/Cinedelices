<script>
  import { api } from "../services/api.service.js";
  import { toast } from 'svelte-sonner'

  let form = $state({
    title: "",
    description: "",
    image_url: "",
    ingredients: "",
    instructions: "",
    anecdote: "",
    category: "",
    mediaType: "",
    media:"",
  });

// Envoi les données du formulaire au backend pour créer une recette
  const submitRecipe = async() => {
    try {
    await api.createRecipe(form)
    window.location.hash = "/";
    toast.success("Recette ajoutée", {
        unstyled: true,
        class: "flex gap-2 bg-white text-cine-red px-4 py-4 rounded shadow"
      });
    
    } catch (error) {
      console.error(error)
    }
  };

</script>

<div class="bg-cine-bg py-12 px-4 sm:px-6 lg:px-8">
  <div
    class="max-w-3xl mx-auto bg-cine-bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 text-cine-text flex flex-col items-center justify-center text-center">
    <div
      class="w-[20rem]  text-cine-red text-2xl md:text-xl font-bold mb-4 rounded-xl">
      <h2>AJOUTER UNE RECETTE</h2>
    </div>

    <form
      class="p-4 border rounded-xl bg-white text-left w-[25rem] flex flex-col gap-5"
      onsubmit={(e) => {
      e.preventDefault();
      submitRecipe();
      }}>


      <!-- NOM DE LA RECETTE -->
      <input
        type="text"
        placeholder="Nom de la recette"
        bind:value={form.title}
        class="w-full border p-2 rounded focus:outline-none focus:border-cine-red"
        required/>

      <!-- DESCRIPTION -->
      <textarea
        placeholder="Description de la recette"
        bind:value={form.description}
        class="w-full border p-2 rounded h-24 focus:outline-none focus:border-cine-red">
      </textarea>

      <!-- INGREDIENTS -->
      <textarea
        placeholder="Ingrédients de la recette"
        bind:value={form.ingredients}
        class="w-full border p-2 rounded h-24 focus:outline-none focus:border-cine-red"
        required>
      </textarea>

      <!-- INSTRUCTIONS -->
      <textarea
        placeholder="Étapes de préparation"
        bind:value={form.instructions}
        class="w-full border p-2 rounded h-24 focus:outline-none focus:border-cine-red"
        required>
      </textarea>

      <!-- CATEGORIE -->
    <select id="category" bind:value={form.category} class="w-full border p-2 rounded focus:outline-none focus:border-cine-red bg-white {form.category === '' ? 'text-gray-400' : 'text-cine-text'}" required>
      <option value="" disabled hidden>Choisir un type de plat</option>
      <option value="Entrées">Entrée</option>
      <option value="Plats">Plat</option>
      <option value="Desserts">Dessert</option>
    </select>
      
      <!-- TYPE MEDIA -->
      <select id="media" bind:value={form.mediaType} class="w-full border p-2 rounded focus:outline-none focus:border-cine-red bg-white {form.mediaType === '' ? 'text-gray-400' : 'text-cine-text'}" required>
        <option value="" disabled hidden>Choisir un type de media</option>
        <option value= "Film" >Film</option>
        <option value= "Série" >Série</option>
      </select>

      <!-- FILM/SERIE -->
      <input type="text" placeholder="Nom du film / série associé(e)" bind:value={form.media} class="w-full border p-2 rounded focus:outline-none focus:border-cine-red" required/>
      
      <!-- ANECDOTE -->
      <textarea
        placeholder="Anecdote liée à la recette ou au film"
        bind:value={form.anecdote}
        class="w-full border p-2 rounded h-24 focus:outline-none focus:border-cine-red">
    </textarea>

      <!-- IMAGE -->
      <div class="">
      <label for="image" class="pl-1 text-base font-semibold">Image de la recette</label>
      <input type="text"  placeholder="URL de l'image" id="image" accept="image/*" bind:value={form.image_url} class="w-full border p-2 rounded mt-1 mb-4 focus:outline-none focus:border-cine-red"/>
      </div>

      <button class="w-full bg-cine-red text-white py-2 rounded font-bold transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl" >
        Ajouter la recette
      </button>
    </form>
  </div>
</div>
