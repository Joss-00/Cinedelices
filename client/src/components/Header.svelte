<script>
  import { fly } from "svelte/transition";
  import { auth, isAuthed, logout } from "../stores/auth.store";

  let menuOpen = false;

  const openMenu = () => (menuOpen = true);
  const closeMenu = () => (menuOpen = false);
  
  
</script>

<header class="bg-cine-red">
  <div class="flex items-center justify-between">
    <!-- MENU EN MOBIL FIRST-->
  <a href="/#/" class="flex justify-center md:justify-start items-center gap-2 ml-8">
    <img
      class="w-10 h-auto"
      src="/img/logo.webp"
      alt="Logo ciné délices"
    />
    <h1 class="text-2xl font-bold text-white">Ciné Délices</h1>
  </a>
    <button
      type="button"
      class="md:hidden p-1"
      onclick={openMenu}
      aria-label="Ouvrir le menu"
    >
      <img src="/img/menu-burger.svg" class="w-10 h-auto" alt="" />
    </button>

    <!--MENU DEKSTOP-->
    <nav
      class="hidden md:flex shrink-0 items-center gap-8 text-cine-bg-white font-semibold p-8"
    >
    <a href="/" class="hover:text-cine-stars transition-transform duration-300 ease-out hover:scale-105 py-1 px-3 rounded-xl">Accueil</a>
    <a href="/#/recipes" class="hover:text-cine-stars transition-transform duration-300 ease-out hover:scale-105  py-1 px-3 rounded-xl">Catalogue</a>
    {#if $isAuthed}
      <a href="/#/add-recipe" class="hover:text-cine-stars transition-transform duration-300 ease-out hover:scale-105 py-1 px-3 rounded-xl">Ajouter une recette</a>
      <a href="/#/profile" class="hover:text-cine-stars transition capitalize">{$auth.user.username.charAt(0).toUpperCase() + $auth.user.username.slice(1)}</a>
      <a href="/" class="bg-cine-stars py-1 px-3 rounded-xl text-cine-red hover:text-cine-red transition-transform duration-300 ease-out hover:scale-105" onclick={logout}>Déconnexion</a>
    {:else}
      <a href="/#/auth/register" class="bg-cine-stars py-1 px-3 rounded-xl text-white hover:text-cine-red transition-transform duration-300 ease-out hover:scale-105">Connexion</a>
    {/if}
    </nav>
  </div>
</header>

{#if menuOpen}
  <!-- Mobile menu fullscreen -->
  <div class="fixed inset-0 z-50 md:hidden">
    <!-- overlay -->
    <button
      type="button"
      class="absolute inset-0 bg-black/40 z-40"
      onclick={closeMenu}
      aria-label="Fermer le menu"
    ></button>
    <!-- menu -->
    <div
      class="absolute top-0 left-0 w-full h-full bg-cine-bg text-cine-red z-50
            flex flex-col items-start gap-8 text-2xl p-10"
      in:fly={{ x: 500, duration: 300 }}
      out:fly={{ x: 500, duration: 250 }}
    >
      <button
        type="button"
        class="px-6 py-3 fixed top-2 right-0 rounded bg-cine-red text-white"
        onclick={closeMenu}
      >
        <img
          src="img/menu-burger.svg"
          class="w-10 h-auto"
          alt="fermer le menu"
        />
      </button>

      <a href="/" onclick={closeMenu}>Accueil</a>
      <a href="/#/recipes" onclick={closeMenu}>Catalogue</a>
      {#if $isAuthed}
        <a href="/#/add-recipe" onclick={closeMenu}>Ajout Recette</a>
        <a href="/#/profile" onclick={closeMenu}>{$auth.user.username.charAt(0).toUpperCase() + $auth.user.username.slice(1)}</a>
        <a href="/" onclick={logout}>Deconnexion</a>

      {:else}
      <a href="/#/auth/register"onclick={closeMenu}>Connexion</a>
        
      {/if}
    </div>
  </div>
{/if}