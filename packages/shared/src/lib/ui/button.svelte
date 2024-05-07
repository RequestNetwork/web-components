<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  export let text = "";
  export let padding = "px-[28px] py-[8px]";
  export let onClick: any;
  export let disabled = false;
  export let className = "";
  export let icon: {
    class: string;
    style: string;
  } | null = null;
  export let type: HTMLButtonAttributes["type"] = "button";
</script>

<button
  {type}
  {disabled}
  on:click={onClick}
  class={`flex items-center gap-[10px] disabled:cursor-not-allowed disabled:text-dark-grey text-white rounded-[8px] transition-all text-[14px] hover:-translate-y-[2px] ${padding} ${className} main-button`}
>
  {#if icon}
    <i class={icon.class} style={icon.style}></i>
  {/if}
  {text}
</button>

<style>
  .main-button {
    background-color: var(--mainColor);
  }

  .main-button:hover {
    background-color: var(--secondaryColor);
  }

  .main-button:disabled {
    background-color: #e4e4e4;
  }
</style>
