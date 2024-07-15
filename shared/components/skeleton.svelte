<script lang="ts">
  export let config;
  export let lineCount = 5;
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
    <div class={`skeleton-item`}></div>
  {/each}
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
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.4px;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    margin-top: 4px;
  }

  .skeleton-item {
    height: 50px;
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
