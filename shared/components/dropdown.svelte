<script lang="ts">
  import { openDropdown } from "../store/dropwdown";
  import { onMount } from "svelte";

  const CheckIcon = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  export let config;
  export let selectedValue = "";
  export let options: { value: string; label: string; checked?: boolean }[] =
    [];
  export let onchange: (value: string, checked?: boolean) => void;
  export let placeholder: string = "Select an option";
  export let type: "default" | "checkbox" = "default";

  let dropdownId: string;
  let isOpen = false;
  let dropdownContainer: HTMLElement;
  let localOptions = options;
  let focusedIndex = -1;

  const selectOption = (value: string, checked?: boolean) => {
    if (type === "checkbox") {
      localOptions = localOptions.map((option) =>
        option.value === value
          ? { ...option, checked: !option.checked }
          : option
      );
      onchange(value, !checked);
    } else {
      selectedValue =
        options.find((option) => option.value === value)?.label || "";
      onchange(value);
      closeDropdown();
    }
  };

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        openDropdown.set(dropdownId);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusedIndex = Math.min(focusedIndex + 1, localOptions.length - 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusedIndex = Math.max(focusedIndex - 1, 0);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusedIndex >= 0) {
          const option = localOptions[focusedIndex];
          selectOption(option.value, option.checked);
        }
        break;
      case "Escape":
        event.preventDefault();
        closeDropdown();
        break;
    }
  }

  function closeDropdown() {
    isOpen = false;
    openDropdown.set(null);
    focusedIndex = -1;
  }

  function toggleDropdown(event: Event) {
    event.stopPropagation();
    if (!isOpen) {
      focusedIndex = -1;
    }
    openDropdown.set(isOpen ? null : dropdownId);
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

{#if isOpen}
  <div class="dropdown-overlay" on:click={closeDropdown} />
{/if}

<div
  style="--mainColor: {config.colors.main}; --secondaryColor: {config.colors
    .secondary};"
  bind:this={dropdownContainer}
  class="dropdown-wrapper"
>
  <button
    type="button"
    on:click={toggleDropdown}
    on:keydown={handleKeydown}
    class="dropdown-button"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
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
    <div class="dropdown-menu" role="listbox" tabindex="-1">
      <ul class="dropdown-list">
        {#if type === "checkbox"}
          {#each localOptions as option, index}
            <li
              class="dropdown-item"
              class:selected={option.checked}
              class:focused={index === focusedIndex}
              on:click={() => selectOption(option.value, option.checked)}
              role="option"
              aria-selected={option.checked}
              tabindex="-1"
            >
              <span>{option.label}</span>
              <div class="custom-checkbox" class:checked={option.checked}>
                {@html option.checked ? CheckIcon : ""}
              </div>
            </li>
          {/each}
        {:else}
          {#each options as option}
            <li
              class="dropdown-item"
              on:click|stopPropagation={() => selectOption(option.value)}
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
    box-shadow: 0 0 0 2px var(--secondaryColor);
  }

  .dropdown-button-icon {
    width: 16px;
    height: 16px;
  }

  .dropdown-menu {
    z-index: 1200;
    position: absolute;
    width: max-content;
    min-width: 100%;
    top: 55px;
    background-color: white;
    border-radius: 8px;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
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
    justify-content: space-between;
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
  }

  .custom-checkbox.checked {
    background-color: var(--mainColor);
    border-color: var(--mainColor);
  }

  .dropdown-item.focused {
    background-color: #f3f4f6;
  }

  .dropdown-item:focus {
    outline: none;
    background-color: #f3f4f6;
  }
</style>
