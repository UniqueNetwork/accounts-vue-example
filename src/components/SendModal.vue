<script setup lang="ts">
  import { ref } from 'vue';
  import Modal from './Modal.vue';
  import { isEthersSigner } from '../accounts/AccountsManager';
  import type { Account } from '../accounts/types';
  import { useSdkStore } from '../stores/sdk';
  import { Address } from '@unique-nft/utils';
  import { UniqueFungibleFactory } from '@unique-nft/solidity-interfaces';

  const { chainProperties, sdk } = useSdkStore();

  const props = defineProps<{
    isVisible: boolean,
    currentAccount?: Account
  }>()
  const emit = defineEmits<{
    (e: 'close'): void
  }>();
  const receiverAddress = ref<string>();
  const amount = ref<number>();
  const isLoading = ref<boolean>(false);

  const onSendClick = async () => {
    if(!amount.value || !receiverAddress.value || !props.currentAccount) return;
    isLoading.value = true;

    if(isEthersSigner(props.currentAccount.signer)) {
      const from = Address.extract.ethCrossAccountId(props.currentAccount.address);
      const to = Address.extract.ethCrossAccountId(receiverAddress.value);
      const uniqueFungible = await UniqueFungibleFactory(0, props.currentAccount.signer);
      const amountRaw = BigInt(amount.value) * BigInt(10) ** BigInt(chainProperties?.decimals || 18);

      await (await uniqueFungible.transferFromCross(from, to, amountRaw, { from: props.currentAccount.address })).wait();
    } else {
      await sdk?.balance.transfer.submitWaitResult({
        address: props.currentAccount.address,
        destination: receiverAddress.value,
        amount: amount.value,
      }, {
        signer: props.currentAccount.signer
      })
    }
    
    isLoading.value = false;
    emit('close');
  }
</script>
<template>
  <Modal :is-visible="props.isVisible" title="Sign" @close="emit('close')" >
    <div class="form-item">
      <input type="text" placeholder="Receiver" v-model="receiverAddress" />
    </div>
    <div class="form-item">
      <input type="number" placeholder="Amount" v-model="amount" />
    </div>
    <div v-if="isLoading" class="form-item">
      Processing...
    </div>
    <div class="form-item">
      <button @click="onSendClick()" :disabled="isLoading">Send</button>
      <button @click="emit('close')">Cancel</button>
    </div>
  </Modal>
</template>