<script lang="ts">
  import type { BuyerInfo, PaymentStep } from "../types";

  export let currentPaymentStep: PaymentStep;

  export let buyerInfo: BuyerInfo;

  let errors: Partial<Record<keyof BuyerInfo, string>> = {};

  function validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  function validateForm(): boolean {
    errors = {};
    let isValid = true;

    if (!buyerInfo.email || !validateEmail(buyerInfo.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!buyerInfo.firstName) {
      errors.firstName = "First name is required";
      isValid = false;
    }

    if (!buyerInfo.lastName) {
      errors.lastName = "Last name is required";
      isValid = false;
    }

    if (buyerInfo.phone && !/^\+?[1-9]\d{1,14}$/.test(buyerInfo.phone)) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    return isValid;
  }

  $: {
    buyerInfo = buyerInfo || {};
    buyerInfo.address = buyerInfo.address || {};
  }
</script>

<div class="buyer-info-form">
  <h3>Buyer Information</h3>
  <form>
    <div class="form-group">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        bind:value={buyerInfo.email}
        required
        placeholder="john.doe@example.com"
      />
      {#if errors.email}<span class="error">{errors.email}</span>{/if}
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          bind:value={buyerInfo.firstName}
          required
          placeholder="John"
        />
        {#if errors.firstName}<span class="error">{errors.firstName}</span>{/if}
      </div>
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          bind:value={buyerInfo.lastName}
          required
          placeholder="Doe"
        />
        {#if errors.lastName}<span class="error">{errors.lastName}</span>{/if}
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="businessName">Business Name</label>
        <input
          type="text"
          id="businessName"
          bind:value={buyerInfo.businessName}
          placeholder="Acme Inc."
        />
      </div>
      <div class="form-group">
        <label for="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          bind:value={buyerInfo.phone}
          placeholder="+1 (555) 123-4567"
        />
        {#if errors.phone}<span class="error">{errors.phone}</span>{/if}
      </div>
    </div>
    <div class="form-group">
      <label for="street-address">Street Address</label>
      <input
        type="text"
        id="street-address"
        bind:value={buyerInfo.address["street-address"]}
        placeholder="123 Main St, Apt 4B"
      />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="locality">City</label>
        <input
          type="text"
          id="locality"
          bind:value={buyerInfo.address.locality}
          placeholder="San Francisco"
        />
      </div>
      <div class="form-group">
        <label for="region">State/Province</label>
        <input
          type="text"
          id="region"
          bind:value={buyerInfo.address.region}
          placeholder="CA"
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="country-name">Country</label>
        <input
          type="text"
          id="country-name"
          bind:value={buyerInfo.address["country-name"]}
          placeholder="United States"
        />
      </div>
      <div class="form-group">
        <label for="postal-code">Postal Code</label>
        <input
          type="text"
          id="postal-code"
          bind:value={buyerInfo.address["postal-code"]}
          placeholder="94105"
        />
      </div>
    </div>
    <div class="button-group">
      <button
        class="btn btn-secondary"
        type="button"
        on:click={() => {
          currentPaymentStep = "currency";
        }}>Back</button
      >
      <button
        type="button"
        on:click={() => {
          if (validateForm()) {
            currentPaymentStep = "confirmation";
          }
        }}
        class="btn">Continue to Payment</button
      >
    </div>
  </form>
</div>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap");

  .buyer-info-form {
    font-family: "Montserrat", sans-serif;
    color: #333;
    max-height: 100%;
    padding: 1rem;
    max-width: 90%;

    h3 {
      margin: 0 0 1rem;
      font-size: 18px;
      font-weight: bold;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-row {
      display: flex;
      gap: 8px;

      input {
        width: 90% !important;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 0.5rem;
    }

    label {
      font-size: 14px;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: #0bb489;
      }
    }

    .error {
      color: #ff4136;
      font-size: 12px;
    }

    .button-group {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 1rem;
    }

    .btn {
      display: inline-flex;
      cursor: pointer;
      color: white;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      background-color: #0bb489;
      border: none;
      outline: none;
      width: 100%;
      padding: 8px 16px;
      gap: 8px;

      &:hover {
        background-color: darken(#0bb489, 10%);
      }

      &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
    }

    .btn-secondary {
      background-color: #666;

      &:hover {
        background-color: rgba($color: #666, $alpha: 0.8);
      }
    }
  }
</style>
