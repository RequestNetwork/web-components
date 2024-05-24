<script lang="ts">
  import Close from "../icons/close.svelte";

  export let config;
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
    class="modal-overlay"
    style="
  --mainColor: {config.colors.main};
  --secondaryColor: {config.colors.secondary};"
  >
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{title}</h2>
        <button class="close" on:click={closeModal} aria-label="Close drawer">
          <Close />
        </button>
      </div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
{/if}

<style>
  button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
  }
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
    border-bottom: 1px solid var(--mainColor);
  }

  .modal-title {
    font-size: 18px;
    line-height: 28px;
    font-weight: 500;
  }

  .close {
    display: inline-flex;
    top: 0.625rem;
    right: 0.625rem;
    padding: 0.5rem;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    color: #9ca3af;
    background-color: transparent;
    border-radius: 0.5rem;
    border: none;
    transition: all 300ms;
  }

  .close:hover {
    background-color: #e5e7eb;
    color: #111827;
  }

  .modal-content {
    padding: 28px;
  }
</style>
