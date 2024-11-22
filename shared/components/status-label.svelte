<script lang="ts">
  export let status: string;

  let statusClass = "";

  $: {
    switch (status.toLowerCase()) {
      case "paid":
        statusClass = "status-paid";
        break;
      case "partially paid":
        statusClass = "status-partially-paid";
        break;
      case "accepted":
        statusClass = "status-accepted";
        break;
      case "created":
        statusClass = "status-created";
        break;
      case "canceled":
        statusClass = "status-canceled";
        break;
      case "rejected":
        statusClass = "status-rejected";
        break;
      case "overdue":
        statusClass = "status-overdue";
        break;
      case "pending":
        statusClass = "status-pending";
        break;
      default:
        statusClass = "";
    }
  }
</script>

<div class={`status-indicator ${statusClass}`}>
  {status}
</div>

<style>
  .status-indicator {
    text-align: center;
    padding: 6px 12px;
    text-align: center;
    min-width: 84px;
    border-radius: 8px;
  }

  .status-paid {
    color: #328965;
    background-color: #58e1a5;
  }

  .status-partially-paid {
    background: linear-gradient(135deg, green 50%, white 50%);
  }

  .status-accepted {
    color: #006ebe;
    background-color: #5abaff;
  }

  .status-created {
    color: #c99101;
    background-color: #ffc531;
  }

  .status-canceled {
    color: #212121;
    background-color: #252525;
  }

  .status-rejected {
    color: #d9601c;
    background-color: #ff8743;
  }

  .status-overdue {
    color: #d91c1c;
    background-color: #ff3131;
  }

  .status-pending {
    color: #7b7b7b;
    background-color: #e0e0e0;
  }
</style>
