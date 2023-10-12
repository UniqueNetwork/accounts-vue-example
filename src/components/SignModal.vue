<script setup lang="ts">
  import { ref } from 'vue';
  import { useSignModalIsVisibleStore } from '../stores/sign-modal';
  import Modal from './Modal.vue';
  const SignModalProps = useSignModalIsVisibleStore()

  const password = ref<string>();
  const error = ref<boolean>(false);

  const onSignClick = () => {
    if(password.value && SignModalProps.openCallback?.(password.value)) {
      SignModalProps.onSign?.();
    } else {
      error.value = true;
    }
  }

</script>
<template>
  <Modal :is-visible="SignModalProps.isVisible" title="Sign" @close="SignModalProps.closeModal" >
    <div class="form-item">
      <input type="password" placeholder="Password" v-model="password" />
    </div>
    <div :v-if="error" className="form-item">
      <span className="form-error">Unable to decode using the supplied passphrase</span> 
    </div>
    <div class="form-item">
      <button @click="onSignClick()">Sign</button>
      <button @click="SignModalProps.closeModal()">Cancel</button>
    </div>
  </Modal>
</template>