<script lang="ts">
  export let config;
  export let lineCount = 5;
  export let widths = ["max-w-[260px]", "max-w-[360px]", "max-w-[360px]"];
  export let heights = ["h-2", "h-3", "h-4"];

  $: actualWidths =
    widths?.length >= lineCount
      ? widths
      : [...widths, ...Array(lineCount - widths?.length).fill("max-w-xs")];

  $: actualHeights =
    heights?.length >= lineCount
      ? heights
      : [...heights, ...Array(lineCount - heights?.length).fill("h-2")];
</script>

<div
  role="status"
  class="animate-pulse space-y-2.5 w-full"
  style="
  --mainColor: {config.colors.main};
  --secondaryColor: {config.colors.secondary};
"
>
  {#each Array(lineCount) as _, index}
    <div
      class={`rounded ${actualWidths[index % actualWidths?.length]} ${actualHeights[index % actualHeights?.length]} mb-2.5 last:mb-0 skeleton`}
    ></div>
  {/each}
  <span class="sr-only">Loading...</span>
</div>

<style>
  .skeleton {
    background: var(--mainColor);
    background: linear-gradient(
      90deg,
      var(--mainColor) 25%,
      var(--secondaryColor) 37%,
      var(--mainColor) 63%
    );
    background-size: 400% 400%;
  }
</style>
