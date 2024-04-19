<script lang="ts">
  import { APP_STATUS } from "$src/types/enums";

  export let statuses: APP_STATUS[] = [];

  const statusDetails = {
    [APP_STATUS.AWAITING_INPUT]: {
      message: "Upload your file to our website",
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
      loading: true,
    },
    [APP_STATUS.PERSISTING_ON_CHAIN]: {
      message: "Persisting data on chain",
      icon: "fas fa-shield-alt",
      color: "text-yellow-600",
    },
    [APP_STATUS.REQUEST_CONFIRMED]: {
      message: "Your transaction is confirmed",
      icon: "fas fa-check-double",
      color: "text-dark-green",
    },
    [APP_STATUS.ERROR_OCCURRED]: {
      message: "An error occurred",
      icon: "fas fa-times-circle",
      color: "text-red-500",
    },
  };
</script>

<div class="space-y-2">
  {#each statuses as status}
    <div class="flex items-center">
      <i
        class={`fas fa-${statusDetails[status].icon} ${statusDetails[status].color} mr-2`}
      ></i>
      <p class={statusDetails[status].color}>{statusDetails[status].message}</p>
    </div>
  {/each}
</div>
