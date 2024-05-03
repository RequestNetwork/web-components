<script lang="ts">
  export let textToCopy = "";
  let showNotification = false;

  const copyToClipboard = async () => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      console.log("Copied to clipboard successfully!");
      showNotification = true;
      setTimeout(() => {
        showNotification = false;
      }, 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
</script>

<div class="relative">
  <i
    class="fa-regular fa-copy cursor-pointer border border-gray-400 shadow-sm p-1 rounded-md hover:bg-gray-100 hover:border-gray-500 transition-colors duration-200 ease-in-out"
    on:click={copyToClipboard}
    role="button"
    tabindex="0"
    aria-label={`Copy text: ${textToCopy}`}
    title="Copy to clipboard"
  ></i>
  {#if showNotification}
    <!-- center -->
    <div
      class="absolute top-[-30px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-green-500 text-black rounded-md shadow-lg bg-white border-[.5px] border-gray-400"
    >
      Copied!
    </div>
  {/if}
</div>
