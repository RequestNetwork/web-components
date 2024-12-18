<script lang="ts">
  import Network from "@requestnetwork/shared-icons/network/network-icon.svelte";

  export let items: any[] = [];
  export let placeholder = "Search...";
  export let onSelect: (item: any) => void;
  export let getValue: (item: any) => string;
  export let getDisplayValue: (item: any) => string;
  export let disabled = false;

  let searchTerm = "";
  let isOpen = false;
  let filteredItems: any[] = [];
  let selectedIndex = -1;
  let dropdownElement: HTMLDivElement;

  $: filteredItems = searchTerm
    ? items.filter((item) => {
        const value = getValue(item)?.toString() || "";
        const secondaryValue = getDisplayValue?.(item)?.toString() || "";
        const search = searchTerm.toLowerCase();

        return (
          value.toLowerCase().includes(search) ||
          secondaryValue.toLowerCase().includes(search)
        );
      })
    : items;

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filteredItems.length - 1);
        scrollSelectedIntoView();
        break;
      case "ArrowUp":
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        scrollSelectedIntoView();
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
          selectItem(filteredItems[selectedIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        isOpen = false;
        selectedIndex = -1;
        break;
    }
  }

  function scrollSelectedIntoView() {
    if (dropdownElement && selectedIndex >= 0) {
      const selectedElement = dropdownElement.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }

  function selectItem(item: any) {
    onSelect(item.value);
    searchTerm = getValue(item);
    isOpen = false;
    selectedIndex = -1;
  }

  $: if (!isOpen) selectedIndex = -1;
</script>

{#if isOpen && !disabled}
  <div class="dropdown-overlay" on:click={() => (isOpen = false)} />
{/if}

<div class="searchable-dropdown" class:disabled>
  <div class="input-wrapper">
    <input
      type="text"
      {placeholder}
      bind:value={searchTerm}
      on:focus={() => !disabled && (isOpen = true)}
      on:keydown={handleKeydown}
      {disabled}
    />
    <svg
      class="search-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
  {#if isOpen && !disabled}
    <div class="dropdown-list" bind:this={dropdownElement}>
      {#each filteredItems as item, index}
        <div
          class="dropdown-item"
          class:selected={index === selectedIndex}
          on:click={() => selectItem(item)}
          on:mouseenter={() => (selectedIndex = index)}
        >
          {#if item.type === "network"}
            <Network network={item.value} showLabel={false} />
          {/if}
          <span>{getDisplayValue ? getDisplayValue(item) : getValue(item)}</span
          >
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
    position: relative;
    padding: 8px 12px 8px 36px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    width: 75%;
  }

  .searchable-dropdown input:focus {
    outline: none;
    border-color: #58e1a5;
    box-shadow: 0 0 0 1px #58e1a5;
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
    z-index: 1200;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .dropdown-item:hover {
    background-color: #f5f5f5;
  }

  .secondary-value {
    color: #666;
    font-size: 0.9em;
  }

  .dropdown-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
  }

  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .disabled input {
    cursor: not-allowed;
    background-color: #f5f5f5;
  }

  .input-wrapper {
    position: relative;
    width: 100%;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #666;
    pointer-events: none;
    z-index: 1;
  }

  .dropdown-item.selected {
    background-color: #f0f0f0;
  }
</style>
