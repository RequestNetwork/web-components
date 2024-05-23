<script lang="ts">
  import ChevronDown from "../icons/chevron-down.svelte";
  import ChevronUp from "../icons/chevron-up.svelte";

  export let title: string;
  export let isOpen: boolean = false;

  const toggle = () => {
    isOpen = !isOpen;
  };
</script>

<div>
  <button type="button" on:click={toggle} class="accordion-wrapper">
    <span>{title}</span>
    {#if !isOpen}
      <i>
        <ChevronDown />
      </i>
    {:else}
      <i>
        <ChevronUp />
      </i>
    {/if}
  </button>
  {#if isOpen}
    <div class="accordion-open">
      <slot />
    </div>
  {/if}
</div>

<style>
  button {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .accordion-wrapper {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0px 20px 0px;
    font-weight: 500;
    transition: all;
    transition-duration: 200ms;
    animation: ease-in-out;
    gap: 12px;
    color: #6b7280;
  }

  .accordion-wrapper:hover {
    color: #111827;
  }

  .accordion-open {
    padding-bottom: 20px;
    background-color: white;
    color: #111827;
  }

  .accordion-close-icon {
    transform: rotate(180deg);
  }
</style>
