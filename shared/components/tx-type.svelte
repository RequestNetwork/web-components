<script lang="ts">
  export let type: "IN" | "OUT";

  $: isOut = type === "OUT";
</script>

<div class="tx" class:out={isOut} class:in={!isOut}>
  {type}
</div>

<style>
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
</style>
