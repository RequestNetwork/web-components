<script lang="ts">
  import { APP_STATUS } from "$src/types/enums";

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

<ol class="relative mb-[32px]">
  {#each statuses as status, index}
    <li class="mb-10 ms-5">
      <span
        class="flex absolute -start-1 justify-center items-center w-[29px] h-6 bg-blue-100 rounded-full ring-8 ring-white p-[20px]"
      >
        <i
          class={`fas ${statusDetails[status].icon} ${statusDetails[status].color}`}
        ></i>
      </span>
      <div class="ml-[40px] text-left">
        <h3 class="mb-1 text-lg font-semibold text-gray-900">
          {statusDetails[status].message}
        </h3>
        <p class="text-sm font-normal text-gray-400">
          {#if index === statuses?.length - 1 && statuses?.length < 3}
            <div
              class="px-3 py-2 text-xs font-medium leading-none text-center rounded-full animate-pulse bg-green text-white w-fit"
            >
              Loading...
            </div>
          {:else}
            <div
              class="px-3 py-2 text-xs font-medium leading-none text-center rounded-full bg-green text-white w-fit"
            >
              Completed
            </div>
          {/if}
        </p>
      </div>
    </li>
  {/each}
</ol>
