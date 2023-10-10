
<script setup lang="ts">
  import { ref } from 'vue';
  import Modal from './Modal.vue';
  import keyring from '@polkadot/ui-keyring';
  import { useAccountsStore } from '@/stores/accounts';
  import { mnemonicGenerate } from '@polkadot/util-crypto';

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
    mnemonic.value = mnemonicGenerate(12);
  }

  const onCreateClick = async () => {
    if(!mnemonic.value) return;
    if (!mnemonic.value || !name.value || !password.value) return;

    keyring.addUri(mnemonic.value, password.value, { name: name.value });

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