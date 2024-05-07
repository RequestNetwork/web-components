<script lang="ts">
  export let config;
  export let formData: any;

  let newLabel = "";

  const addLabel = () => {
    const trimmedLabel = newLabel.trim();
    if (trimmedLabel && !formData.miscellaneous.labels.includes(trimmedLabel)) {
      formData.miscellaneous.labels = [
        ...formData.miscellaneous.labels,
        trimmedLabel,
      ];
      newLabel = "";
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (formData.miscellaneous.labels.length >= 6) {
        return;
      } else {
        addLabel();
      }
    }
  };

  const removeLabel = (index: number) => {
    formData.miscellaneous.labels = formData.miscellaneous.labels.filter(
      (_: any, i: number) => i !== index
    );
  };
</script>

<div
  class="flex flex-col w-[700px] justify-end gap-[10px] min-h-[104px]"
  style="
  --mainColor: {config.mainColor};
  --secondaryColor: {config.secondaryColor};
"
>
  <div class="flex flex-wrap gap-2">
    {#each formData.miscellaneous.labels as label, index}
      <div class="flex items-center bg-green text-white rounded px-2 label">
        {label}
        <button class="ml-2" on:click={() => removeLabel(index)}>
          <i class="fa fa-times" />
        </button>
      </div>
    {/each}
  </div>
  <input
    type="text"
    class="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none"
    placeholder="Type and press enter to add a label... (Max: 6)"
    bind:value={newLabel}
    on:keydown={handleKeydown}
  />
</div>

<style>
  .label {
    background-color: var(--mainColor);
  }

  .label:hover {
    background-color: var(--secondaryColor);
  }
</style>
