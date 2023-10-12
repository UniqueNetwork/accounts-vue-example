import { defineStore } from "pinia";
import { ref } from "vue";

export const useSignModalIsVisibleStore = defineStore('signModalIsVisible', () => {
  const isVisible = ref<boolean>();
  const onSign = ref<() => void>();
  const onClose = ref<() => void>();
  const openCallback = ref<(passphrase: string) => boolean>()

  const showModal = async (cb: (passphrase: string) => boolean) => {
    isVisible.value = true;
    openCallback.value = cb;
    return new Promise<void>((resolve, reject) => {
      onSign.value = () => {
        isVisible.value = false;
        resolve();
      }
      onClose.value = reject;
    });
  }

  const closeModal = () => {
    isVisible.value = false;
    onClose.value?.();
  }

  return {
    isVisible,
    showModal,
    openCallback,
    onSign,
    closeModal,
  }
});