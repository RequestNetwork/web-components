<script lang="ts">
  export let options: {
    value: any;
    label: any;
  }[] = [];
  export let selected: string = "";
  export let placeholder: string = "Select an option";
  export let onchange: (value: string) => void;

  let isOpen = false;

  function selectOption(value: string) {
    selected = value;
    if (onchange) {
      onchange(value);
    }
    isOpen = false;
  }
</script>

<div class="relative">
  <button
    class="w-full min-w-[150px] cursor-pointer bg-white border border-gray-300 p-2 rounded-md"
    on:click={() => (isOpen = !isOpen)}
    on:keydown={(event) => {
      if (event.key === "Enter") isOpen = !isOpen;
    }}
  >
    {selected ? options.find((o) => o.value === selected)?.label : placeholder}
  </button>
  {#if isOpen}
    <div
      class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md z-10"
    >
      {#each options as option}
        <button
          type="button"
          class="w-full p-2 hover:bg-gray-100 {option.value === selected
            ? 'bg-gray-200'
            : ''}"
          on:click={() => selectOption(option.value)}
        >
          {option.label}
        </button>
      {/each}
    </div>
  {/if}
</div>
