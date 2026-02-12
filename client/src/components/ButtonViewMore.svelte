<script>

  let { visibleCount = $bindable(), recipes } = $props();

  const voirPlus = () => {
    visibleCount += 9;
  };

  const voirMoins = () => {
    visibleCount = 9;
  };


</script>

{#if recipes.length > visibleCount}
  <div class="flex justify-center mt-12">
    <button
      class="bg-cine-red/80
        text-white
        px-8 py-3 
        rounded-lg
        font-semibold
        hover:bg-cine-red hover:scale-105 
        transition-transform duration-300
        ease-out hover:shadow-xl"
      onclick={voirPlus}
      >voir plus
    </button>
  </div>
{/if}
{#if visibleCount > 9}
  <div class="flex justify-center mt-12">
    <button
      class="bg-cine-red/60
        text-white
        px-8 py-3 
        rounded-lg
        font-semibold
        hover:bg-cine-red/80 hover:scale-105 
        transition-transform duration-300"
      onclick={voirMoins}
    >
      Voir moins
    </button>
  </div>
{/if}