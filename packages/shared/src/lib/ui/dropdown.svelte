<script lang="ts">
  import { openDropdown } from "../store/dropwdown";
  import { onMount } from "svelte";
  export let config;
  export let selectedValue = "";
  export let options: { value: string; label: string; checked?: boolean }[] =
    [];
  export let onchange: (value: string, checked?: boolean) => void;
  export let placeholder: string = "Select an option";
  export let type: "default" | "checkbox" = "default";

  let dropdownId: string;
  let isOpen = false;

  const selectOption = (value: string, checked?: boolean) => {
    if (type === "checkbox") {
      onchange(value, checked);
    } else {
      selectedValue =
        options.find((option) => option.value === value)?.label || "";
      onchange(value);
      isOpen = false;
      openDropdown.set(null);
    }
  };

  let dropdownContainer: HTMLElement;

  function onWindowClick(e: Event) {
    const target = e.target as Node;
    if (
      dropdownContainer &&
      !dropdownContainer.contains(target) &&
      type !== "checkbox"
    ) {
      isOpen = false;
      openDropdown.set(null);
    }
  }

  let unsubscribe: () => void;

  onMount(() => {
    dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

    unsubscribe = openDropdown.subscribe((currentOpenDropdown) => {
      isOpen = currentOpenDropdown === dropdownId;
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<svelte:window on:click={onWindowClick} />

<div
  style="
--mainColor: {config.colors.main};
--secondaryColor: {config.colors.secondary};"
  bind:this={dropdownContainer}
  class="dropdown-wrapper"
>
  <button
    type="button"
    on:click|stopPropagation={() =>
      openDropdown.set(isOpen ? null : dropdownId)}
    class="dropdown-button"
  >
    {type === "default" ? selectedValue || placeholder : placeholder}
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
      <ul class="dropdown-list">
        {#if type === "checkbox"}
          {#each options as option}
            <li class="dropdown-checbox-list">
              <input
                id={`checkbox-${option.value}`}
                type="checkbox"
                bind:checked={option.checked}
                class="dropdown-checkbox-item:focus"
                on:change|stopPropagation={() =>
                  selectOption(option.value, option.checked)}
              />
              <label
                for={`checkbox-${option.value}`}
                class={`dropdown-checkbox-item-label ${option.checked ? "dropdown-checkbox-item-label-checked" : ""}`}
              >
                {option.label}
              </label>
            </li>
          {/each}
        {:else}
          {#each options as option}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li
              class="dropdown-checkbox-option"
              on:click={() => selectOption(option.value)}
            >
              {option.label}
            </li>
          {/each}
        {/if}
      </ul>
    </div>
  {/if}
</div>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  button {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .dropdown-wrapper {
    position: relative;
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
    width: 100%;
    min-width: 190px;
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
    z-index: 10;
    position: absolute;
    width: 100%;
    top: 55px;
    background-color: white;
    border-radius: 8px;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .dropdown-menu > * + * {
    border-top-width: 1px;
    border-bottom-width: 0px;
    border-color: #f3f4f6;
  }

  .dropdown-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px;
    color: #e5e7eb;
    list-style: none;
  }

  .dropdown-checbox-list {
    display: flex;
    align-items: center;
  }

  .dropdown-checkbox-item {
    width: 16px;
    height: 16px;
    background-color: #328965;
    border: 1px solid #d1d5db;
    border-radius: 4px;
  }

  .dropdown-checkbox-item:focus {
    outline: none;
    box-shadow:
      0 0 0 2px #57e1a5,
      0 0 0 1px #374151;
  }

  .dropdown-checkbox-item-label {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    cursor: pointer;
    color: #d1d5db;
    width: 100%;
  }
  .dropdown-checkbox-item-label-checked {
    color: black;
  }

  .dropdown-checkbox-option {
    color: black;
    cursor: pointer;
    background-color: white;
    padding: 12px;
  }

  .dropdown-checkbox-option:hover {
    background-color: #f3f4f6;
  }
</style>
