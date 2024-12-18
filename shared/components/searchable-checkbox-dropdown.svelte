<script lang="ts">
  import type { IConfig } from "../types";
  import Input from "./input.svelte";
  import TxType from "./tx-type.svelte";
  import StatusLabel from "./status-label.svelte";
  import NetworkIcon from "../icons/network/network-icon.svelte";

  export let config: IConfig;
  export let options: { value: string; checked?: boolean }[] = [];
  export let onchange: (selectedValues: string[]) => void;
  export let placeholder: string = "Select options";
  export let type: "network" | "transaction" | "status" = "network";
  export let searchPlaceholder: string = "Search options...";
  export let noSearch: boolean = false;

  const CheckIcon = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  let isOpen = false;
  let searchTerm = "";
  let dropdownContainer: HTMLElement;

  $: filteredOptions = options.filter((option) =>
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectOption = (value: string) => {
    options = options.map((option) =>
      option.value === value ? { ...option, checked: !option.checked } : option
    );

    const selectedValues = options
      .filter((option) => option.checked)
      .map((option) => option.value);

    onchange(selectedValues);
  };

  function handleSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    searchTerm = input.value;
  }

  function closeDropdown() {
    isOpen = false;
  }

  function toggleDropdown(event: Event) {
    event.stopPropagation();
    isOpen = !isOpen;
  }
</script>

{#if isOpen}
  <div class="dropdown-overlay" on:click={closeDropdown} />
{/if}

<div
  style="--mainColor: {config.colors.main}; --secondaryColor: {config.colors
    .secondary};"
  bind:this={dropdownContainer}
  class="dropdown-wrapper"
>
  <button type="button" on:click={toggleDropdown} class="dropdown-button">
    {placeholder}
    <svg class="dropdown-button-icon" fill="none" viewBox="0 0 20 20">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M6 8l4 4 4-4"
      />
    </svg>
  </button>

  {#if isOpen}
    <div class="dropdown-menu">
      {#if !noSearch}
        <div class="search-container">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            handleInput={handleSearchInput}
          />
        </div>
      {/if}
      <ul class="dropdown-list">
        {#each filteredOptions as option}
          <li
            class="dropdown-item"
            class:selected={option.checked}
            on:click={() => selectOption(option.value)}
          >
            {#if type === "network"}
              <div class="network-icon">
                <NetworkIcon network={option.value} />
              </div>
            {:else if type === "transaction"}
              <TxType type={option.value} />
            {:else if type === "status"}
              <div class="status-label-wrapper">
                <StatusLabel status={option.value} />
              </div>
            {/if}
            <div class="custom-checkbox" class:checked={option.checked}>
              {@html option.checked ? CheckIcon : ""}
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .dropdown-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
  }

  .dropdown-wrapper {
    position: relative;
    width: fit-content;
  }

  .dropdown-button {
    color: black;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    border: 1px solid #d1d5db;
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    width: auto;
    min-width: max-content;
    cursor: pointer;
    gap: 8px;
  }

  .dropdown-button:focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--secondaryColor);
  }

  .dropdown-button-icon {
    margin-left: 8px;
    width: 16px;
    height: 16px;
  }

  .dropdown-menu {
    z-index: 1200;
    position: absolute;
    width: fit-content;
    min-width: 100%;
    top: 55px;
    background-color: white;
    border-radius: 8px;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .search-container {
    padding: 8px;
    border-bottom: 1px solid #f3f4f6;
  }

  .dropdown-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    list-style: none;
    max-height: 200px;
    overflow-y: auto;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .status-label-wrapper {
    margin-right: 8px;
  }

  .dropdown-item:hover {
    background-color: #f3f4f6;
  }

  .custom-checkbox {
    width: 14px;
    height: 14px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
  }

  .custom-checkbox.checked {
    background-color: var(--mainColor);
    border-color: var(--mainColor);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .network-icon {
    font-size: 14px;
  }

  .network-icon :global(span) {
    font-size: 14px !important;
  }
</style>
