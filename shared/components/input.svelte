<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";

  export let id: string | undefined = undefined;
  export let label = "";
  export let type: HTMLInputTypeAttribute = "text";
  export let placeholder = "";
  export let value: string | number = "";
  export let checked: boolean = false;
  export let className = "";
  export let handleInput: ((e: Event) => void) | undefined = undefined;
  export let handleCheckbox: ((e: Event) => void) | undefined = undefined;
  export let onBlur: ((e: Event) => void) | undefined = undefined;
  export let disabled = false;
  export let min = "";
  export let max = 0;
  export let style = "";
  export let width = "";
  export let error: string | null = null;
</script>

<div class="input-wrapper">
  {#if label && type !== "checkbox"}
    <label for={id} class="input-label">{label}</label>
  {/if}

  <div class={`input-container ${width}`}>
    {#if type === "textarea"}
      <textarea
        {id}
        {value}
        {disabled}
        {placeholder}
        maxlength={max}
        on:input={handleInput}
        class={`textarea-input ${className} ${error ? "input-error" : ""}`}
      />
    {:else if type === "checkbox"}
      <label for={id} class="input-label">
        <input
          {id}
          type="checkbox"
          bind:checked
          {disabled}
          class={`checkbox-input ${className} ${error ? "input-error" : ""}`}
          on:click={handleCheckbox}
        />
        {label}
      </label>
    {:else}
      <div class="text-input-wrapper">
        {#if $$slots.icon}
          <div class="input-icon">
            <slot name="icon" class="slot-icon" />
          </div>
        {/if}
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
          class={`text-input ${className} ${error ? "input-error" : ""} ${$$slots.icon ? "has-icon" : ""}`}
        />
      </div>
    {/if}
  </div>

  {#if error?.length > 0}
    <p class="error-message">{error}</p>
  {/if}
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

  .text-input-wrapper {
    position: relative;
    width: 100%;
  }

  .input-wrapper .input-icon {
    position: absolute;
    top: 55%;
    left: 12px;
    transform: translateY(-50%);
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

  .input-wrapper .text-input.has-icon {
    padding-left: 40px;
  }

  .input-wrapper .checkbox-input {
    appearance: auto;
    accent-color: #0bb489;
  }

  /* Error styles */
  .input-error {
    border-color: #e89e14ee;
  }

  .error-message {
    color: #e89e14ee;
    font-size: 12px;
    margin-top: 5px;
  }
</style>
