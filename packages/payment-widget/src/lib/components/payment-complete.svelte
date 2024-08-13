<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let isVisible = false;

  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });
</script>

<div class="payment-complete" transition:fade={{ duration: 300 }}>
  <div class="checkmark-container">
    <svg
      class="checkmark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
    >
      <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
      <path
        class="checkmark__check"
        fill="none"
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
      />
    </svg>
  </div>
  <h2>Payment Complete</h2>
  <p>Thank you for your payment. Your transaction was successful.</p>
</div>

<style>
  .payment-complete {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
  }

  .checkmark-container {
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #4caf50;
    border-radius: 50%;
  }

  h2 {
    margin-top: 1rem;
    font-size: 1.5rem;
    color: #4caf50;
  }

  p {
    margin-top: 0.5rem;
    font-size: 1rem;
    color: #666;
  }

  .checkmark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: block;
    stroke-width: 3;
    stroke: #fff;
    stroke-miterlimit: 10;
    animation: scale 0.3s ease-in-out 0.9s both;
  }

  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 3;
    stroke-miterlimit: 10;
    stroke: #fff;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }
</style>
