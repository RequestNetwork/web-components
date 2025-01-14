<script>
  import Skeleton from "@requestnetwork/shared-components/skeleton.svelte";

  export let config;

  let skeletonConfig = {
    colors: {
      main: "#D9D9D9",
      secondary: "#E7E7E7",
    },
  };
</script>

<div
  class="innerDrawer"
  style="
--mainColor: {config.colors.main};
--secondaryColor: {config.colors.secondary};"
>
  <div class="invoice-view">
    <!-- Invoice Number and Status -->
    <div class="invoice-header">
      <div class="invoice-title">
        <div style="width: 100px">
          <Skeleton config={skeletonConfig} lineCount={1} />
        </div>
      </div>
      <div class="invoice-dates">
        <div style="width: 180px">
          <Skeleton config={skeletonConfig} lineCount={1} />
        </div>
        <div style="width: 180px">
          <Skeleton config={skeletonConfig} lineCount={1} />
        </div>
      </div>
    </div>

    <!-- From Address -->
    <div class="invoice-section">
      <div class="section-label">From:</div>
      <div style="width: 400px">
        <Skeleton config={skeletonConfig} lineCount={1} />
      </div>
    </div>

    <div class="invoice-border"></div>

    <!-- Billed to Address -->
    <div class="invoice-section">
      <div class="section-label">Billed to:</div>
      <div style="width: 400px">
        <Skeleton config={skeletonConfig} lineCount={1} />
      </div>
    </div>

    <!-- Payment Details -->
    <div class="invoice-section">
      <div class="payment-row">
        <div class="section-label">Payment Chain:</div>
        <div style="width: 120px">
          <Skeleton config={skeletonConfig} lineCount={1} />
        </div>
      </div>
      <div class="payment-row">
        <div class="section-label">Invoice Currency:</div>
        <div style="width: 80px">
          <Skeleton config={skeletonConfig} lineCount={1} />
        </div>
      </div>
      <div class="payment-row">
        <div class="section-label">Settlement Currency:</div>
        <div style="width: 120px">
          <Skeleton config={skeletonConfig} lineCount={1} />
        </div>
      </div>
    </div>

    <!-- Table with matched styles -->
    <div class="table-container">
      <table class="invoice-table">
        <thead>
          <tr>
            <th class="th-description">DESCRIPTION</th>
            <th class="th-qty">QTY</th>
            <th class="th-price">UNIT PRICE</th>
            <th class="th-discount">DISCOUNT</th>
            <th class="th-tax">TAX</th>
            <th class="th-amount">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="td-description">
              <div style="width: 200px">
                <Skeleton config={skeletonConfig} lineCount={1} />
              </div>
            </td>
            <td class="td-qty">
              <div style="width: 40px">
                <Skeleton config={skeletonConfig} lineCount={1} />
              </div>
            </td>
            <td class="td-price">
              <div style="width: 80px">
                <Skeleton config={skeletonConfig} lineCount={1} />
              </div>
            </td>
            <td class="td-discount">
              <div style="width: 60px">
                <Skeleton config={skeletonConfig} lineCount={1} />
              </div>
            </td>
            <td class="td-tax">
              <div style="width: 60px">
                <Skeleton config={skeletonConfig} lineCount={1} />
              </div>
            </td>
            <td class="td-amount">
              <div style="width: 80px">
                <Skeleton config={skeletonConfig} lineCount={1} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .innerDrawer {
    position: relative;
    height: 100%;
    padding: 1rem;
    overflow: hidden;
    background-color: white;
    transition: all 300ms;
    border-radius: 0.375rem;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
    border-top: 6px solid var(--mainColor);
    width: 800px;
    margin: 0 auto;
  }

  .invoice-view {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: white;
    width: 100%;
    height: fit-content;
  }

  .invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .invoice-dates {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: right;
  }

  .invoice-section {
    margin-bottom: 24px;
  }

  .section-label {
    font-weight: 500;
    margin-bottom: 8px;
    color: #4b5563;
  }

  .payment-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }

  .table-container {
    margin-top: 24px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .invoice-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .invoice-table th {
    padding: 12px 16px;
    font-size: 11px;
    white-space: nowrap;
    border: none;
    border-spacing: 0;
    background-color: #f6f6f7;
    text-align: left;
  }

  .invoice-table td {
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
  }

  .th-description {
    width: 40%;
  }

  .th-qty,
  .th-discount,
  .th-tax {
    width: 10%;
  }

  .th-price,
  .th-amount {
    width: 15%;
  }

  .td-description {
    width: 40%;
  }

  .td-qty,
  .td-discount,
  .td-tax {
    width: 10%;
  }

  .td-price,
  .td-amount {
    width: 15%;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .invoice-border {
    border-bottom: 1px solid var(--mainColor);
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
</style>
