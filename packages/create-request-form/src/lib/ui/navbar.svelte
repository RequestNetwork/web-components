<script lang="ts">
  import { page } from "$app/stores";
  import { connectWallet } from "$utils/connectWallet";
  import { requestNetworkStore } from "$stores/requestNetworkStore";
  import Button from "./button.svelte";

  let signer: string | undefined;
  requestNetworkStore.subscribe((value) => {
    signer = value?.signer;
  });

  const links = [
    {
      name: "My dashboard",
      href: "/",
    },
    {
      name: "Create a Request",
      href: "/create-request",
    },
  ];

  const formatWalletAddress = (
    address: string,
    first: number = 6,
    last: number = 4
  ): string => {
    if (address.length < first + last) {
      throw new Error("Address too short to format properly.");
    }

    return `${address.slice(0, first)}...${address.slice(-last)}`;
  };
</script>

<nav
  class="h-full flex items-center p-[20px] gap-[60px] bg-white shadow-small mb-[80px]"
>
  <a href="/"
    ><img
      src="assets/logo.svg"
      alt="Request Network Logo"
      class="w-[120px]"
    /></a
  >
  <ul class="h-full flex gap-[60px]">
    {#each links as link}
      <li class={`h-full relative`}>
        <a href={link.href}>{link.name}</a>
        <div
          class={`${$page.url.pathname === link.href && "h-[4px] bg-light-green w-full absolute bottom-[-28px]"}`}
        ></div>
      </li>
    {/each}
  </ul>
  <Button
    text={signer ? formatWalletAddress(signer) : "Connect Wallet"}
    onClick={connectWallet}
    className="ml-auto"
  />
</nav>
