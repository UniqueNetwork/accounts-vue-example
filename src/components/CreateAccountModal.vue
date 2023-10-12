
<script setup lang="ts">
  import { ref } from 'vue';
  import Modal from './Modal.vue';
  import { useAccountsStore } from '@/stores/accounts';
  import { addLocalAccount } from '@/accounts/AccountsManager';
  import { Sr25519Account } from '@unique-nft/sr25519';

  const { getAccounts } = useAccountsStore()

  const { isVisible } = defineProps<{
    isVisible: boolean,
  }>()
  const emit = defineEmits<{
    (e: 'close'): void
  }>();
  const mnemonic = ref<string>();
  const name = ref<string>();
  const password = ref<string>();

  const onGenerateClick = () => {
    mnemonic.value = Sr25519Account.generateMnemonic(12);
  }

  const onCreateClick = async () => {
    if(!mnemonic.value) return;
    if (!mnemonic.value || !name.value || !password.value) return;

    addLocalAccount(name.value, mnemonic.value, password.value);
    await getAccounts();

    emit('close');
  }
</script>
<template>
  <Modal :is-visible="isVisible" title="Create account" @close="emit('close')" >
    <div class="form-item">
      <input type="text" placeholder="Mnemonic phrase" v-model="mnemonic" />
    </div>
    <div class="form-item">
      <button @click="onGenerateClick()">Generate</button>
    </div>
    <div class="form-item">
      <input type="text" placeholder="Name" v-model="name" />
    </div>
    <div class="form-item">
      <input type="text" placeholder="Password" v-model="password" />
    </div>
    <div class="form-item">
      <button @click="onCreateClick()">Create</button>
      <button @click="emit('close')">Cancel</button>
    </div>
  </Modal>
</template>