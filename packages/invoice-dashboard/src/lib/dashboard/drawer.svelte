<script lang="ts">
  import { Close } from "@requestnetwork/shared";

  export let active = false;
  export let onClose: () => void;
</script>

<div class={`drawer ${active ? "active" : "hidden"} `}>
  <div class="innerDrawer">
    <button class="close" on:click={onClose} aria-label="Close drawer">
      <Close />
      <span class="sr-only">Close menu</span>
    </button>
    <slot></slot>
  </div>
</div>

<style>
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
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px;
    height: fit-content;
    display: flex;
    width: 800px;
    transition: all 300ms;
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
