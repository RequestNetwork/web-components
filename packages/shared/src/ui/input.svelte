<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";

  export let id: string | undefined = undefined;
  export let label = "";
  export let type: HTMLInputTypeAttribute = "text";
  export let placeholder = "";
  export let value: string | number = "";
  export let className = "";
  export let handleInput: ((e: Event) => void) | undefined = undefined;
  export let disabled = false;
  export let min = "";
  export let max = 0;
  export let style = "";
  export let width = "";
  export let icon = "";
</script>

<div class="flex flex-col w-full gap-[8px]">
  {#if label}
    <label for={id} class="text-[14px] text-gray-600">{label}</label>
  {/if}
  <div class={`relative ${width}`}>
    {#if icon}
      <i class={`absolute top-[25%] left-[3%] ${icon}`}></i>
    {/if}
    {#if type === "textarea"}
      <textarea
        {id}
        {value}
        {disabled}
        {placeholder}
        maxlength={max}
        on:input={handleInput}
        class={`border p-2 rounded-md outline-none text-[14px] resize-none w-full ${className}`}
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
        on:input={handleInput}
        class={`border p-2 rounded-md outline-none text-[14px] w-full ${className} ${icon && "pl-8"}`}
      />
    {/if}
  </div>
</div>
