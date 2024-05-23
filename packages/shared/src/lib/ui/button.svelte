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
  class={`button ${padding} ${className} main-button`}
>
  {#if icon}
    <i class={icon.class} style={icon.style}></i>
  {/if}
  <slot name="icon" />
  {text}
</button>

<style>
  button {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .button {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    border-radius: 8px;
    transition: all;
    font-size: 14px;
  }

  .button:disabled {
    cursor: not-allowed;
    color: #5a5a5a;
  }

  .button:hover {
    transform: translateY(-2px);
  }

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
