<script lang="ts">
  export let active = false;
  export let onClose: () => void;
</script>

<div
  class={`absolute top-[200px] right-0 h-fit  flex ${active ? "" : "hidden"} w-[800px] ${
    active ? "translate-x-0" : "translate-x-full"
  } transition-all duration-300`}
>
  <div
    class="relative h-full p-4 overflow-y-auto bg-white transition-transform duration-300 rounded-md shadow-lg w-full"
  >
    <button
      class="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-8 h-8 text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900"
      on:click={onClose}
      aria-label="Close drawer"
    >
      <span class="fa fa-times"></span>
      <span class="sr-only">Close menu</span>
    </button>
    <slot></slot>
  </div>
</div>
