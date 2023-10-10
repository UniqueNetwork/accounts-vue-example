import { getLocalAccounts, getPolkadotAccounts, getMetamaskAccount } from "@/accounts/AccountsManager";
import { type KeyringPair } from "@polkadot/keyring/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSignModalIsVisibleStore = defineStore('signModalIsVisible', () => {
  const isVisible = ref<boolean>();
  const keyringPair = ref<KeyringPair>();
  const onSign = ref<() => void>();
  const onClose = ref<() => void>();

  const showModal = async (pair: KeyringPair) => {
    isVisible.value = true;
    keyringPair.value = pair;
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
    keyringPair,
    showModal,
    onSign,
    closeModal,
  }
});