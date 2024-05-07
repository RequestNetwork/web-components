<script lang="ts">
  export let isOpen = true;
  export let title = "";
  export let onClose = () => {};

  function closeModal() {
    onClose();
    isOpen = false;
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-lg relative max-w-lg w-full">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-semibold">{title}</h2>
        <button
          class="rounded-md p-1.5 text-gray-500 hover:text-gray-700 focus:outline-none"
          on:click={closeModal}
        >
          <span class="fa fa-times"></span>
          <span class="sr-only">Close</span>
        </button>
      </div>
      <div class="p-7">
        <slot></slot>
      </div>
    </div>
  </div>
{/if}
