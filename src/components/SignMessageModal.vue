
<script setup lang="ts">
  import { ref } from 'vue';
  import Modal from './Modal.vue';
  import { SignerTypeEnum, type Account } from '../accounts/types';
  import { KeyringSigner } from '../accounts/KeyringSigner';
  import type { SignerResult } from '@unique-nft/utils/extension';
  import { type Signer as EthersSigner } from "ethers";

  const props = defineProps<{
    isVisible: boolean,
    currentAccount?: Account
  }>()
  const emit = defineEmits<{
    (e: 'close'): void
  }>();
  const message = ref<string>();
  const result = ref<string>();
  const isLoading = ref<boolean>(false);

  const onSignClick = async () => {
    if(!message.value || !props.currentAccount) return;
    
    isLoading.value = true;
    let signature: string;

    switch (props.currentAccount.signerType) {
      case SignerTypeEnum.Local: 
        signature = await (props.currentAccount.signer as KeyringSigner).signMessage(message.value); 
        break;
      case SignerTypeEnum.Polkadot: 
        const result = await props.currentAccount.signer.signMessage?.(message.value) as SignerResult; 
        signature = result.signature;
        break;
      case SignerTypeEnum.Metamask: 
        signature = await (props.currentAccount.signer as EthersSigner).signMessage(message.value); 
    }
    isLoading.value = false;
    result.value = signature;
  }

</script>
<template>
  <Modal :is-visible="props.isVisible" title="Sign message" @close="emit('close')" >
    <div class="form-item">
      <input type="text" placeholder="Message" v-model="message" />
    </div>
    <div class="form-item">
      <input type="text" placeholder="Result" v-model="result" />
    </div>
    <div v-if="isLoading" class="form-item">
      Processing...
    </div>
    <div class="form-item">
      <button @click="onSignClick()" :disabled="isLoading">Sign</button>
      <button @click="emit('close')">Cancel</button>
    </div>
  </Modal>
</template>