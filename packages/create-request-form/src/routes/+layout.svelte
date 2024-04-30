<script>
  import { Navbar } from "@requestnetwork/shared";
  import "../app.css";
</script>

<Navbar />
<slot />

<style>
  :global(body) {
    background-color: #fafafa;
  }
</style>
