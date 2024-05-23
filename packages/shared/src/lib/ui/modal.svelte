<script lang="ts">
  import Close from "../icons/close.svelte";

  export let isOpen = true;
  export let title = "";
  export let onClose = () => {};

  function closeModal() {
    onClose();
    isOpen = false;
  }
</script>

{#if isOpen}
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{title}</h2>
        <button class="modal-close-button" on:click={closeModal}>
          <span>
            <Close />
          </span>
          <span class="sr-only">Close</span>
        </button>
      </div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .modal-container {
    background-color: white;
    border-radius: 8px;
    position: relative;
    max-width: 512px;
    width: 100%;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid black;
  }

  .modal-title {
    font-size: 18px;
    line-height: 28px;
    font-weight: 500;
  }

  .modal-close-button {
    border-radius: 6px;
    padding: 6px;
    color: #6b7280;
  }

  .modal-close-button:hover {
    color: #374151;
  }

  .modal-close-button:focus {
    outline: none;
  }

  .modal-content {
    padding: 28px;
  }
</style>
