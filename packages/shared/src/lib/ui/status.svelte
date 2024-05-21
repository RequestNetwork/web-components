<script lang="ts">
  import { APP_STATUS } from "../types/enums";

  export let statuses: APP_STATUS[] = [];

  const statusDetails = {
    [APP_STATUS.AWAITING_INPUT]: {
      message: "Waiting for input",
      icon: "fas fa-upload",
      color: "text-green-500",
    },
    [APP_STATUS.SUBMITTING]: {
      message: "Submitting your data",
      icon: "fas fa-file-export",
      color: "text-green-500",
    },
    [APP_STATUS.PERSISTING_TO_IPFS]: {
      message: "Persisting data to IPFS",
      icon: "fas fa-sync",
      color: "text-blue-500",
      time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    },
    [APP_STATUS.PERSISTING_ON_CHAIN]: {
      message: "Persisting data on chain",
      icon: "fas fa-shield-alt",
      color: "text-yellow-600",
      time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    },
    [APP_STATUS.REQUEST_CONFIRMED]: {
      message: "Your transaction is confirmed",
      icon: "fas fa-check-double",
      color: "text-green-500",
      time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    },
    [APP_STATUS.ERROR_OCCURRED]: {
      message: "An error occurred",
      icon: "fas fa-times-circle",
      color: "text-red-500",
    },
  };
</script>

<ol class="status-wrapper">
  {#each statuses as status, index}
    <li class="status-list">
      <span class="status-icon-wrapper">
        <i
          class={`fas ${statusDetails[status].icon} ${statusDetails[status].color}`}
        ></i>
      </span>
      <div class="status-details">
        <h3 class="status-message">
          {statusDetails[status].message}
        </h3>
        <p class="status-description">
          {#if index === statuses?.length - 1 && statuses?.length < 3}
            <div class="status-action status-pulsing">Loading...</div>
          {:else}
            <div class="status-action">Completed</div>
          {/if}
        </p>
      </div>
    </li>
  {/each}
</ol>

<style>
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  ol,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .status-wrapper {
    position: relative;
    margin-bottom: 32px;
  }

  .status-list {
    margin-bottom: 10px;
    margin-inline-start: 1.25rem;
  }

  .status-icon-wrapper {
    display: flex;
    position: absolute;
    inset-inline-start: 4px;
    justify-content: center;
    align-items: center;
    width: 29px;
    height: 24px;
    background-color: #dbeafe;
    border-radius: 9999px;
    padding: 20px;
    box-shadow: 0 0 0 8px white;
  }

  .status-details {
    margin-left: 40px;
    text-align: left;
  }

  .status-message {
    margin-bottom: 4px;
    font-size: 18px;
    line-height: 28px;
    font-weight: 600;
    color: #111827;
  }

  .status-description {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: #9ca3af;
  }

  .status-action {
    padding: 8px 12px;
    font-size: 14px;
    line-height: 1px;
    font-weight: 500;
    text-align: center;
    border-radius: 9999px;
    background-color: #0bb489;
    color: white;
    width: fit-content;
  }

  .status-pulsing {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
