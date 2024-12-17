<script lang="ts">
  export let type: "IN" | "OUT";
  export let showBoth: boolean = false;

  $: isOut = type === "OUT";
</script>

{#if showBoth}
  <div class="tx-group">
    <div class="tx in overlap">IN</div>
    <div class="tx out overlap">OUT</div>
  </div>
{:else}
  <div class="tx" class:out={isOut} class:in={!isOut}>
    {type}
  </div>
{/if}

<style>
  .tx-group {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .tx {
    padding: 8px 0px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    max-width: 40px;
    width: 100%;
    text-align: center;
  }

  .out {
    background-color: rgba(255, 197, 49, 0.25);
    color: #be7117;
  }

  .in {
    background-color: rgba(11, 180, 137, 0.25);
    color: #01503a;
  }

  .overlap {
    width: 120px;
    position: absolute;
  }

  .overlap.in {
    left: -14px;
  }

  .overlap.out {
    left: 14px;
  }
</style>
