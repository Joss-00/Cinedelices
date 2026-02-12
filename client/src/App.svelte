<script>
  import Layout from "./Layout.svelte";
  import Router from 'svelte-spa-router';
  import routes from "./routes/router.js";
  import { Toaster } from "svelte-sonner";
  
  
</script>

<Toaster />
<Layout>
  <Router {routes} />
</Layout>

