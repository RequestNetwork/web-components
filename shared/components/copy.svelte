<script lang="ts">
  import CopyIcon from "../icons/copy-icon.svelte";

  export let textToCopy = "";
  let showNotification = false;

  const copyToClipboard = async (e: Event) => {
    e.stopPropagation();
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      showNotification = true;
      setTimeout(() => {
        showNotification = false;
      }, 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
</script>

<div class="copy-wrapper">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <i
    class="copy-icon fa-copy"
    on:click={copyToClipboard}
    role="button"
    tabindex="0"
    aria-label={`Copy text: ${textToCopy}`}
    title="Copy to clipboard"
  >
    <CopyIcon />
  </i>
  {#if showNotification}
    <!-- center -->
    <div class="copy-notification">Copied!</div>
  {/if}
</div>

<style>
  .copy-wrapper {
    position: relative;
  }

  .copy-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 1px solid #9ca3af;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    padding: 4px;
    border-radius: 6px;
    transition: all;
    transition-duration: 200ms;
    animation: ease-in-out;
  }

  .copy-icon:hover {
    border-color: #6b7280;
    background-color: #f3f4f6;
  }

  .copy-notification {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    transform: translateY(-50%);
    padding: 8px;
    background-color: #22c55e;
    color: black;
    background-color: white;
    border: 0.5px solid #9ca3af;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
    border-radius: 6px;
  }
</style>
