<svelte:options customElement="add-stakeholder" />

<script>
  import { onMount } from "svelte";

  export let builderKey = ``,
    webhookUrl = ``,
    width = 530,
    height = 760,
    left = 100,
    top = 100;

  function getURL() {
    return [
      `http://app.request.finance/add-stakeholder`,
      [
        `stakeholder-public-key=${builderKey}`,
        `webhook-url=${webhookUrl}`,
      ].join(`&`),
    ].join(`?`);
  }

  function popup() {
    let url = getURL();
    let features = [`popup`, { width }, { height }, { left }, { top }]
      //@ts-ignore
      .map((v) =>
        typeof v == `object`
          ? [Object.keys(v)[0], v[Object.keys(v)[0]]].join(`=`)
          : v
      )
      .join(`,`);

    window.open(url, ``, features);
  }

  onMount(() => {
    popup();
  });
</script>
