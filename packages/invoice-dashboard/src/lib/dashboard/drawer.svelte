<script lang="ts">
  import Close from "@requestnetwork/shared-icons/close.svelte";

  export let active = false;
  export let onClose: () => void;

  let drawerElement: HTMLElement;
</script>

<div
  class={`drawer-overlay ${active ? "active" : "hidden"}`}
  on:click|stopPropagation={onClose}
></div>
<div bind:this={drawerElement} class={`drawer ${active ? "active" : "hidden"}`}>
  <div class="innerDrawer">
    <button class="close" on:click={onClose} aria-label="Close drawer">
      <Close />
      <span class="sr-only">Close menu</span>
    </button>
    <slot></slot>
  </div>
</div>

<style>
  .drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 200;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  .drawer {
    z-index: 1000;
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px;
    height: fit-content;
    display: flex;
    width: 800px;
    transition: all 300ms;
  }

  @media only screen and (max-width: 880px) {
    .drawer {
      right: unset;
      width: 600px;
    }
  }

  .innerDrawer {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 1rem;
    overflow: hidden;
    background-color: white;
    transition: all 300ms;
    border-radius: 0.375rem;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  .close {
    display: inline-flex;
    position: absolute;
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

  .active {
    transform: translateX(0);
  }

  .hidden {
    display: none;
    visibility: hidden;
    transform: translateX(100%);
  }
</style>
