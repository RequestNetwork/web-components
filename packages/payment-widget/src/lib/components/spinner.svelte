<script lang="ts">
  export let size: "small" | "medium" | "large" = "medium";
  export let color: string = "currentColor";

  function getSizeInPixels(size: "small" | "medium" | "large"): number {
    switch (size) {
      case "small":
        return 16;
      case "medium":
        return 24;
      case "large":
        return 32;
    }
  }
</script>

<div
  class="spinner"
  style="--spinner-color: {color}; --spinner-size: {getSizeInPixels(size)}px;"
></div>

<style>
  .spinner {
    border: 2px solid var(--spinner-color);
    border-top: 2px solid transparent;
    border-radius: 50%;
    width: var(--spinner-size);
    height: var(--spinner-size);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
