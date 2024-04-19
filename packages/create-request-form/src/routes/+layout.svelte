<script>
  import { Navbar } from "$lib/ui";
  import "../app.css";
</script>

<Navbar />
<slot />

<style>
  :global(body) {
    background-color: #fafafa;
  }
</style>
