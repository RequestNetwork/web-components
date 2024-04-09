<script lang="ts" customElements="create-request-form">
  import { ethers } from 'ethers';
  import { Types, Utils } from '@requestnetwork/request-client.js';
  import type { RequestNetwork } from '@requestnetwork/request-client.js';

  export let requestNetwork: RequestNetwork;
  export let signer: string; 
  let amount = '';
  let payerAddress = '';
  let payeeAddress = '';
  let paymentReason = 'Service Payment';
  let dueDate = '';
  let requestInitialized = false;
  
  async function submitForm() {
    if (!requestNetwork || !signer) {
      console.error('Request Network or signer not properly initialized.');
      return;
    }

    const requestCreateParameters = {
      requestInfo: {
        currency: {
          type: Types.RequestLogic.CURRENCY.ETH,
          value: 'ETH',
          network: 'sepolia'
        },
        expectedAmount: ethers.utils.parseUnits(amount, 'ether').toString(),
        payee: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payeeAddress,
        },
        payer: {
          type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
          value: payerAddress,
        },
        timestamp: Utils.getCurrentTimestampInSecond(),
      },
      paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT,
        parameters: {
          paymentAddress: payeeAddress,
          feeAddress:  ethers.constants.AddressZero,
          feeAmount: ethers.utils.parseUnits('0.1', 'ether').toString(),
        },
      },
      contentData: {
        reason: paymentReason,
        dueDate: dueDate,
      },
      signer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: signer,
      } 
    };

    try {
      const request = await requestNetwork.createRequest({
        requestInfo: requestCreateParameters.requestInfo,
        paymentNetwork: requestCreateParameters.paymentNetwork,
        contentData: requestCreateParameters.contentData,
        signer: requestCreateParameters.signer,
      } as any);
      requestInitialized = true;
      const confirmedRequestData = await request.waitForConfirmation();
      console.log('Request created successfully:', confirmedRequestData);
      alert('Invoice Created Successfully!');
    } catch (error) {
      console.log('Failed to create request:', error);
      alert('Failed to create invoice.');
    }
  }
</script>

<form on:submit|preventDefault={submitForm} class="form">
  <input type="text" bind:value={amount} placeholder="Amount in ETH" />
  <input type="text" bind:value={payerAddress} placeholder="Payer Address" />
  <input type="text" bind:value={payeeAddress} placeholder="Payee Address" />
  <input type="text" bind:value={paymentReason} placeholder="Payment Reason" />
  <input type="date" bind:value={dueDate} placeholder="Due Date" />
  <button type="submit">Submit Invoice</button>
  {#if requestInitialized}
    <div class="confirmation-wrapper">
      <p>Waiting for confirmation...</p>
      <div class="loader"></div>
    </div>
  {/if}
</form>

<style>
  .form{
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin-top: 200px;
  }

  .form input{
    width: 400px;
  }

  .confirmation-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }

  .loader {
    width: 124px;
    height: 24px;
    -webkit-mask: 
      conic-gradient(from 135deg at top   ,#0000,#000 .5deg 90deg,#0000 90.5deg) 0 0   ,
      conic-gradient(from -45deg at bottom,#0000,#000 .5deg 90deg,#0000 90.5deg) 0 100%;
    -webkit-mask-size:25% 50%;
    -webkit-mask-repeat:repeat-x;
    background: linear-gradient(#25b09b 0 0) left/0% 100% no-repeat #ddd;
    animation: l13 2s infinite linear;
  }
  @keyframes l13 {
    100% {background-size: 100% 100%}
  }
</style>