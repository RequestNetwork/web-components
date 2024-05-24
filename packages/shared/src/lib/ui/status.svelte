<script lang="ts">
  import Upload from "../icons/upload.svelte";
  import Persist from "../icons/persist.svelte";
  import Sync from "../icons/sync.svelte";
  import Shield from "../icons/shield.svelte";
  import Close from "../icons/close.svelte";
  import Check from "../icons/check.svelte";
  import { APP_STATUS } from "../types/enums";

  export let config;
  export let statuses: APP_STATUS[] = [];

  const statusDetails = {
    [APP_STATUS.AWAITING_INPUT]: {
      message: "Waiting for input",
      icon: Upload,
      color: "text-green-500",
    },
    [APP_STATUS.SUBMITTING]: {
      message: "Submitting your data",
      icon: Persist,
      color: "text-green-500",
    },
    [APP_STATUS.PERSISTING_TO_IPFS]: {
      message: "Persisting data to IPFS",
      icon: Sync,
      color: "text-blue-500",
      time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    },
    [APP_STATUS.PERSISTING_ON_CHAIN]: {
      message: "Persisting data on chain",
      icon: Shield,
      color: "text-yellow-600",
      time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    },
    [APP_STATUS.REQUEST_CONFIRMED]: {
      message: "Your transaction is confirmed",
      icon: Check,
      color: "text-green-500",
      time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    },
    [APP_STATUS.ERROR_OCCURRED]: {
      message: "An error occurred",
      icon: Close,
      color: "status-error",
    },
  };
</script>

<ol
  class="status-wrapper"
  style="
--mainColor: {config.colors.main};
--secondaryColor: {config.colors.secondary};"
>
  {#each statuses as status, index}
    <li class="status-list">
      <span class={`status-icon-wrapper ${statusDetails[status].color}`}>
        <svelte:component this={statusDetails[status].icon} />
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
    height: 29px;
    background-color: #dbeafe;
    border-radius: 9999px;
    padding: 4px;
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
    background-color: var(--mainColor);
    color: white;
    width: fit-content;
  }

  .status-pulsing {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .status-error {
    fill: #ef4444;
    color: #ef4444;
  }
</style>
