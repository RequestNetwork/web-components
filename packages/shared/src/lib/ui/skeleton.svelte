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
  class="skeleton-wrapper"
  style="
  --mainColor: {config.colors.main};
  --secondaryColor: {config.colors.secondary};
"
>
  {#each Array(lineCount) as _, index}
    <div
      class={`${actualWidths[index % actualWidths?.length]} ${actualHeights[index % actualHeights?.length]} skeleton-item`}
    ></div>
  {/each}
  <span class="sr-only">Loading...</span>
</div>

<style>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .skeleton-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .skeleton-item {
    border-radius: 4px;
    margin-bottom: 10px;
    background: var(--mainColor);
    background: linear-gradient(
      90deg,
      var(--mainColor) 25%,
      var(--secondaryColor) 37%,
      var(--mainColor) 63%
    );
    background-size: 400% 400%;
  }

  .skeleton-item:last-of-type {
    margin-bottom: 0px;
  }
</style>
