<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";

  export let id: string | undefined = undefined;
  export let label = "";
  export let type: HTMLInputTypeAttribute = "text";
  export let placeholder = "";
  export let value: string | number = "";
  export let className = "";
  export let handleInput: ((e: Event) => void) | undefined = undefined;
  export let onBlur: ((e: Event) => void) | undefined = undefined;
  export let disabled = false;
  export let min = "";
  export let max = 0;
  export let style = "";
  export let width = "";
</script>

<div class="input-wrapper">
  {#if label}
    <label for={id} class="input-label">{label}</label>
  {/if}
  <div class={`input-container ${width}`}>
    <div class={`${$$slots.icon ? "text-input-icon" : ""}`}>
      <slot name="icon" />
    </div>

    {#if type === "textarea"}
      <textarea
        {id}
        {value}
        {disabled}
        {placeholder}
        maxlength={max}
        on:input={handleInput}
        class={`textarea-input ${className}`}
      />
    {:else}
      <input
        {id}
        {min}
        {style}
        {value}
        {disabled}
        {...{ type }}
        {placeholder}
        on:blur={onBlur}
        on:input={handleInput}
        class={`text-input ${className} `}
      />
    {/if}
  </div>
</div>

<style>
  .input-wrapper input,
  .input-wrapper textarea {
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    background: transparent;
    box-shadow: none;
    appearance: none;
    box-sizing: border-box;
  }

  .input-wrapper input:disabled,
  .input-wrapper textarea:disabled {
    background-color: #fafafa;
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    gap: 8px;
  }

  .input-wrapper .input-label {
    font-size: 14px;
    color: #4b5563;
  }

  .input-wrapper .input-container {
    position: relative;
  }

  .input-container {
    display: flex;
    align-items: center;
  }

  .input-wrapper .input-icon {
    position: absolute;
    top: 25%;
    left: 3%;
  }

  .input-wrapper .textarea-input {
    border: 1px solid #dfe4ea;
    padding: 8px;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    resize: none;
    width: 100%;
    box-sizing: border-box;
  }

  .input-wrapper .text-input {
    border: 1px solid #dfe4ea;
    padding: 8px;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }

  .input-wrapper .text-input-icon {
    margin-right: 10px;
  }
</style>
