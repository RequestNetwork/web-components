<script lang="ts">
  import Close from "../icons/close.svelte";

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
  class="labels-wrapper"
  style="
  --mainColor: {config.mainColor};
  --secondaryColor: {config.secondaryColor};
"
>
  <div class="labels-container">
    {#each formData.miscellaneous.labels as label, index}
      <div class="label-item">
        {label}
        <button type="button" on:click={() => removeLabel(index)}>
          <i>
            <Close />
          </i>
        </button>
      </div>
    {/each}
  </div>
  <input
    type="text"
    class="label-input"
    placeholder="Type and press enter to add a label... (Max: 6)"
    bind:value={newLabel}
    on:keydown={handleKeydown}
  />
</div>

<style>
  button {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .labels-wrapper {
    display: flex;
    flex-direction: column;
    width: 700px;
    justify-content: end;
    gap: 10px;
    min-height: 104px;
  }

  .labels-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .label-item {
    display: flex;
    align-items: center;
    background-color: #0bb489;
    color: white;
    border-radius: 4px;
    padding: 0px 8px;
    background-color: var(--mainColor);
  }

  .label-item:hover {
    background-color: var(--secondaryColor);
  }

  .label-item button {
    margin-left: 8px;
  }

  .label-input {
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 4px 8px;
    width: 100%;
  }

  .label-input:hover {
    outline: none;
  }
</style>
