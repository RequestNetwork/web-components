<script lang="ts">
  export let selectedValue = "";
  export let options: { value: string; label: string; checked?: boolean }[] =
    [];
  export let onchange: (value: string, checked?: boolean) => void;
  export let placeholder: string = "Select an option";
  export let type: "default" | "checkbox" = "default";

  let isOpen = false;

  const selectOption = (value: string, checked?: boolean) => {
    if (type === "checkbox") {
      onchange(value, checked);
    } else {
      selectedValue =
        options.find((option) => option.value === value)?.label || "";
      onchange(value);
      isOpen = false;
    }
  };
</script>

<div class="relative">
  <button
    on:click={() => (isOpen = !isOpen)}
    class="text-black justify-between bg-white border border-gray-300 p-2 rounded-md focus:ring-1 focus:outline-none focus:ring-light-green font-medium text-sm px-5 py-2.5 text-center inline-flex items-center w-full min-w-[190px]"
  >
    {type === "default" ? selectedValue || placeholder : placeholder}
    <svg class="ml-2 w-4 h-4" fill="none" viewBox="0 0 20 20">
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
    <div
      class="z-10 absolute w-full top-[55px] bg-white rounded-lg shadow divide-y divide-gray-100"
    >
      <ul class="text-gray-200 flex flex-col gap-[4px]">
        {#if type === "checkbox"}
          {#each options as option}
            <li class="flex items-center p-3">
              <input
                id={`checkbox-${option.value}`}
                type="checkbox"
                bind:checked={option.checked}
                class="w-4 h-4 bg-dark-green border-gray-300 rounded focus:ring-light-green ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2"
                on:change={() => selectOption(option.value, option.checked)}
              />
              <label
                for={`checkbox-${option.value}`}
                class={`ml-2 text-sm font-medium cursor-pointer ${option.checked ? "text-black" : "text-gray-300"} w-full`}
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
              class="text-black cursor-pointer hover:bg-gray-100 bg-white p-3 w-full"
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
