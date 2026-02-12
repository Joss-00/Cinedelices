<script>
  import { api } from "../services/api.service.js";
  import { setToken , setUser } from "../stores/auth.store.js";
  import { toast } from 'svelte-sonner'

  let open = $state(null);

  const toggleRegister = () => {
    open = open === "register" ? null : "register";
  };

  let formLoggin = $state({
    email:"",
    password:"",
  });

  let formRegister = $state({
    username:"",
    email:"",
    password:"",
  });


  const submitLoggin = async(dataLogin) => {
    try {
      const result = await api.login(dataLogin)
      setToken(result.token)
      setUser(result.user)
      
      
      // Renvoie à la page d'accueil après la connexion de l'utilisateur
      window.location.hash = "/";
      toast.success("Connexion réussie", {
        unstyled: true,
        class: "flex gap-2 bg-white text-cine-red px-4 py-4 rounded shadow"
      });

    } catch (error) {
      toast.error("Email ou mot de passe invalide", {
      unstyled: true,
      class: "flex gap-2 bg-white text-cine-red px-4 py-4 rounded shadow"
    });
      console.error(error)
    }

  };

  const submitRegister = async(dataRegister) => {
    try {
    await api.register(dataRegister)
    window.location.hash = "/";
    toast.success("Inscription réussie", {
      unstyled: true,
      class: "flex gap-2 bg-white text-cine-red px-4 py-4 rounded shadow"
    });
  } catch (error) {
    console.error(error)
  }

  };

</script>
<div class=" bg-cine-bg py-12 px-4 sm:px-6 lg:px-8">
  <div
    class="max-w-3xl mx-auto bg-cine-bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 text-cine-text flex flex-col items-center justify-center text-center">
    <!--Connexion avec formulaire visible-->
    <div
      class="w-[15rem] text-cine-red text-2xl md:text-xl font-bold rounded-xl mb-4">
      <h2>CONNEXION</h2>
    </div>
    <form class="p-4 border rounded-xl bg-white text-left w-[25rem] flex flex-col gap-4"
      onsubmit={(e) => {
      e.preventDefault();
      submitLoggin(formLoggin);
      }}>
      <h3 class="font-bold ml-1">Se connecter</h3>
      <input
        type="email"
        placeholder="Email"
        bind:value={formLoggin.email}
        class="w-full border p-2 rounded focus:outline-none focus:border-cine-red"
      />

      <input
        type="password"
        placeholder="Mot de passe"
        bind:value={formLoggin.password}
        class="w-full border p-2 rounded focus:outline-none focus:border-cine-red"
      />

      <button class="w-full bg-cine-red text-white py-2 rounded font-bold transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
        Se connecter
      </button>
    </form>

    <p class="font-bold my-4">ou</p>
    <!--Bouton creation de compte avec overlay en hidden au clic il s'ouvre-->
    <div
      class="w-[15rem]"
    >
      <button
        type="button"
        aria-label="Ouvrir le menu de création de compte"
        class="w-full bg-cine-red text-white py-2 rounded font-bold transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl mb-4"
        onclick={toggleRegister}>CREER UN COMPTE</button
      >
    </div>
    {#if open === "register"}
      <form class="p-4 border rounded-xl bg-white text-left w-[25rem] flex flex-col gap-4"
        onsubmit={(e) => {
        e.preventDefault();
        submitRegister(formRegister);
      }}>
        <h3 class="font-bold ml-1">Créer un compte</h3>

        <input
          type="text"
          placeholder="Pseudo"
          bind:value={formRegister.username}
          class="w-full border p-2 rounded focus:outline-none focus:border-cine-red"
        />
        <input
          type="email"
          placeholder="Email"
          bind:value={formRegister.email}
          class="w-full border p-2 rounded focus:outline-none focus:border-cine-red"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          bind:value={formRegister.password}
          class="w-full border p-2 rounded focus:outline-none focus:border-cine-red" 
        />

        <button class="w-full bg-cine-red text-white py-2 rounded font-bold transition-transform duration-300 ease-out hover:scale-105 hover:shadow-xl">
          Créer le compte
        </button>
      </form>
    {/if}
  </div>
</div>
