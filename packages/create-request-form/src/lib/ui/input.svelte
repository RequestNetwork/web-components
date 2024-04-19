<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";

  export let id: string;
  export let type: HTMLInputTypeAttribute = "text";
  export let placeholder: string = "";
  export let value: string | number = "";
  export let className: string = "";
  export let handleInput: (e: Event) => void;
  export let disabled: boolean = false;
</script>

<input
  {id}
  {...{ type }}
  {placeholder}
  {value}
  {disabled}
  class={`border p-2 rounded-md outline-none text-[14px] ${className}`}
  on:input={handleInput}
/>
