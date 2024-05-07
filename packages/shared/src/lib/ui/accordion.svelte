<script lang="ts">
  export let title: string;
  export let isOpen: boolean = false;
  export let icon: string = "fa-chevron-down";
  export let closeIcon: string = "fa-chevron-up";

  const toggle = () => {
    isOpen = !isOpen;
  };
</script>

<div>
  <button
    on:click={toggle}
    class="text-[14px] flex items-center justify-between w-full pt-[10px] pb-[20px] font-medium text-gray-500 hover:text-gray-900 gap-3 transition-all duration-200 ease-in-out"
  >
    <span>{title}</span>
    {#if !isOpen}
      <i class={`fas ${icon}`}></i>
    {:else}
      <i class={`fas ${closeIcon} transform rotate-180`}></i>
    {/if}
  </button>
  {#if isOpen}
    <div class="pb-5 bg-white text-gray-900">
      <slot />
    </div>
  {/if}
</div>
