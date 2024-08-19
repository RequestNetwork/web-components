<script lang="ts">
  import { Button as ButtonPrimitive } from "bits-ui";
  import { type Events, type Props } from "./index";

  type $$Props = Props;
  type $$Events = Events;

  let className: $$Props["class"] = undefined;
  export let builders: $$Props["builders"] = [];
  export { className as class };

  $: classes = ["rn-btn", className].filter(Boolean).join(" ");
</script>

<ButtonPrimitive.Root
  {builders}
  class={classes}
  type="button"
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</ButtonPrimitive.Root>

<style lang="scss" global>
  :global(.rn-btn) {
    display: inline-flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition-property: color, background-color, border-color,
      text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    background-color: #0bb489;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    outline: none;
  }

  :global(.rn-btn:focus-visible) {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px var(--ring-color, #000);
  }

  :global(.rn-btn:disabled) {
    pointer-events: none;
    opacity: 0.5;
  }

  :global(.rn-btn:hover) {
    background-color: rgba($color: #0bb489, $alpha: 0.8);
  }
</style>
