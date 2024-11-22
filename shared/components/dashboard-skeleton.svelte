<script>
  import Skeleton from "./skeleton.svelte";

  export let rows = 7;
  export let columns = 10;
  let skeletonConfig = {
    colors: {
      main: "#D9D9D9",
      secondary: "#E7E7E7",
    },
  };
</script>

{#each Array(columns) as _}
  <tr class="skeleton-wrapper">
    {#each Array(rows) as _}
      <td class="skeleton-item"
        ><Skeleton config={skeletonConfig} lineCount={1} /></td
      >
    {/each}
  </tr>
  <tr class="skeleton-item"></tr>
{/each}

<style>
  .skeleton-item {
    padding: 16px 24px;
    border-bottom: 1px solid #d1d5db;
  }
</style>
