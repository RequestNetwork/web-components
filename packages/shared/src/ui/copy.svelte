<script lang="ts">
  export let textToCopy = "";

  const copyToClipboard = async () => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log("Copied to clipboard successfully!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<i
  class="fa-regular fa-copy cursor-pointer border border-gray-400 shadow-sm p-1 rounded-md hover:bg-gray-100 hover:border-gray-500 transition-colors duration-200 ease-in-out"
  on:click={copyToClipboard}
  role="button"
  tabindex="0"
  aria-label={`Copy text: ${textToCopy}`}
  title="Copy to clipboard"
></i>
