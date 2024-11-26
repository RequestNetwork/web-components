<script lang="ts">
  export let items: any[] = [];
  export let placeholder = "Search...";
  export let onSelect: (item: any) => void;
  export let getValue: (item: any) => string;
  export let getDisplayValue: (item: any) => string;
  export let getSecondaryValue: (item: any) => string;

  let searchTerm = "";
  let isOpen = false;

  $: filteredItems = items.filter(
    (item) =>
      getValue(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (getSecondaryValue &&
        getSecondaryValue(item)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".searchable-dropdown")) {
      isOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="searchable-dropdown">
  <input
    type="text"
    {placeholder}
    bind:value={searchTerm}
    on:focus={() => (isOpen = true)}
  />
  {#if isOpen}
    <div class="dropdown-list">
      {#each filteredItems as item}
        <div
          class="dropdown-item"
          on:click={() => {
            onSelect(item);
            searchTerm = getValue(item);
            isOpen = false;
          }}
        >
          <span>{getDisplayValue ? getDisplayValue(item) : getValue(item)}</span
          >
          {#if getSecondaryValue}
            <span class="secondary-value">{getSecondaryValue(item)}</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .searchable-dropdown {
    position: relative;
    width: 100%;
  }

  .searchable-dropdown input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  .dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dropdown-item:hover {
    background-color: #f5f5f5;
  }

  .secondary-value {
    color: #666;
    font-size: 0.9em;
  }
</style>
