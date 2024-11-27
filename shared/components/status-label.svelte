<script lang="ts">
  import { capitalize } from "../utils/capitalize";

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
      case "awaiting payment":
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
        statusClass = "status-created";
    }
  }
</script>

<div class={`status-indicator ${statusClass}`}>
  {capitalize(status)}
</div>

<style>
  .status-indicator {
    text-align: center;
    padding: 6px 12px;
    text-align: center;
    width: fit-content;
    border-radius: 8px;
    font-weight: 500;
  }

  .status-paid {
    color: #328965;
    background-color: rgba(88, 225, 165, 0.15);
  }

  .status-partially-paid {
    color: #328965;
    background: linear-gradient(
      135deg,
      rgba(88, 225, 165, 0.2) 25%,
      white 25%,
      white 50%,
      rgba(88, 225, 165, 0.2) 50%,
      rgba(88, 225, 165, 0.2) 75%,
      white 75%,
      white 100%
    );
    background-size: 20px 20px;
  }

  .status-accepted {
    color: #006ebe;
    background-color: rgba(90, 186, 255, 0.15);
  }

  .status-created {
    color: #c99101;
    background-color: rgba(255, 197, 49, 0.15);
  }

  .status-canceled {
    color: #212121;
    background-color: rgba(37, 37, 37, 0.15);
  }

  .status-rejected {
    color: #d9601c;
    background-color: rgba(255, 135, 67, 0.15);
  }

  .status-overdue {
    color: #d91c1c;
    background-color: rgba(255, 49, 49, 0.15);
  }

  .status-pending {
    color: #7b7b7b;
    background-color: rgba(224, 224, 224, 0.15);
  }
</style>
