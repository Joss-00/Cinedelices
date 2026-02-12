<script>
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
</script>

<div class="min-h-screen flex flex-col bg-cine-bg">
  <Header />
  <main class="flex-1">
    <slot />
  </main>
  <Footer />
</div>
