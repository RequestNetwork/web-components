<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  export let text = "";
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
  on:click={onClick}
  {disabled}
  class={`flex items-center gap-[10px] disabled:cursor-not-allowed disabled:bg-grey disabled:text-dark-grey bg-green text-white px-[28px] py-[8px] rounded-[6px] hover:bg-dark-green transition-all text-[14px] ${className}`}
>
  {#if icon}
    <i class={icon.class} style={icon.style}></i>
  {/if}
  {text}
</button>
